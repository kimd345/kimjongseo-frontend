// src/lib/auth.ts
import Cookies from 'js-cookie';
import { api } from './api';
import { User } from '@/types';

export class AuthManager {
	static setToken(token: string): void {
		Cookies.set('auth_token', token, { expires: 7 }); // 7 days
	}

	static getToken(): string | undefined {
		return Cookies.get('auth_token');
	}

	static removeToken(): void {
		Cookies.remove('auth_token');
	}

	static isAuthenticated(): boolean {
		return !!this.getToken();
	}

	static async login(username: string, password: string): Promise<User> {
		const response = await api.login(username, password);
		this.setToken(response.access_token);
		return response.user;
	}

	static logout(): void {
		this.removeToken();
		window.location.href = '/admin/login';
	}

	static async getCurrentUser(): Promise<User | null> {
		try {
			if (!this.isAuthenticated()) return null;
			return await api.getProfile();
		} catch (error) {
			this.removeToken();
			return null;
		}
	}
}
