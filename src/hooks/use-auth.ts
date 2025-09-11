// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { AuthManager } from '@/lib/auth';

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const currentUser = await AuthManager.getCurrentUser();
				setUser(currentUser);
			} catch (error) {
				console.error('Failed to load user:', error);
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, []);

	const login = async (username: string, password: string): Promise<void> => {
		const user = await AuthManager.login(username, password);
		setUser(user);
	};

	const logout = (): void => {
		AuthManager.logout();
		setUser(null);
	};

	return {
		user,
		loading,
		login,
		logout,
		isAuthenticated: !!user,
	};
}
