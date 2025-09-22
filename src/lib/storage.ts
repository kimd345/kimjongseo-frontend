// src/lib/storage.ts - Server-only storage with proper Next.js handling
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
			let sha;
			try {
				const existing = await this.githubFetch('data/content.json');
				sha = existing.sha;
			} catch (error) {
				// File doesn't exist, no SHA needed
			}

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

// Fallback to filesystem for development (SERVER-SIDE ONLY)
class FileSystemStorage implements StorageInterface {
	private getFs() {
		// Only import fs on server-side
		if (typeof window !== 'undefined') {
			throw new Error('FileSystemStorage can only be used on the server');
		}
		// Dynamic import to avoid bundling fs in client
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		return require('fs').promises;
	}

	private getPath() {
		if (typeof window !== 'undefined') {
			throw new Error('FileSystemStorage can only be used on the server');
		}
		return require('path');
	}

	private get CONTENT_FILE() {
		const path = this.getPath();
		return path.join(process.cwd(), 'data', 'content.json');
	}

	async saveContent(content: any): Promise<void> {
		const fs = this.getFs();
		const path = this.getPath();
		const dataDir = path.dirname(this.CONTENT_FILE);
		await fs.mkdir(dataDir, { recursive: true });
		await fs.writeFile(this.CONTENT_FILE, JSON.stringify(content, null, 2));
	}

	async loadContent(): Promise<any> {
		const fs = this.getFs();
		try {
			const data = await fs.readFile(this.CONTENT_FILE, 'utf8');
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
		const fs = this.getFs();
		const path = this.getPath();
		const uploadsPath = path.join(process.cwd(), 'public', 'uploads', category);
		await fs.mkdir(uploadsPath, { recursive: true });

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const filePath = path.join(uploadsPath, fileName);

		await fs.writeFile(filePath, buffer);
		return `/uploads/${category}/${fileName}`;
	}

	async deleteFile(filePath: string): Promise<void> {
		const fs = this.getFs();
		const path = this.getPath();
		const fullPath = path.join(process.cwd(), 'public', filePath);
		try {
			await fs.unlink(fullPath);
		} catch (error) {
			console.warn('Failed to delete file:', error);
		}
	}
}

// Server-side only storage instance
function getStorage(): StorageInterface {
	// This function should only be called on the server
	if (typeof window !== 'undefined') {
		throw new Error('Storage can only be accessed on the server');
	}

	return process.env.NODE_ENV === 'production' && process.env.GITHUB_TOKEN
		? new GitHubStorage()
		: new FileSystemStorage();
}

// Export a getter instead of direct instance
export const Storage = {
	get instance() {
		return getStorage();
	},
	// Convenience methods that delegate to the instance
	saveContent: (content: any) => getStorage().saveContent(content),
	loadContent: () => getStorage().loadContent(),
	uploadFile: (file: File, fileName: string, category: string) =>
		getStorage().uploadFile(file, fileName, category),
	deleteFile: (filePath: string) => getStorage().deleteFile(filePath),
};
