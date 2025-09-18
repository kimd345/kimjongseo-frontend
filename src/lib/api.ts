// src/lib/api.ts - Complete API implementation for simplified architecture
interface ContentCreateData {
	title: string;
	content: string;
	section: string;
	type: 'article' | 'announcement' | 'press' | 'academic' | 'video';
	status: 'draft' | 'published';
	category?: string;
	youtubeId?: string;
	youtubeUrls?: string[];
	authorName?: string;
}

interface ContentUpdateData extends Partial<ContentCreateData> {}

interface ContentFilters {
	section?: string;
	type?: string;
	status?: string;
	limit?: number;
	page?: number;
}

class ApiClient {
	private getAuthHeaders(): HeadersInit {
		const token = this.getToken();
		return {
			'Content-Type': 'application/json',
			...(token && { Authorization: `Bearer ${token}` }),
		};
	}

	private getToken(): string | null {
		if (typeof window === 'undefined') return null;
		return (
			document.cookie
				.split('; ')
				.find((row) => row.startsWith('auth-token='))
				?.split('=')[1] || null
		);
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const error = await response.text();
			throw new Error(error || `HTTP ${response.status}`);
		}
		return response.json();
	}

	// Auth endpoints
	async login(username: string, password: string) {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
		return this.handleResponse(response);
	}

	async verifyAuth() {
		const response = await fetch('/api/auth/verify', {
			headers: this.getAuthHeaders(),
		});
		return this.handleResponse(response);
	}

	// Content endpoints
	async getContents(filters: ContentFilters = {}) {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined) params.append(key, value.toString());
		});

		const response = await fetch(`/api/content?${params}`);
		return this.handleResponse(response);
	}

	async getContent(id: string) {
		const response = await fetch(`/api/content/${id}`);
		return this.handleResponse(response);
	}

	async createContent(data: ContentCreateData) {
		const response = await fetch('/api/content', {
			method: 'POST',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(data),
		});
		return this.handleResponse(response);
	}

	async updateContent(id: string, data: ContentUpdateData) {
		const response = await fetch(`/api/content/${id}`, {
			method: 'PUT',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(data),
		});
		return this.handleResponse(response);
	}

	async deleteContent(id: string) {
		const response = await fetch(`/api/content/${id}`, {
			method: 'DELETE',
			headers: this.getAuthHeaders(),
		});
		return this.handleResponse(response);
	}

	// File upload
	async uploadFile(file: File, contentId?: string, category?: string) {
		const formData = new FormData();
		formData.append('file', file);
		if (contentId) formData.append('contentId', contentId);
		if (category) formData.append('category', category);

		const token = this.getToken();
		const response = await fetch('/api/upload', {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			body: formData,
		});
		return this.handleResponse(response);
	}

	// Utility methods for file URLs
	getFileUrl(filename: string, category: string = 'general'): string {
		return `/uploads/${category}/${filename}`;
	}

	getDownloadUrl(filename: string, category: string = 'general'): string {
		return `/uploads/${category}/${filename}`;
	}
}

export const api = new ApiClient();
