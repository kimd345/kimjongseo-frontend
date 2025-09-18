// 1. UPDATE: src/app/admin/page.tsx - Fix infinite redirect loop
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';
import {
	DocumentTextIcon,
	FolderIcon,
	PhotoIcon,
	Bars3Icon,
	CogIcon,
	UsersIcon,
	HomeIcon,
	ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
	const { isAuthenticated, loading, user } = useAuth();
	const router = useRouter();

	// Don't redirect during render - use useEffect
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

	// Show nothing while redirecting to login
	if (!isAuthenticated) {
		return null;
	}

	// Show dashboard for authenticated users
	return (
		<AdminLayout>
			<div className='space-y-6'>
				{/* Welcome Header */}
				<div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-2xl font-bold text-gray-900'>
								관리자 대시보드
							</h1>
							<p className='mt-1 text-sm text-gray-500'>
								김종서장군기념사업회 웹사이트 관리
							</p>
						</div>
						{user && (
							<div className='text-right'>
								<p className='text-sm font-medium text-gray-900'>
									환영합니다, {user.username}님
								</p>
								<p className='text-xs text-gray-500'>
									{new Date().toLocaleDateString('ko-KR', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										weekday: 'long',
									})}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Quick Stats */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
						<div className='flex items-center'>
							<div className='flex-shrink-0'>
								<DocumentTextIcon className='h-8 w-8 text-blue-600' />
							</div>
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-500'>총 게시글</p>
								<p className='text-2xl font-bold text-gray-900'>0</p>
							</div>
						</div>
					</div>

					<div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
						<div className='flex items-center'>
							<div className='flex-shrink-0'>
								<PhotoIcon className='h-8 w-8 text-green-600' />
							</div>
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-500'>
									업로드된 파일
								</p>
								<p className='text-2xl font-bold text-gray-900'>0</p>
							</div>
						</div>
					</div>

					<div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
						<div className='flex items-center'>
							<div className='flex-shrink-0'>
								<ChartBarIcon className='h-8 w-8 text-purple-600' />
							</div>
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-500'>총 조회수</p>
								<p className='text-2xl font-bold text-gray-900'>0</p>
							</div>
						</div>
					</div>

					<div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
						<div className='flex items-center'>
							<div className='flex-shrink-0'>
								<UsersIcon className='h-8 w-8 text-orange-600' />
							</div>
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-500'>활성 관리자</p>
								<p className='text-2xl font-bold text-gray-900'>1</p>
							</div>
						</div>
					</div>
				</div>

				{/* Main Actions */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					<Link
						href='/admin/content'
						className='group bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-200'
					>
						<div className='flex items-center mb-4'>
							<DocumentTextIcon className='h-10 w-10 text-blue-600 group-hover:text-brand-600 transition-colors' />
							<h3 className='ml-3 text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors'>
								게시글 관리
							</h3>
						</div>
						<p className='text-gray-600 mb-4'>
							웹사이트의 콘텐츠를 추가, 수정, 삭제할 수 있습니다.
						</p>
						<div className='flex items-center text-brand-600 group-hover:text-brand-700'>
							<span className='text-sm font-medium'>관리하기</span>
							<svg
								className='ml-2 h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5l7 7-7 7'
								/>
							</svg>
						</div>
					</Link>

					<Link
						href='/admin/content/new'
						className='group bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200'
					>
						<div className='flex items-center mb-4'>
							<FolderIcon className='h-10 w-10 text-green-600 group-hover:text-green-700 transition-colors' />
							<h3 className='ml-3 text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors'>
								새 게시글 작성
							</h3>
						</div>
						<p className='text-gray-600 mb-4'>
							새로운 콘텐츠를 작성하고 웹사이트에 게시합니다.
						</p>
						<div className='flex items-center text-green-600 group-hover:text-green-700'>
							<span className='text-sm font-medium'>작성하기</span>
							<svg
								className='ml-2 h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5l7 7-7 7'
								/>
							</svg>
						</div>
					</Link>

					<div className='group bg-white rounded-lg shadow border border-gray-200 p-6'>
						<div className='flex items-center mb-4'>
							<CogIcon className='h-10 w-10 text-gray-600' />
							<h3 className='ml-3 text-lg font-semibold text-gray-900'>
								시스템 설정
							</h3>
						</div>
						<p className='text-gray-600 mb-4'>
							사이트 설정과 관리자 정보를 변경할 수 있습니다.
						</p>
						<div className='flex items-center text-gray-500'>
							<span className='text-sm font-medium'>준비 중</span>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className='bg-white rounded-lg shadow border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<h2 className='text-lg font-semibold text-gray-900'>최근 활동</h2>
					</div>
					<div className='p-6'>
						<div className='text-center py-8'>
							<HomeIcon className='mx-auto h-12 w-12 text-gray-400' />
							<h3 className='mt-2 text-sm font-medium text-gray-900'>
								활동 내역이 없습니다
							</h3>
							<p className='mt-1 text-sm text-gray-500'>
								게시글을 작성하거나 파일을 업로드하면 여기에 표시됩니다.
							</p>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
