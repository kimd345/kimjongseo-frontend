// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import { api } from '@/lib/api';
import { Content, Menu, FileUpload } from '@/types';
import {
	DocumentTextIcon,
	FolderIcon,
	EyeIcon,
	Bars3Icon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
	totalContents: number;
	totalMenus: number;
	totalFiles: number;
	totalViews: number;
	recentContents: Content[];
}

export default function AdminDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalContents: 0,
		totalMenus: 0,
		totalFiles: 0,
		totalViews: 0,
		recentContents: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadDashboardData = async () => {
			try {
				const [contentsResponse, menusResponse, filesResponse] =
					await Promise.all([
						api.getContents({ limit: 5 }),
						api.getMenus(),
						api.getFiles(),
					]);

				const totalViews = contentsResponse.data.reduce(
					(sum, content) => sum + content.viewCount,
					0
				);

				setStats({
					totalContents: contentsResponse.total,
					totalMenus: menusResponse.length,
					totalFiles: filesResponse.length,
					totalViews,
					recentContents: contentsResponse.data,
				});
			} catch (error) {
				console.error('Failed to load dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadDashboardData();
	}, []);

	const statCards = [
		{
			name: '총 게시글',
			value: stats.totalContents,
			icon: DocumentTextIcon,
			color: 'text-blue-600 bg-blue-100',
		},
		{
			name: '메뉴 항목',
			value: stats.totalMenus,
			icon: Bars3Icon,
			color: 'text-green-600 bg-green-100',
		},
		{
			name: '업로드된 파일',
			value: stats.totalFiles,
			icon: FolderIcon,
			color: 'text-purple-600 bg-purple-100',
		},
		{
			name: '총 조회수',
			value: stats.totalViews,
			icon: EyeIcon,
			color: 'text-orange-600 bg-orange-100',
		},
	];

	if (loading) {
		return (
			<AdminLayout>
				<div className='animate-pulse space-y-6'>
					<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className='bg-white overflow-hidden shadow rounded-lg'
							>
								<div className='p-5'>
									<div className='flex items-center'>
										<div className='w-8 h-8 bg-gray-200 rounded'></div>
										<div className='ml-5 w-0 flex-1'>
											<div className='h-4 bg-gray-200 rounded w-3/4'></div>
											<div className='h-6 bg-gray-200 rounded w-1/2 mt-2'></div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className='space-y-6'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>대시보드</h1>
					<p className='mt-1 text-sm text-gray-500'>
						김종서장군기념사업회 관리자 대시보드
					</p>
				</div>

				{/* Stats Cards */}
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
					{statCards.map((stat) => {
						const Icon = stat.icon;
						return (
							<div
								key={stat.name}
								className='bg-white overflow-hidden shadow rounded-lg'
							>
								<div className='p-5'>
									<div className='flex items-center'>
										<div className={`rounded-md p-3 ${stat.color}`}>
											<Icon className='h-6 w-6' />
										</div>
										<div className='ml-5 w-0 flex-1'>
											<dl>
												<dt className='text-sm font-medium text-gray-500 truncate'>
													{stat.name}
												</dt>
												<dd className='text-2xl font-bold text-gray-900'>
													{stat.value.toLocaleString()}
												</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Recent Content */}
				<div className='bg-white shadow rounded-lg'>
					<div className='p-6'>
						<h2 className='text-lg font-medium text-gray-900 mb-4'>
							최근 게시글
						</h2>
						{stats.recentContents.length === 0 ? (
							<p className='text-gray-500 text-center py-8'>
								게시글이 없습니다.
							</p>
						) : (
							<div className='space-y-3'>
								{stats.recentContents.map((content) => (
									<div
										key={content.id}
										className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
									>
										<div className='flex-1'>
											<h3 className='text-sm font-medium text-gray-900'>
												{content.title}
											</h3>
											<p className='text-xs text-gray-500 mt-1'>
												{content.type} •{' '}
												{new Date(content.createdAt).toLocaleDateString(
													'ko-KR'
												)}
											</p>
										</div>
										<div className='flex items-center gap-4 text-sm text-gray-500'>
											<span className='flex items-center gap-1'>
												<EyeIcon className='h-4 w-4' />
												{content.viewCount}
											</span>
											<span
												className={`px-2 py-1 rounded-full text-xs ${
													content.status === 'published'
														? 'bg-green-100 text-green-800'
														: 'bg-yellow-100 text-yellow-800'
												}`}
											>
												{content.status === 'published' ? '공개' : '비공개'}
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
