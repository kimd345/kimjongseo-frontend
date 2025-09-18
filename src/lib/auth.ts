// src/lib/simple-auth.ts - NEW FILE
// This replaces your existing auth system

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
}

// UPDATE: src/hooks/use-auth.ts - Replace your existing useAuth
import { useState, useEffect } from 'react';

export function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// Get token from cookies
				const token = document.cookie
					.split('; ')
					.find((row) => row.startsWith('auth-token='))
					?.split('=')[1];

				if (token) {
					// Verify token with server
					const response = await fetch('/api/auth/verify', {
						headers: { Authorization: `Bearer ${token}` },
					});

					if (response.ok) {
						const userData = await response.json();
						setUser(userData);
						setIsAuthenticated(true);
					} else {
						// Remove invalid token
						document.cookie =
							'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
					}
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				document.cookie =
					'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (
		username: string,
		password: string
	): Promise<boolean> => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const { token, user } = await response.json();
				// Set HTTP-only cookie
				document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
				setUser(user);
				setIsAuthenticated(true);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Login failed:', error);
			return false;
		}
	};

	const logout = () => {
		// Remove cookie
		document.cookie =
			'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		setUser(null);
		setIsAuthenticated(false);
		// Redirect to login
		window.location.href = '/admin/login';
	};

	return {
		isAuthenticated,
		loading,
		user,
		login,
		logout,
	};
}
