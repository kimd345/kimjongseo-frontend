// src/app/api/content/[id]/view/route.ts - Complete implementation
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

async function loadContent() {
	try {
		const data = await fs.readFile(CONTENT_FILE, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		return { content: {} };
	}
}

async function saveContent(content: any) {
	const dataDir = path.dirname(CONTENT_FILE);
	await fs.mkdir(dataDir, { recursive: true });
	await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
}

async function findContentById(id: string, data: any) {
	for (const section in data.content || {}) {
		const index = data.content[section].findIndex(
			(item: any) => item.id === id
		);
		if (index !== -1) {
			return { section, index, content: data.content[section][index] };
		}
	}
	return null;
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const data = await loadContent();
		const result = await findContentById(params.id, data);

		if (result) {
			result.content.viewCount = (result.content.viewCount || 0) + 1;
			result.content.updatedAt = new Date().toISOString();
			data.content[result.section][result.index] = result.content;
			await saveContent(data);

			return NextResponse.json(result.content);
		}

		return NextResponse.json({ error: 'Content not found' }, { status: 404 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to update view count' },
			{ status: 500 }
		);
	}
}
