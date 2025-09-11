// src/types/index.ts
export interface User {
	id: number;
	username: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

export interface LoginResponse {
	access_token: string;
	user: User;
}

export interface Menu {
	id: number;
	name: string;
	url: string;
	description?: string;
	sortOrder: number;
	isActive: boolean;
	parentId?: number;
	parent?: Menu;
	children: Menu[];
	type: string;
	iconImage?: string;
	cssClass?: string;
}

export enum ContentType {
	ARTICLE = 'article',
	ANNOUNCEMENT = 'announcement',
	PRESS_RELEASE = 'press_release',
	ACADEMIC_MATERIAL = 'academic_material',
	VIDEO = 'video',
	PHOTO_GALLERY = 'photo_gallery',
}

export enum PublishStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
	PRIVATE = 'private',
}

export interface Content {
	id: number;
	title: string;
	content: string;
	type: ContentType;
	status: PublishStatus;
	category?: string;
	featuredImage?: string;
	attachments?: string[];
	youtubeId?: string;
	youtubeUrls?: string[];
	metadata?: any;
	viewCount: number;
	sortOrder: number;
	menu?: Menu;
	menuId?: number;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
	authorName?: string;
}

export interface FileUpload {
	id: number;
	originalName: string;
	fileName: string;
	filePath: string;
	mimeType: string;
	fileSize: number;
	contentId?: number;
	category: string;
	uploadedAt: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}
