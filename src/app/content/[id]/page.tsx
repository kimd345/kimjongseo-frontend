// src/app/content/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Content, Menu } from '@/types';
import PublicLayout from '@/components/layout/public-layout';
import ContentDetail from '@/components/public/content-detail';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {
	ChevronLeftIcon,
	HomeIcon,
	ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function ContentDetailPage() {
	const { id } = useParams();
	const [content, setContent] = useState<Content | null>(null);
	const [menus, setMenus] = useState<Menu[]>([]);
	const [relatedContents, setRelatedContents] = useState<Content[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const contentId = parseInt(id as string);

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Load content and increment view count
				const [contentData, menusData] = await Promise.all([
					api.incrementContentView(contentId),
					api.getMenuTree(),
				]);

				setContent(contentData);
				setMenus(menusData);

				// Load related content if content has a menu
				if (contentData.menuId) {
					try {
						const relatedData = await api.getContents({
							menuId: contentData.menuId,
							limit: 4,
						});
						// Filter out the current content
						const filtered = relatedData.data.filter(
							(item) => item.id !== contentData.id
						);
						setRelatedContents(filtered);
					} catch (relatedError) {
						console.error('Failed to load related content:', relatedError);
						// Don't fail the whole page for related content
					}
				}
			} catch (error) {
				console.error('Failed to load content:', error);
				setError('콘텐츠를 찾을 수 없습니다.');
			} finally {
				setLoading(false);
			}
		};

		if (contentId) {
			loadData();
		}
	}, [contentId]);

	if (loading) {
		return (
			<PublicLayout>
				<div className='min-h-screen flex items-center justify-center'>
					<LoadingSpinner size='lg' />
				</div>
			</PublicLayout>
		);
	}

	if (error || !content) {
		notFound();
	}

	// Build breadcrumb path
	const buildBreadcrumbs = () => {
		const breadcrumbs = [{ name: '홈', href: '/' }];

		if (content.menu) {
			// Add menu breadcrumbs
			const menuPath = [];
			let currentMenu = content.menu;

			// Build path from current menu to root
			while (currentMenu) {
				menuPath.unshift(currentMenu);
				currentMenu = currentMenu.parent;
			}

			// Add menu breadcrumbs
			let currentPath = '';
			menuPath.forEach((menu) => {
				currentPath += (currentPath ? '/' : '') + menu.url;
				breadcrumbs.push({
					name: menu.name,
					href: `/${currentPath}`,
				});
			});
		}

		breadcrumbs.push({
			name: content.title,
			href: `/content/${content.id}`,
		});

		return breadcrumbs;
	};

	const breadcrumbs = buildBreadcrumbs();

	return (
		<PublicLayout menus={menus}>
			{/* Breadcrumbs */}
			<div className='bg-white border-b border-gray-200'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<nav className='flex py-4' aria-label='Breadcrumb'>
						<ol className='flex items-center space-x-4'>
							{breadcrumbs.map((breadcrumb, index) => (
								<li key={breadcrumb.href}>
									<div className='flex items-center'>
										{index === 0 ? (
											<Link
												href={breadcrumb.href}
												className='text-gray-400 hover:text-gray-500 transition-colors'
											>
												<HomeIcon className='h-5 w-5' />
												<span className='sr-only'>{breadcrumb.name}</span>
											</Link>
										) : (
											<>
												<ChevronRightIcon className='h-5 w-5 text-gray-300 mr-4' />
												{index === breadcrumbs.length - 1 ? (
													<span className='text-sm font-medium text-gray-900 truncate max-w-60'>
														{breadcrumb.name}
													</span>
												) : (
													<Link
														href={breadcrumb.href}
														className='text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors truncate max-w-40'
													>
														{breadcrumb.name}
													</Link>
												)}
											</>
										)}
									</div>
								</li>
							))}
						</ol>
					</nav>
				</div>
			</div>

			<div className='min-h-screen bg-gray-50 py-8'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					{/* Back Button */}
					<div className='mb-6'>
						<button
							onClick={() => window.history.back()}
							className='inline-flex items-center text-brand-600 hover:text-brand-700 transition-colors'
						>
							<ChevronLeftIcon className='h-5 w-5 mr-1' />
							돌아가기
						</button>
					</div>

					{/* Content Detail */}
					<ContentDetail content={content} />

					{/* Related Content */}
					{relatedContents.length > 0 && (
						<div className='mt-12'>
							<h2 className='text-2xl font-bold text-gray-900 mb-6'>
								관련 콘텐츠
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{relatedContents.map((relatedContent) => (
									<Link
										key={relatedContent.id}
										href={`/content/${relatedContent.id}`}
										className='group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
									>
										{relatedContent.featuredImage && (
											<div className='relative h-32 bg-gray-200'>
												<img
													src={relatedContent.featuredImage}
													alt={relatedContent.title}
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
												/>
											</div>
										)}
										<div className='p-4'>
											{relatedContent.category && (
												<div className='text-sm text-brand-600 font-medium mb-1'>
													{relatedContent.category}
												</div>
											)}
											<h3 className='font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2'>
												{relatedContent.title}
											</h3>
											<p className='text-sm text-gray-600 mt-2 line-clamp-2'>
												{relatedContent.content
													.replace(/[#*_`]/g, '')
													.substring(0, 100)}
												...
											</p>
											<div className='text-xs text-gray-500 mt-2'>
												{new Date(relatedContent.createdAt).toLocaleDateString(
													'ko-KR'
												)}
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}

					{/* Navigation to Menu */}
					{content.menu && (
						<div className='mt-12 text-center'>
							<Link
								href={`/${content.menu.url}`}
								className='inline-flex items-center px-6 py-3 border border-brand-300 text-brand-700 bg-white hover:bg-brand-50 rounded-lg font-medium transition-colors'
							>
								{content.menu.name} 더 보기
								<ChevronRightIcon className='ml-2 h-4 w-4' />
							</Link>
						</div>
					)}
				</div>
			</div>
		</PublicLayout>
	);
}
