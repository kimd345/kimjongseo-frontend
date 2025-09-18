// CREATE: app/api/auth/login/route.ts - NEW FILE
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
	try {
		const { username, password } = await request.json();

		const token = await SimpleAuth.login(username, password);

		if (token) {
			const user = await SimpleAuth.verifyToken(token);
			return NextResponse.json({ token, user });
		} else {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}
	} catch (error) {
		return NextResponse.json({ error: 'Login failed' }, { status: 500 });
	}
}
