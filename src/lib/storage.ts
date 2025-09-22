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
			const parts = filePath.split('/main/');
			if (parts.length > 1) {
				path = parts[1];
			}
		} else if (filePath.startsWith('/uploads/')) {
			path = `public${filePath}`;
		} else if (filePath.startsWith('uploads/')) {
			path = `public/${filePath}`;
		}

		console.log(`Attempting to delete file: ${path} (original: ${filePath})`);

		try {
			const existing = await this.githubFetch(path);
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
			if (error.message?.includes('404')) {
				console.log('File already deleted or not found:', path);
				return;
			}
			console.error('GitHub file deletion error:', error);
		}
	}
}

// Fallback for development - ONLY imported server-side
class FileSystemStorage implements StorageInterface {
	async saveContent(content: any): Promise<void> {
		// Dynamic imports to prevent webpack bundling
		const { promises: fs } = await import('fs');
		const { join, dirname } = await import('path');

		const contentFile = join(process.cwd(), 'data', 'content.json');
		const dataDir = dirname(contentFile);

		await fs.mkdir(dataDir, { recursive: true });
		await fs.writeFile(contentFile, JSON.stringify(content, null, 2));
	}

	async loadContent(): Promise<any> {
		try {
			const { promises: fs } = await import('fs');
			const { join } = await import('path');

			const contentFile = join(process.cwd(), 'data', 'content.json');
			const data = await fs.readFile(contentFile, 'utf8');
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
		const { promises: fs } = await import('fs');
		const { join } = await import('path');

		const uploadsPath = join(process.cwd(), 'public', 'uploads', category);
		await fs.mkdir(uploadsPath, { recursive: true });

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const filePath = join(uploadsPath, fileName);

		await fs.writeFile(filePath, buffer);
		return `/uploads/${category}/${fileName}`;
	}

	async deleteFile(filePath: string): Promise<void> {
		const { promises: fs } = await import('fs');
		const { join } = await import('path');

		const fullPath = join(process.cwd(), 'public', filePath);
		try {
			await fs.unlink(fullPath);
		} catch (error) {
			console.warn('Failed to delete file:', error);
		}
	}
}

// Create storage instance based on environment
function createStorage(): StorageInterface {
	// Check if we're in a server-side context
	if (typeof window !== 'undefined') {
		throw new Error('Storage should only be used server-side');
	}

	// Use GitHub storage in production with token, filesystem otherwise
	if (process.env.NODE_ENV === 'production' && process.env.GITHUB_TOKEN) {
		console.log('Using GitHub storage for production');
		return new GitHubStorage();
	}

	console.log('Using filesystem storage for development');
	return new FileSystemStorage();
}

// Export a factory function instead of a singleton
export const Storage = createStorage();
