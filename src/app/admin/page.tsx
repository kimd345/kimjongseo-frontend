// src/app/admin/page.tsx - Fixed TypeScript error for dashboard
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
	DocumentTextIcon,
	FolderIcon,
	CogIcon,
	HomeIcon,
	ChartBarIcon,
	ClockIcon,
	EyeIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
	totalContents: number;
	publishedContents: number;
	draftContents: number;
	totalViews: number;
	recentContents: any[];
}

interface ApiResponse {
	content?: Record<string, any[]>;
}

export default function AdminDashboard() {
	const { isAuthenticated, loading, user } = useAuth();
	const router = useRouter();
	const [stats, setStats] = useState<DashboardStats>({
		totalContents: 0,
		publishedContents: 0,
		draftContents: 0,
		totalViews: 0,
		recentContents: [],
	});
	const [statsLoading, setStatsLoading] = useState(true);

	// Don't redirect during render - use useEffect
	useEffect(() => {
		if (!loading && !isAuthenticated) {
			router.push('/admin/login');
		}
	}, [loading, isAuthenticated, router]);

	// Load dashboard statistics
	useEffect(() => {
		const loadStats = async () => {
			if (!isAuthenticated) return;

			try {
				setStatsLoading(true);
				const response = await api.getContents();

				// Type the response properly to avoid TypeScript errors
				const typedResponse = response as ApiResponse;

				let allContents: any[] = [];
				if (typedResponse.content) {
					// Flatten content from all sections
					allContents = Object.values(typedResponse.content).flat();
				}

				const publishedContents = allContents.filter(
					(c) => c.status === 'published'
				);
				const draftContents = allContents.filter((c) => c.status === 'draft');
				const totalViews = allContents.reduce(
					(sum, c) => sum + (c.viewCount || 0),
					0
				);

				// Get recent contents (last 5)
				const recentContents = allContents
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					)
					.slice(0, 5);

				setStats({
					totalContents: allContents.length,
					publishedContents: publishedContents.length,
					draftContents: draftContents.length,
					totalViews,
					recentContents,
				});
			} catch (error) {
				console.error('Failed to load dashboard stats:', error);
			} finally {
				setStatsLoading(false);
			}
		};

		loadStats();
	}, [isAuthenticated]);

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
								<p className='text-2xl font-bold text-gray-900'>
									{statsLoading ? '...' : stats.totalContents}
								</p>
							</div>
						</div>
					</div>

					<div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
						<div className='flex items-center'>
							<div className='flex-shrink-0'>
								<EyeIcon className='h-8 w-8 text-green-600' />
							</div>
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-500'>공개 게시글</p>
								<p className='text-2xl font-bold text-gray-900'>
									{statsLoading ? '...' : stats.publishedContents}
								</p>
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
								<p className='text-2xl font-bold text-gray-900'>
									{statsLoading ? '...' : stats.totalViews.toLocaleString()}
								</p>
							</div>
						</div>
					</div>

					<div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
						<div className='flex items-center'>
							<div className='flex-shrink-0'>
								<ClockIcon className='h-8 w-8 text-orange-600' />
							</div>
							<div className='ml-4'>
								<p className='text-sm font-medium text-gray-500'>초안</p>
								<p className='text-2xl font-bold text-gray-900'>
									{statsLoading ? '...' : stats.draftContents}
								</p>
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
						{statsLoading ? (
							<div className='text-center py-4'>
								<LoadingSpinner size='sm' />
								<p className='mt-2 text-sm text-gray-500'>로딩중...</p>
							</div>
						) : stats.recentContents.length > 0 ? (
							<div className='space-y-4'>
								{stats.recentContents.map((content) => (
									<div
										key={content.id}
										className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
									>
										<div className='flex-1'>
											<h4 className='text-sm font-medium text-gray-900'>
												{content.title}
											</h4>
											<p className='text-xs text-gray-500'>
												{content.section} •{' '}
												{new Date(content.createdAt).toLocaleDateString(
													'ko-KR'
												)}
											</p>
										</div>
										<div className='flex items-center gap-2'>
											<span
												className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
													content.status === 'published'
														? 'bg-green-100 text-green-800'
														: 'bg-yellow-100 text-yellow-800'
												}`}
											>
												{content.status === 'published' ? '공개' : '초안'}
											</span>
											<Link href={`/admin/content/${content.id}`}>
												<button className='text-brand-600 hover:text-brand-700 text-xs'>
													수정
												</button>
											</Link>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-8'>
								<HomeIcon className='mx-auto h-12 w-12 text-gray-400' />
								<h3 className='mt-2 text-sm font-medium text-gray-900'>
									활동 내역이 없습니다
								</h3>
								<p className='mt-1 text-sm text-gray-500'>
									게시글을 작성하거나 파일을 업로드하면 여기에 표시됩니다.
								</p>
								<Link href='/admin/content/new' className='mt-4 inline-block'>
									<button className='bg-brand-600 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-700 transition-colors'>
										첫 번째 게시글 작성하기
									</button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
