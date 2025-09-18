// CREATE: app/api/content/[id]/view/route.ts - View count increment
import { NextRequest, NextResponse } from 'next/server';

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
