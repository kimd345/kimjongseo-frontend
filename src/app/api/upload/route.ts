// CREATE: app/api/upload/route.ts - NEW FILE
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
	try {
		await SimpleAuth.requireAuth();

		const data = await request.formData();
		const file: File | null = data.get('file') as unknown as File;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		// Create unique filename
		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 15);
		const fileExtension = path.extname(file.name);
		const fileName = `${timestamp}-${randomString}${fileExtension}`;

		// Determine upload directory based on file type
		let uploadDir = 'general';
		if (file.type.startsWith('image/')) {
			uploadDir = 'images';
		} else if (file.type.startsWith('video/')) {
			uploadDir = 'videos';
		} else if (file.type.includes('pdf') || file.type.includes('document')) {
			uploadDir = 'documents';
		}

		const uploadsPath = path.join(
			process.cwd(),
			'public',
			'uploads',
			uploadDir
		);
		await mkdir(uploadsPath, { recursive: true });

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const filePath = path.join(uploadsPath, fileName);

		await writeFile(filePath, buffer);

		const fileUrl = `/uploads/${uploadDir}/${fileName}`;

		return NextResponse.json({
			success: true,
			fileName,
			url: fileUrl,
			originalName: file.name,
			size: file.size,
			type: file.type,
			category: uploadDir,
		});
	} catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
	}
}
