// src/app/api/upload/route.ts - Updated to use Storage instead of fs
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';
import { Storage } from '@/lib/storage';

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
		const fileExtension = file.name.split('.').pop() || '';
		const fileName = `${timestamp}-${randomString}.${fileExtension}`;

		// Determine upload directory based on file type
		let uploadDir = 'general';
		if (file.type.startsWith('image/')) {
			uploadDir = 'images';
		} else if (file.type.startsWith('video/')) {
			uploadDir = 'videos';
		} else if (file.type.includes('pdf') || file.type.includes('document')) {
			uploadDir = 'documents';
		}

		// Upload using Storage abstraction
		const fileUrl = await Storage.uploadFile(file, fileName, uploadDir);

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
	} catch (error: any) {
		console.error('Upload error:', error);
		return NextResponse.json(
			{
				error: `Upload failed: ${error.message}`,
			},
			{ status: 500 }
		);
	}
}
