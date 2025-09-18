// src/lib/content-manager.ts - NEW FILE
// This replaces the complex database + API system

export interface ContentItem {
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
}

// Fixed site structure - no more dynamic menus
export const FIXED_SECTIONS = {
	'about-general': {
		name: '절재 김종서 장군',
		description:
			'조선 초기의 명재상이자 무장인 김종서 장군의 생애와 업적을 소개합니다.',
		subsections: {
			life: '생애 및 업적',
			significance: '역사적 의의',
			sources: '관련 사료 및 연구',
			photos: '사진·영상 자료',
		},
	},
	organization: {
		name: '기념사업회',
		description: '김종서장군기념사업회의 설립 목적과 주요 활동을 안내합니다.',
		subsections: {
			overview: '사업회 소개',
			chairman: '회장 인사말',
			history: '연혁',
			projects: '선양사업',
			announcements: '공지사항',
		},
	},
	library: {
		name: '자료실',
		description: '김종서 장군과 관련된 각종 자료와 연구 성과를 제공합니다.',
		subsections: {
			press: '보도자료',
			academic: '학술 자료·연구 보고서',
			archive: '사진·영상 아카이브',
		},
	},
	contact: {
		name: '연락처 & 오시는 길',
		description: '기념사업회 위치와 연락처 정보를 안내합니다.',
	},
};

// Content management class
export class ContentManager {
	// Get all content or by section
	static async getContent(params?: {
		section?: string;
		status?: 'draft' | 'published';
		type?: string;
		limit?: number;
	}): Promise<{ data: ContentItem[]; total: number }> {
		const queryString = new URLSearchParams();
		if (params?.section) queryString.set('section', params.section);
		if (params?.status) queryString.set('status', params.status);
		if (params?.type) queryString.set('type', params.type);
		if (params?.limit) queryString.set('limit', params.limit.toString());

		const response = await fetch(`/api/content?${queryString}`);
		const data = await response.json();

		const allContent = params?.section
			? data.content[params.section] || []
			: Object.values(data.content || {}).flat();

		const filteredContent = allContent.filter((item: ContentItem) => {
			if (params?.status && item.status !== params.status) return false;
			if (params?.type && item.type !== params.type) return false;
			return true;
		});

		const limitedContent = params?.limit
			? filteredContent.slice(0, params.limit)
			: filteredContent;

		return {
			data: limitedContent,
			total: filteredContent.length,
		};
	}

	// Get content by ID
	static async getContentById(id: string): Promise<ContentItem | null> {
		const response = await fetch(`/api/content/${id}`);
		return response.ok ? response.json() : null;
	}

	// Create new content
	static async createContent(
		content: Partial<ContentItem>
	): Promise<ContentItem> {
		const response = await fetch('/api/content', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(content),
		});
		return response.json();
	}

	// Update existing content
	static async updateContent(
		id: string,
		updates: Partial<ContentItem>
	): Promise<ContentItem> {
		const response = await fetch(`/api/content/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updates),
		});
		return response.json();
	}

	// Delete content
	static async deleteContent(id: string): Promise<void> {
		await fetch(`/api/content/${id}`, { method: 'DELETE' });
	}

	// Increment view count
	static async incrementViewCount(id: string): Promise<ContentItem> {
		const response = await fetch(`/api/content/${id}/view`, { method: 'POST' });
		return response.json();
	}

	// Upload file
	static async uploadFile(
		file: File
	): Promise<{ url: string; originalName: string; type: string }> {
		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});
		return response.json();
	}

	// Get section info
	static getSectionInfo(sectionId: string) {
		return FIXED_SECTIONS[sectionId as keyof typeof FIXED_SECTIONS];
	}

	// Get all sections for navigation
	static getAllSections() {
		return Object.entries(FIXED_SECTIONS).map(([id, section]) => ({
			id,
			...section,
		}));
	}
}
