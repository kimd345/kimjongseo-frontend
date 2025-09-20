// src/app/api/auth/login/route.ts - Fixed for production deployment
import { NextRequest, NextResponse } from 'next/server';
import { SimpleAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
	try {
		console.log('Login API called');
		const body = await request.json();
		console.log('Request body:', { ...body, password: '***' });

		const { username, password } = body;

		if (!username || !password) {
			console.log('Missing username or password');
			return NextResponse.json(
				{ error: 'Username and password are required' },
				{ status: 400 }
			);
		}

		const token = await SimpleAuth.login(username, password);

		if (token) {
			console.log('Login successful, generating response');
			const user = await SimpleAuth.verifyToken(token);

			// Create response with user data
			const response = NextResponse.json({
				success: true,
				token,
				user: {
					username: user?.username,
					role: user?.role,
					loginTime: user?.loginTime,
				},
			});

			// Fixed cookie settings for production
			const isProduction = process.env.NODE_ENV === 'production';

			// Set cookie with proper production settings - don't set domain for Vercel
			const cookieValue = `auth-token=${token}; Path=/; Max-Age=604800; SameSite=Lax${
				isProduction ? '; Secure' : ''
			}`;

			response.headers.set('Set-Cookie', cookieValue);
			console.log('Cookie set with value:', cookieValue);

			return response;
		} else {
			console.log('Invalid credentials provided');
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}
	} catch (error) {
		console.error('Login API error:', error);
		return NextResponse.json(
			{ error: 'Login failed: ' + (error as Error).message },
			{ status: 500 }
		);
	}
}
