// CREATE: app/api/content/route.ts - NEW FILE
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
		// Return default structure if file doesn't exist
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
		return NextResponse.json(
			{ error: 'Failed to load content' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await SimpleAuth.requireAuth();

		const contentItem = await request.json();
		const data = await loadContent();

		if (!data.content) data.content = {};
		if (!data.content[contentItem.section]) {
			data.content[contentItem.section] = [];
		}

		// Add metadata
		const newContent = {
			...contentItem,
			id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			viewCount: 0,
		};

		data.content[contentItem.section].push(newContent);
		await saveContent(data);

		return NextResponse.json(newContent);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to create content' },
			{ status: 500 }
		);
	}
}
