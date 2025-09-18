// src/lib/auth.ts - Fixed for production
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET ||
		'kimjongseo-secret-change-in-production-' + process.env.NODE_ENV
);

const ADMIN_CREDENTIALS = {
	username: process.env.ADMIN_USERNAME || 'admin',
	password: process.env.ADMIN_PASSWORD || 'admin123!',
};

export interface AuthUser {
	username: string;
	role: string;
	loginTime: string;
}

export class SimpleAuth {
	static async login(
		username: string,
		password: string
	): Promise<string | null> {
		console.log('Login attempt:', { username, hasPassword: !!password });
		console.log('Expected credentials:', {
			expectedUsername: ADMIN_CREDENTIALS.username,
			expectedPassword: ADMIN_CREDENTIALS.password,
		});

		if (
			username === ADMIN_CREDENTIALS.username &&
			password === ADMIN_CREDENTIALS.password
		) {
			try {
				const token = await new SignJWT({
					username,
					role: 'admin',
					loginTime: new Date().toISOString(),
				})
					.setProtectedHeader({ alg: 'HS256' })
					.setExpirationTime('7d')
					.setIssuedAt()
					.setSubject(username)
					.sign(JWT_SECRET);

				console.log('Token generated successfully');
				return token;
			} catch (error) {
				console.error('Token generation failed:', error);
				return null;
			}
		}
		console.log('Invalid credentials');
		return null;
	}

	static async verifyToken(token: string): Promise<AuthUser | null> {
		try {
			console.log('Verifying token:', token.substring(0, 20) + '...');
			const { payload } = await jwtVerify(token, JWT_SECRET);
			console.log('Token verified successfully:', payload);
			return payload as unknown as AuthUser;
		} catch (error) {
			console.error('Token verification failed:', error);
			return null;
		}
	}

	static async requireAuth(): Promise<AuthUser> {
		try {
			// This works in API routes
			const { cookies } = await import('next/headers');
			const cookieStore = cookies();
			const token = cookieStore.get('auth-token')?.value;

			if (!token) {
				throw new Error('Authentication required - no token');
			}

			const user = await this.verifyToken(token);
			if (!user) {
				throw new Error('Invalid token');
			}

			return user;
		} catch (error) {
			console.error('Auth requirement failed:', error);
			throw error;
		}
	}

	// Client-side token management (for browser only)
	static getToken(): string | null {
		if (typeof window === 'undefined') return null;
		return (
			document.cookie
				.split('; ')
				.find((row) => row.startsWith('auth-token='))
				?.split('=')[1] || null
		);
	}

	static removeToken(): void {
		if (typeof window === 'undefined') return;
		document.cookie =
			'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
	}
}
