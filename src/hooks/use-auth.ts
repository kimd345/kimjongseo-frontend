// 2. UPDATE: src/hooks/use-auth.ts - CLIENT-SIDE ONLY (React hooks)
'use client';

import { useState, useEffect } from 'react';

export interface AuthUser {
	username: string;
	role: string;
	loginTime: string;
}

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
