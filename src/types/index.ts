// 5. UPDATE: src/types/index.ts - Simplified types
export interface User {
	username: string;
	role: string;
}

export interface LoginResponse {
	token: string;
	user: User;
}

export interface Menu {
	id: string;
	name: string;
	url: string;
	description?: string;
	children?: Menu[];
}

export interface Content {
	id: string;
	title: string;
	content: string;
	section: string;
	type: 'article' | 'announcement' | 'press' | 'academic' | 'video';
	status: 'draft' | 'published';
	category?: string;
	publishedAt: string;
	author?: string;
	images?: string[];
	youtubeId?: string;
	youtubeUrls?: string[];
	viewCount: number;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
	menu?: Menu;
}

export enum ContentType {
	ARTICLE = 'article',
	ANNOUNCEMENT = 'announcement',
	PRESS_RELEASE = 'press',
	ACADEMIC_MATERIAL = 'academic',
	VIDEO = 'video',
}

export enum PublishStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page?: number;
	limit?: number;
}
