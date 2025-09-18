// src/app/api/upload/route.ts - Fixed with proper auth checking
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
	try {
		console.log('Upload request received');

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

		const data = await request.formData();
		const file: File | null = data.get('file') as unknown as File;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		console.log(
			'Processing file:',
			file.name,
			'Size:',
			file.size,
			'Type:',
			file.type
		);

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

		console.log('Creating upload directory:', uploadsPath);
		await mkdir(uploadsPath, { recursive: true });

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const filePath = path.join(uploadsPath, fileName);

		console.log('Writing file to:', filePath);
		await writeFile(filePath, buffer);

		const fileUrl = `/uploads/${uploadDir}/${fileName}`;

		const result = {
			success: true,
			fileName,
			url: fileUrl,
			originalName: file.name,
			size: file.size,
			type: file.type,
			category: uploadDir,
		};

		console.log('File upload successful:', result);
		return NextResponse.json(result);
	} catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json(
			{
				error: `Upload failed: ${error.message}`,
			},
			{ status: 500 }
		);
	}
}
