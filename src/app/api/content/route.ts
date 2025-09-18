// src/app/api/content/route.ts - Fixed to properly handle section mapping
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

async function loadContent() {
	try {
		const data = await fs.readFile(CONTENT_FILE, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		console.log('Creating new content file');
		return { content: {} };
	}
}

async function saveContent(content: any) {
	const dataDir = path.dirname(CONTENT_FILE);
	await fs.mkdir(dataDir, { recursive: true });
	await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const section = searchParams.get('section');
		const status = searchParams.get('status');

		console.log('GET content request - section:', section, 'status:', status);

		const data = await loadContent();
		let content = data.content || {};

		if (section) {
			content = { [section]: content[section] || [] };
		}

		// Filter by status if specified
		if (status) {
			for (const sectionKey in content) {
				content[sectionKey] = content[sectionKey].filter(
					(item: any) => item.status === status
				);
			}
		}

		return NextResponse.json({ content });
	} catch (error) {
		console.error('GET content error:', error);
		return NextResponse.json(
			{ error: 'Failed to load content' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		console.log('POST content request received');

		// Check authentication
		const authHeader = request.headers.get('authorization');
		const token = authHeader?.replace('Bearer ', '');

		if (!token) {
			return NextResponse.json({ error: 'No token provided' }, { status: 401 });
		}

		const user = await SimpleAuth.verifyToken(token);
		if (!user) {
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}

		const contentItem = await request.json();
		console.log('Creating content item:', contentItem);

		const data = await loadContent();

		if (!data.content) data.content = {};

		// Use the section directly (e.g., "library/press", "organization/announcements")
		const sectionKey = contentItem.section;
		if (!data.content[sectionKey]) {
			data.content[sectionKey] = [];
		}

		// Clean content - remove extra escaping that might be added by the form
		let cleanContent = contentItem.content;
		if (typeof cleanContent === 'string') {
			// Fix double escaping issues
			cleanContent = cleanContent.replace(/\\n/g, '\n');
			cleanContent = cleanContent.replace(/\\"/g, '"');
			cleanContent = cleanContent.replace(/\\\\/g, '\\');
			// Additional cleanup for markdown
			cleanContent = cleanContent.replace(/\\#/g, '#');
			cleanContent = cleanContent.replace(/\\>/g, '>');
			cleanContent = cleanContent.replace(/\\-/g, '-');
		}

		// Add metadata
		const newContent = {
			title: contentItem.title,
			content: cleanContent, // Use cleaned content
			section: contentItem.section,
			type: contentItem.type,
			status: contentItem.status,
			category: contentItem.category || '',
			youtubeId: contentItem.youtubeId || '',
			youtubeUrls: contentItem.youtubeUrls || [],
			authorName: contentItem.authorName || '',
			id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			publishedAt:
				contentItem.status === 'published'
					? new Date().toISOString()
					: contentItem.publishedAt,
			viewCount: 0,
			author: contentItem.authorName || '관리자',
		};

		// Process YouTube URLs if they exist
		if (
			contentItem.youtubeUrls &&
			typeof contentItem.youtubeUrls === 'string'
		) {
			newContent.youtubeUrls = contentItem.youtubeUrls
				.split('\n')
				.filter((url) => url.trim())
				.map((url) => url.trim());
		}

		data.content[sectionKey].push(newContent);
		await saveContent(data);

		console.log('Content created successfully:', newContent.id);
		return NextResponse.json(newContent);
	} catch (error) {
		console.error('POST content error:', error);
		return NextResponse.json(
			{ error: `Failed to create content: ${error.message}` },
			{ status: 500 }
		);
	}
}
