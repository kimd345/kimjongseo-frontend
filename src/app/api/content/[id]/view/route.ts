// src/app/api/content/[id]/view/route.ts - View count increment endpoint
import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@/lib/storage';

async function findContentById(id: string, data: any) {
	console.log('Looking for content with ID:', id);

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

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		console.log('POST request to increment view count for ID:', params.id);

		const data = await Storage.loadContent();
		const result = await findContentById(params.id, data);

		if (!result) {
			console.log('Content not found for view increment');
			return NextResponse.json({ error: 'Content not found' }, { status: 404 });
		}

		// Increment view count
		const currentViews = result.content.viewCount || 0;
		const newViewCount = currentViews + 1;

		console.log(
			`Incrementing view count from ${currentViews} to ${newViewCount}`
		);

		// Update the content with new view count
		const updatedContent = {
			...result.content,
			viewCount: newViewCount,
			updatedAt: new Date().toISOString(),
		};

		data.content[result.section][result.index] = updatedContent;
		await Storage.saveContent(data);

		console.log('View count incremented successfully');
		return NextResponse.json({
			success: true,
			viewCount: newViewCount,
			message: 'View count incremented',
		});
	} catch (error) {
		console.error('Failed to increment view count:', error);
		return NextResponse.json(
			{ error: 'Failed to increment view count' },
			{ status: 500 }
		);
	}
}
