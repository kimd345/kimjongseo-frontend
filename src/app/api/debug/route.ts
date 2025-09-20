// src/app/api/debug/route.ts - TEMPORARY: Environment debugging for production
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	// Only allow in development or if specifically enabled
	const isDev = process.env.NODE_ENV === 'development';
	const debugEnabled = process.env.ENABLE_DEBUG === 'true';

	if (!isDev && !debugEnabled) {
		return NextResponse.json(
			{ error: 'Debug endpoint disabled' },
			{ status: 403 }
		);
	}

	const debugInfo = {
		nodeEnv: process.env.NODE_ENV,
		adminUsername: process.env.ADMIN_USERNAME || 'default: admin',
		adminPasswordSet: !!process.env.ADMIN_PASSWORD,
		jwtSecretSet: !!process.env.JWT_SECRET,
		vercelUrl: process.env.VERCEL_URL,
		userAgent: request.headers.get('user-agent'),
		host: request.headers.get('host'),
		protocol: request.url.startsWith('https') ? 'https' : 'http',
		cookies: request.headers.get('cookie'),
	};

	return NextResponse.json(debugInfo);
}
