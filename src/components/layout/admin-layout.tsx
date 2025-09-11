// src/components/layout/AdminLayout.tsx
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

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push('/admin/login');
		}
	}, [loading, isAuthenticated, router]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

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
