// src/app/api/content/[id]/route.ts - Updated to use Storage instead of fs
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';
import { Storage } from '@/lib/storage';
import {
	extractFileReferences,
	cleanupOrphanedFiles,
} from '@/lib/content-manager';

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
		const data = await Storage.loadContent();
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

		const data = await Storage.loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		const oldContent = result.content;

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

		// Clean up orphaned files if content changed
		if (oldContent.content !== cleanContent) {
			await cleanupOrphanedFiles(params.id, cleanContent, oldContent.content);
		}

		// Extract current file references for tracking
		const currentFiles = extractFileReferences(cleanContent);

		const updatedContent = {
			...result.content,
			...updates,
			content: cleanContent,
			updatedAt: new Date().toISOString(),
			// Track files referenced in content
			referencedFiles: currentFiles,
			// Handle youtubeUrls properly
			youtubeUrls:
				updates.youtubeUrls && typeof updates.youtubeUrls === 'string'
					? updates.youtubeUrls.split('\n').filter((url: any) => url.trim())
					: updates.youtubeUrls || result.content.youtubeUrls || [],
		};

		data.content[result.section][result.index] = updatedContent;
		await Storage.saveContent(data);

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

		const data = await Storage.loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			console.log('Content not found for deletion');
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		const contentToDelete = result.content;

		// Enhanced image cleanup - handle both local and GitHub URLs
		if (contentToDelete.content) {
			// Pattern 1: Local paths like /uploads/images/filename.jpg
			const localImageMatches = contentToDelete.content.match(
				/!\[.*?\]\((\/uploads\/[^)]+)\)/g
			);

			// Pattern 2: GitHub raw URLs
			const githubImageMatches = contentToDelete.content.match(
				/!\[.*?\]\((https:\/\/raw\.githubusercontent\.com\/[^)]+)\)/g
			);

			// Pattern 3: Images stored in the images array
			const imageFiles = contentToDelete.images || [];

			const allImageUrls: string[] = [];

			// Collect local image paths
			if (localImageMatches) {
				localImageMatches.forEach((match: string) => {
					const urlMatch = match.match(/\((\/uploads\/[^)]+)\)/);
					if (urlMatch && !allImageUrls.includes(urlMatch[1])) {
						allImageUrls.push(urlMatch[1]);
					}
				});
			}

			// Collect GitHub URLs
			if (githubImageMatches) {
				githubImageMatches.forEach((match: string) => {
					const urlMatch = match.match(
						/\((https:\/\/raw\.githubusercontent\.com\/[^)]+)\)/
					);
					if (urlMatch && !allImageUrls.includes(urlMatch[1])) {
						allImageUrls.push(urlMatch[1]);
					}
				});
			}

			// Add images from the images array
			imageFiles.forEach((imageUrl: string) => {
				if (!allImageUrls.includes(imageUrl)) {
					allImageUrls.push(imageUrl);
				}
			});

			console.log('Found images to delete:', allImageUrls);

			// Delete each image
			for (const imageUrl of allImageUrls) {
				try {
					await Storage.deleteFile(imageUrl);
					console.log('Deleted image file:', imageUrl);
				} catch (error: any) {
					console.warn('Failed to delete image file:', imageUrl, error.message);
				}
			}
		}

		// Remove the content from the array
		data.content[result.section].splice(result.index, 1);
		await Storage.saveContent(data);

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