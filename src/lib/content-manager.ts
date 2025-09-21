// src/lib/content-manager.ts - Updated with reorganized sections
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

// Define section type with optional subsections
interface SectionInfo {
	name: string;
	description: string;
	subsections?: Record<string, string>; // Optional subsections
}

// Updated site structure with reorganized subsections
export const FIXED_SECTIONS: Record<string, SectionInfo> = {
	'about-general': {
		name: '절재 김종서 장군',
		description:
			'조선 초기의 명재상이자 무장인 김종서 장군의 생애와 업적을 소개합니다.',
		subsections: {
			life: '생애 및 업적',
			significance: '역사적 의의',
			// Removed: sources (moved to library)
			// Removed: photos (removed completely)
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
			// Removed: announcements (moved to library)
		},
	},
	library: {
		name: '자료실',
		description: '김종서 장군과 관련된 각종 자료와 연구 성과를 제공합니다.',
		subsections: {
			press: '보도자료',
			academic: '학술 자료·연구 보고서',
			archive: '사진·영상 아카이브',
			sources: '관련 사료 및 연구', // Moved from about-general
			announcements: '공지사항', // Moved from organization
		},
	},
	contact: {
		name: '연락처 & 오시는 길',
		description: '기념사업회 위치와 연락처 정보를 안내합니다.',
		// No subsections - will be hard-coded page
	},
};

// Helper function to check if section has subsections
export function hasSubsections(
	section: SectionInfo
): section is SectionInfo & { subsections: Record<string, string> } {
	return 'subsections' in section && section.subsections !== undefined;
}

// Client-side functions for loading content
export async function loadContent(): Promise<Record<string, ContentItem[]>> {
	try {
		const response = await fetch('/api/content');
		const data = await response.json();
		return data.content || {};
	} catch (error) {
		console.error('Failed to load content:', error);
		return {};
	}
}

export async function findContentById(id: string): Promise<ContentItem | null> {
	try {
		const response = await fetch(`/api/content/${id}`);
		if (response.ok) {
			return await response.json();
		}
		return null;
	} catch (error) {
		console.error('Failed to find content by ID:', error);
		return null;
	}
}
