// src/hooks/use-auth.ts - Fixed for production deployment
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
				console.log('Checking authentication status...');

				// Get token from cookies
				const token = document.cookie
					.split('; ')
					.find((row) => row.startsWith('auth-token='))
					?.split('=')[1];

				console.log('Token found:', token ? 'Yes' : 'No');

				if (token) {
					// Verify token with server
					console.log('Verifying token with server...');
					const response = await fetch('/api/auth/verify', {
						headers: {
							Authorization: `Bearer ${token}`,
							'Cache-Control': 'no-cache',
						},
					});

					console.log('Verify response status:', response.status);

					if (response.ok) {
						const userData = await response.json();
						console.log('User data received:', userData);
						setUser(userData);
						setIsAuthenticated(true);
					} else {
						console.log('Token verification failed, removing cookie');
						// Remove invalid token
						document.cookie =
							'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
					}
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				document.cookie =
					'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
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
			console.log('Attempting login for user:', username);

			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
				},
				body: JSON.stringify({ username, password }),
			});

			console.log('Login response status:', response.status);
			const data = await response.json();
			console.log('Login response data:', {
				...data,
				token: data.token ? 'present' : 'missing',
			});

			if (response.ok && data.success) {
				// Check if cookie was set by server
				const cookieSet = document.cookie.includes('auth-token=');
				console.log('Cookie set after login:', cookieSet);

				// Fixed fallback cookie setting for production
				if (!cookieSet && data.token) {
					console.log('Setting cookie manually as fallback');
					const isProduction = window.location.protocol === 'https:';
					const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

					const cookieString = `auth-token=${data.token}; path=/; max-age=${maxAge}; samesite=lax${
						isProduction ? '; secure' : ''
					}`;

					document.cookie = cookieString;
					console.log('Fallback cookie set:', cookieString);

					// Verify cookie was actually set
					const cookieVerify = document.cookie.includes('auth-token=');
					console.log('Cookie verification after manual set:', cookieVerify);
				}

				setUser(data.user);
				setIsAuthenticated(true);
				return true;
			} else {
				console.log('Login failed:', data.error);
			}
			return false;
		} catch (error) {
			console.error('Login failed:', error);
			return false;
		}
	};

	const logout = () => {
		console.log('Logging out...');
		// Remove cookie with all possible variations
		const isProduction = window.location.protocol === 'https:';

		// Standard removal
		document.cookie =
			'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';

		// Production removal with secure flag
		if (isProduction) {
			document.cookie =
				'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax; secure';
		}

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
