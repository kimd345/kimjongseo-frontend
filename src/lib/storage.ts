// Step 1: Create src/lib/storage.ts (Universal Storage Interface)
// This keeps your existing code mostly unchanged

interface StorageInterface {
	saveContent(content: any): Promise<void>;
	loadContent(): Promise<any>;
	uploadFile(file: File, fileName: string, category: string): Promise<string>;
	deleteFile(filePath: string): Promise<void>;
}

class GitHubStorage implements StorageInterface {
	private baseUrl = 'https://api.github.com';
	private owner = process.env.GITHUB_OWNER!;
	private repo = process.env.GITHUB_REPO!;
	private token = process.env.GITHUB_TOKEN!;

	private async githubFetch(path: string, options: RequestInit = {}) {
		const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`;
		const response = await fetch(url, {
			...options,
			headers: {
				Authorization: `token ${this.token}`,
				'Content-Type': 'application/json',
				...options.headers,
			},
		});

		if (!response.ok) {
			if (response.status === 404 && options.method === 'GET') {
				throw new Error('FILE_NOT_FOUND');
			}
			const error = await response.text();
			throw new Error(`GitHub API error: ${response.status} ${error}`);
		}

		return response.json();
	}

	async saveContent(content: any): Promise<void> {
		const contentString = JSON.stringify(content, null, 2);
		const contentBase64 = Buffer.from(contentString).toString('base64');

		try {
			// Get current file SHA if it exists
			let sha;
			try {
				const existing = await this.githubFetch('data/content.json');
				sha = existing.sha;
			} catch (error) {
				// File doesn't exist, no SHA needed
			}

			// Create or update file
			await this.githubFetch('data/content.json', {
				method: 'PUT',
				body: JSON.stringify({
					message: `Update content - ${new Date().toISOString()}`,
					content: contentBase64,
					...(sha && { sha }),
				}),
			});

			console.log('Content saved to GitHub successfully');
		} catch (error) {
			console.error('Failed to save content to GitHub:', error);
			throw error;
		}
	}

	async loadContent(): Promise<any> {
		try {
			const result = await this.githubFetch('data/content.json');
			const contentString = Buffer.from(result.content, 'base64').toString(
				'utf-8'
			);
			return JSON.parse(contentString);
		} catch (error: any) {
			if (error.message === 'FILE_NOT_FOUND') {
				console.log('Content file not found, creating default structure');
				const defaultContent = { content: {} };
				await this.saveContent(defaultContent);
				return defaultContent;
			}
			throw error;
		}
	}

	async uploadFile(
		file: File,
		fileName: string,
		category: string
	): Promise<string> {
		const buffer = await file.arrayBuffer();
		const contentBase64 = Buffer.from(buffer).toString('base64');
		const path = `public/uploads/${category}/${fileName}`;

		try {
			await this.githubFetch(path, {
				method: 'PUT',
				body: JSON.stringify({
					message: `Upload file: ${fileName}`,
					content: contentBase64,
				}),
			});

			// Return the GitHub raw URL
			const fileUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/${path}`;
			console.log('File uploaded to GitHub:', fileUrl);
			return fileUrl;
		} catch (error) {
			console.error('Failed to upload file to GitHub:', error);
			throw error;
		}
	}

	async deleteFile(filePath: string): Promise<void> {
		let path = filePath;

		// Handle different URL formats
		if (filePath.includes('raw.githubusercontent.com')) {
			// Extract path from GitHub raw URL
			// https://raw.githubusercontent.com/owner/repo/main/public/uploads/images/file.jpg
			const parts = filePath.split('/main/');
			if (parts.length > 1) {
				path = parts[1]; // Gets "public/uploads/images/file.jpg"
			}
		} else if (filePath.startsWith('/uploads/')) {
			// Convert local path to GitHub path
			path = `public${filePath}`; // "/uploads/images/file.jpg" -> "public/uploads/images/file.jpg"
		} else if (filePath.startsWith('uploads/')) {
			// Handle path without leading slash
			path = `public/${filePath}`;
		}

		console.log(`Attempting to delete file: ${path} (original: ${filePath})`);

		try {
			// Get file SHA first (required for deletion)
			const existing = await this.githubFetch(path);

			// Delete file
			await this.githubFetch(path, {
				method: 'DELETE',
				body: JSON.stringify({
					message: `Delete file: ${path}`,
					sha: existing.sha,
				}),
			});

			console.log('File deleted from GitHub:', path);
		} catch (error: any) {
			console.warn('Failed to delete file from GitHub:', error);

			// If file not found, that's actually okay (already deleted)
			if (error.message?.includes('404')) {
				console.log('File already deleted or not found:', path);
				return;
			}

			// For other errors, don't throw - deletion failures shouldn't break content deletion
			console.error('GitHub file deletion error:', error);
		}
	}
}

// Fallback to filesystem for development
class FileSystemStorage implements StorageInterface {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	private fs = require('fs').promises;
	private path = require('path');
	private CONTENT_FILE = this.path.join(process.cwd(), 'data', 'content.json');

	async saveContent(content: any): Promise<void> {
		const dataDir = this.path.dirname(this.CONTENT_FILE);
		await this.fs.mkdir(dataDir, { recursive: true });
		await this.fs.writeFile(
			this.CONTENT_FILE,
			JSON.stringify(content, null, 2)
		);
	}

	async loadContent(): Promise<any> {
		try {
			const data = await this.fs.readFile(this.CONTENT_FILE, 'utf8');
			return JSON.parse(data);
		} catch (error) {
			console.log('Content file not found, creating default structure');
			return { content: {} };
		}
	}

	async uploadFile(
		file: File,
		fileName: string,
		category: string
	): Promise<string> {
		const uploadsPath = this.path.join(
			process.cwd(),
			'public',
			'uploads',
			category
		);
		await this.fs.mkdir(uploadsPath, { recursive: true });

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const filePath = this.path.join(uploadsPath, fileName);

		await this.fs.writeFile(filePath, buffer);
		return `/uploads/${category}/${fileName}`;
	}

	async deleteFile(filePath: string): Promise<void> {
		const fullPath = this.path.join(process.cwd(), 'public', filePath);
		try {
			await this.fs.unlink(fullPath);
		} catch (error) {
			console.warn('Failed to delete file:', error);
		}
	}
}

// Auto-select storage based on environment and create singleton instance
const storage =
	process.env.NODE_ENV === 'production' && process.env.GITHUB_TOKEN
		? new GitHubStorage()
		: new FileSystemStorage();

export { storage as Storage };
