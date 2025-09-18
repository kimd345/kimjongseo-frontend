// 1. UPDATE: src/lib/auth.ts - SERVER-SIDE ONLY (remove React hooks)
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'kimjongseo-secret-change-in-production'
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
		if (
			username === ADMIN_CREDENTIALS.username &&
			password === ADMIN_CREDENTIALS.password
		) {
			const token = await new SignJWT({
				username,
				role: 'admin',
				loginTime: new Date().toISOString(),
			})
				.setProtectedHeader({ alg: 'HS256' })
				.setExpirationTime('7d')
				.sign(JWT_SECRET);

			return token;
		}
		return null;
	}

	static async verifyToken(token: string): Promise<AuthUser | null> {
		try {
			const { payload } = await jwtVerify(token, JWT_SECRET);
			return payload as AuthUser;
		} catch {
			return null;
		}
	}

	static async requireAuth(): Promise<AuthUser> {
		// This works in API routes
		const { cookies } = await import('next/headers');
		const cookieStore = cookies();
		const token = cookieStore.get('auth-token')?.value;

		if (!token) {
			throw new Error('Authentication required');
		}

		const user = await this.verifyToken(token);
		if (!user) {
			throw new Error('Invalid token');
		}

		return user;
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
			'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}
