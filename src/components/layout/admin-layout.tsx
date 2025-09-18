// 2. UPDATE: src/components/layout/admin-layout.tsx - Improve auth handling
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AdminSidebar from './admin-sidebar';
import AdminHeader from './admin-header';
import LoadingSpinner from '../ui/loading-spinner';

interface AdminLayoutProps {
	children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	const { user, loading, isAuthenticated } = useAuth();
	const router = useRouter();

	// Handle redirect in useEffect, not during render
	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push('/admin/login');
		}
	}, [loading, isAuthenticated, router]);

	// Show loading while checking auth
	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	// Don't render anything while redirecting
	if (!isAuthenticated) {
		return null;
	}

	// Render admin layout for authenticated users
	return (
		<div className='admin-layout'>
			<AdminSidebar />
			<div className='flex-1 flex flex-col min-h-screen'>
				<AdminHeader user={user} />
				<main className='admin-content flex-1'>{children}</main>
			</div>
		</div>
	);
}
