// src/lib/api.ts
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import {
	User,
	LoginResponse,
	Menu,
	Content,
	FileUpload,
	PaginatedResponse,
	ContentType,
	PublishStatus,
} from '@/types';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
	private client = axios.create({
		baseURL: API_BASE_URL,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	constructor() {
		// Add auth token to requests
		this.client.interceptors.request.use((config) => {
			const token = Cookies.get('auth_token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		// Handle auth errors
		this.client.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					Cookies.remove('auth_token');
					window.location.href = '/admin/login';
				}
				return Promise.reject(error);
			}
		);
	}

	// Auth endpoints
	async login(username: string, password: string): Promise<LoginResponse> {
		const response = await this.client.post<LoginResponse>('/auth/login', {
			username,
			password,
		});
		return response.data;
	}

	async getProfile(): Promise<User> {
		const response = await this.client.get<User>('/auth/profile');
		return response.data;
	}

	async changePassword(
		oldPassword: string,
		newPassword: string
	): Promise<{ message: string }> {
		const response = await this.client.post<{ message: string }>(
			'/auth/change-password',
			{
				oldPassword,
				newPassword,
			}
		);
		return response.data;
	}

	// Menu endpoints
	async getMenus(): Promise<Menu[]> {
		const response = await this.client.get<Menu[]>('/menu');
		return response.data;
	}

	async getMenuTree(): Promise<Menu[]> {
		const response = await this.client.get<Menu[]>('/menu/tree');
		return response.data;
	}

	async getMenuByUrl(url: string): Promise<Menu> {
		const response = await this.client.get<Menu>(`/menu/by-url/${url}`);
		return response.data;
	}

	async createMenu(menuData: Partial<Menu>): Promise<Menu> {
		const response = await this.client.post<Menu>('/menu', menuData);
		return response.data;
	}

	async updateMenu(id: number, menuData: Partial<Menu>): Promise<Menu> {
		const response = await this.client.patch<Menu>(`/menu/${id}`, menuData);
		return response.data;
	}

	async deleteMenu(id: number): Promise<void> {
		await this.client.delete(`/menu/${id}`);
	}

	async seedDefaultMenus(): Promise<void> {
		await this.client.post('/menu/seed');
	}

	// Content endpoints
	async getContents(params?: {
		type?: ContentType;
		status?: PublishStatus;
		menuId?: number;
		page?: number;
		limit?: number;
	}): Promise<PaginatedResponse<Content>> {
		const response = await this.client.get<PaginatedResponse<Content>>(
			'/content',
			{ params }
		);
		return response.data;
	}

	async getContentsByMenu(menuUrl: string): Promise<Content[]> {
		const response = await this.client.get<Content[]>(
			`/content/by-menu/${menuUrl}`
		);
		return response.data;
	}

	async getContent(id: number): Promise<Content> {
		const response = await this.client.get<Content>(`/content/${id}`);
		return response.data;
	}

	async incrementContentView(id: number): Promise<Content> {
		const response = await this.client.get<Content>(`/content/${id}/view`);
		return response.data;
	}

	async createContent(contentData: Partial<Content>): Promise<Content> {
		const response = await this.client.post<Content>('/content', contentData);
		return response.data;
	}

	async updateContent(
		id: number,
		contentData: Partial<Content>
	): Promise<Content> {
		const response = await this.client.patch<Content>(
			`/content/${id}`,
			contentData
		);
		return response.data;
	}

	async deleteContent(id: number): Promise<void> {
		await this.client.delete(`/content/${id}`);
	}

	// File upload endpoints
	async uploadFile(
		file: File,
		contentId?: number,
		category?: string
	): Promise<FileUpload> {
		const formData = new FormData();
		formData.append('file', file);
		if (contentId) formData.append('contentId', contentId.toString());
		if (category) formData.append('category', category);

		const response = await this.client.post<FileUpload>(
			'/upload/single',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return response.data;
	}

	async uploadMultipleFiles(
		files: File[],
		contentId?: number,
		category?: string
	): Promise<FileUpload[]> {
		const formData = new FormData();
		files.forEach((file) => formData.append('files', file));
		if (contentId) formData.append('contentId', contentId.toString());
		if (category) formData.append('category', category);

		const response = await this.client.post<FileUpload[]>(
			'/upload/multiple',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return response.data;
	}

	async getFiles(category?: string): Promise<FileUpload[]> {
		const response = await this.client.get<FileUpload[]>('/upload', {
			params: category ? { category } : {},
		});
		return response.data;
	}

	async deleteFile(id: number): Promise<void> {
		await this.client.delete(`/upload/${id}`);
	}

	getFileUrl(id: number): string {
		return `${API_BASE_URL}/upload/serve/${id}`;
	}

	getDownloadUrl(id: number): string {
		return `${API_BASE_URL}/upload/download/${id}`;
	}
}

export const api = new ApiClient();
