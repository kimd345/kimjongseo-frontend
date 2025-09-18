// CREATE: app/api/content/[id]/route.ts - Individual content operations
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

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const data = await loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		return NextResponse.json(result.content);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to load content' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await SimpleAuth.requireAuth();

		const updates = await request.json();
		const data = await loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		const updatedContent = {
			...result.content,
			...updates,
			updatedAt: new Date().toISOString(),
		};

		data.content[result.section][result.index] = updatedContent;
		await saveContent(data);

		return NextResponse.json(updatedContent);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to update content' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await SimpleAuth.requireAuth();

		const data = await loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		data.content[result.section].splice(result.index, 1);
		await saveContent(data);

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to delete content' },
			{ status: 500 }
		);
	}
}
