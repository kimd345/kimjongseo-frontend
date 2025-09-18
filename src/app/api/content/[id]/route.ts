// src/app/api/content/[id]/route.ts - Fixed with proper error handling
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
		console.log('Content file not found, creating default structure');
		return { content: {} };
	}
}

async function saveContent(content: any) {
	const dataDir = path.dirname(CONTENT_FILE);
	await fs.mkdir(dataDir, { recursive: true });
	await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
}

async function findContentById(id: string, data: any) {
	console.log('Looking for content with ID:', id);
	console.log('Available content sections:', Object.keys(data.content || {}));

	for (const section in data.content || {}) {
		const sectionContent = data.content[section];
		if (Array.isArray(sectionContent)) {
			const index = sectionContent.findIndex((item: any) => item.id === id);
			if (index !== -1) {
				console.log(`Found content in section ${section} at index ${index}`);
				return { section, index, content: sectionContent[index] };
			}
		}
	}
	console.log('Content not found');
	return null;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		console.log('GET request for content ID:', params.id);
		const data = await loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			console.log('Content not found for GET request');
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		return NextResponse.json(result.content);
	} catch (error) {
		console.error('GET content error:', error);
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
		console.log('PUT request for content ID:', params.id);

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

		const updates = await request.json();
		console.log('Updating content with:', updates);

		const data = await loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		// Clean content - remove extra escaping that might be added by the form
		let cleanContent = updates.content;
		if (typeof cleanContent === 'string') {
			// Fix double escaping issues
			cleanContent = cleanContent.replace(/\\n/g, '\n');
			cleanContent = cleanContent.replace(/\\"/g, '"');
			cleanContent = cleanContent.replace(/\\\\/g, '\\');
			cleanContent = cleanContent.replace(/\\#/g, '#');
			cleanContent = cleanContent.replace(/\\>/g, '>');
			cleanContent = cleanContent.replace(/\\-/g, '-');
		}

		const updatedContent = {
			...result.content,
			...updates,
			content: cleanContent,
			updatedAt: new Date().toISOString(),
			// Handle youtubeUrls properly
			youtubeUrls:
				updates.youtubeUrls && typeof updates.youtubeUrls === 'string'
					? updates.youtubeUrls.split('\n').filter((url: any) => url.trim())
					: updates.youtubeUrls || result.content.youtubeUrls || [],
		};

		data.content[result.section][result.index] = updatedContent;
		await saveContent(data);

		console.log('Content updated successfully');
		return NextResponse.json(updatedContent);
	} catch (error) {
		console.error('PUT content error:', error);
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
		console.log('DELETE request for content ID:', params.id);

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

		const data = await loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			console.log('Content not found for deletion');
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		const contentToDelete = result.content;

		// Clean up associated images
		if (contentToDelete.content) {
			const imageMatches = contentToDelete.content.match(
				/!\[.*?\]\((\/uploads\/[^)]+)\)/g
			);
			if (imageMatches) {
				console.log('Found images to delete:', imageMatches);

				for (const match of imageMatches) {
					const urlMatch = match.match(/\((\/uploads\/[^)]+)\)/);
					if (urlMatch) {
						const imagePath = urlMatch[1];
						const fullPath = path.join(process.cwd(), 'public', imagePath);

						try {
							await fs.unlink(fullPath);
							console.log('Deleted image file:', fullPath);
						} catch (error: any) {
							console.warn(
								'Failed to delete image file:',
								fullPath,
								error.message
							);
						}
					}
				}
			}
		}

		// Remove the content from the array
		data.content[result.section].splice(result.index, 1);
		await saveContent(data);

		console.log('Content deleted successfully');
		return NextResponse.json({
			success: true,
			message: 'Content deleted successfully',
		});
	} catch (error: any) {
		console.error('DELETE content error:', error);
		return NextResponse.json(
			{ error: `Failed to delete content: ${error.message}` },
			{ status: 500 }
		);
	}
}
