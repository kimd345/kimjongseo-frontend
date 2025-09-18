// CREATE: app/api/auth/verify/route.ts - NEW FILE
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get('authorization');
		const token = authHeader?.replace('Bearer ', '');

		if (!token) {
			return NextResponse.json({ error: 'No token provided' }, { status: 401 });
		}

		const user = await SimpleAuth.verifyToken(token);

		if (user) {
			return NextResponse.json(user);
		} else {
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}
	} catch (error) {
		return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
	}
}
