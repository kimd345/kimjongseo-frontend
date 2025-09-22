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

export interface AttachedFile {
	id: string;
	fileName: string;
	originalName: string;
	url: string;
	type: 'image' | 'document' | 'video';
	category: string;
	size: number;
	uploadedAt: string;
}

// Define section type with optional subsections
interface SectionInfo {
	name: string;
	description: string;
	subsections?: Record<string, string>;
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
		},
	},
	library: {
		name: '자료실',
		description: '김종서 장군과 관련된 각종 자료와 연구 성과를 제공합니다.',
		subsections: {
			press: '보도자료',
			academic: '학술 자료·연구 보고서',
			archive: '사진·영상 아카이브',
			sources: '관련 사료 및 연구',
			announcements: '공지사항',
		},
	},
	contact: {
		name: '연락처 & 오시는 길',
		description: '기념사업회 위치와 연락처 정보를 안내합니다.',
	},
};

// Helper function to check if section has subsections
export function hasSubsections(
	section: SectionInfo
): section is SectionInfo & { subsections: Record<string, string> } {
	return 'subsections' in section && section.subsections !== undefined;
}

// Client-side functions for loading content via API
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

// Utility function to extract all file references from content
export function extractFileReferences(content: string): string[] {
	const fileUrls: string[] = [];

	// Extract markdown images
	const imageMatches = content.match(/!\[.*?\]\(([^)]+)\)/g) || [];
	imageMatches.forEach((match) => {
		const urlMatch = match.match(/\(([^)]+)\)/);
		if (urlMatch && !fileUrls.includes(urlMatch[1])) {
			fileUrls.push(urlMatch[1]);
		}
	});

	// Extract markdown links to files
	const linkMatches =
		content.match(/\[.*?\]\(([^)]+\.(pdf|doc|docx|xls|xlsx|zip|rar))\)/gi) ||
		[];
	linkMatches.forEach((match) => {
		const urlMatch = match.match(/\(([^)]+)\)/);
		if (urlMatch && !fileUrls.includes(urlMatch[1])) {
			fileUrls.push(urlMatch[1]);
		}
	});

	return fileUrls;
}

// Server-side only function to clean up orphaned files
// This should only be imported in API routes
export async function cleanupOrphanedFiles(
	contentId: string,
	newContent: string,
	oldContent?: string
): Promise<void> {
	if (!oldContent) return;

	const oldFiles = extractFileReferences(oldContent);
	const newFiles = extractFileReferences(newContent);

	const orphanedFiles = oldFiles.filter((file) => !newFiles.includes(file));

	if (orphanedFiles.length > 0) {
		console.log('Cleaning up orphaned files:', orphanedFiles);

		// Dynamic import to avoid bundling Storage in client
		const { Storage } = await import('@/lib/storage');

		for (const fileUrl of orphanedFiles) {
			try {
				await Storage.deleteFile(fileUrl);
				console.log('Deleted orphaned file:', fileUrl);
			} catch (error) {
				console.warn('Failed to delete orphaned file:', fileUrl, error);
			}
		}
	}
}
