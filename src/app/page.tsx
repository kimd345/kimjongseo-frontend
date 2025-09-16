// src/app/page.tsx - Updated version
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Menu, Content, PublishStatus } from '@/types';
import PublicLayout from '@/components/layout/public-layout';
import HeroSection from '@/components/public/hero-section';
import MenuSection from '@/components/public/menu-section';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function HomePage() {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [recentContents, setRecentContents] = useState<Content[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [menusData, contentsData] = await Promise.all([
					api.getMenuTree(),
					api.getContents({ status: PublishStatus.PUBLISHED, limit: 6 }),
				]);
				setMenus(menusData);
				setRecentContents(contentsData.data);
			} catch (error) {
				console.error('Failed to load homepage data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	if (loading) {
		return (
			<PublicLayout>
				<div className='min-h-screen flex items-center justify-center'>
					<LoadingSpinner size='lg' />
				</div>
			</PublicLayout>
		);
	}

	return (
		<PublicLayout menus={menus}>
			<HeroSection />
			<MenuSection menus={menus} />

			{/* Recent Content Section */}
			{recentContents.length > 0 && (
				<section className='py-16 bg-gray-50'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center mb-12'>
							<h2 className='text-3xl font-bold text-gray-900'>최근 소식</h2>
							<p className='mt-4 text-lg text-gray-600'>
								김종서장군기념사업회의 최근 활동과 소식을 전해드립니다.
							</p>
							<div className='w-24 h-1 bg-brand-600 mx-auto mt-4'></div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{recentContents.map((content) => (
								<article
									key={content.id}
									className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200'
								>
									{content.featuredImage && (
										<div className='relative h-48 bg-gray-200'>
											<img
												src={content.featuredImage}
												alt={content.title}
												className='w-full h-48 object-cover'
											/>
										</div>
									)}
									<div className='p-6'>
										<div className='text-sm text-brand-600 font-medium mb-2'>
											{content.category || '일반'}
										</div>
										<h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
											{content.title}
										</h3>
										<p className='text-gray-600 text-sm mb-4 line-clamp-3'>
											{content.content.replace(/[#*_`]/g, '').substring(0, 100)}
											...
										</p>
										<div className='flex items-center justify-between text-sm text-gray-500'>
											<span>
												{new Date(content.createdAt).toLocaleDateString(
													'ko-KR'
												)}
											</span>
											<span>조회 {content.viewCount}</span>
										</div>
									</div>
								</article>
							))}
						</div>

						<div className='text-center mt-8'>
							<a
								href='/library'
								className='inline-flex items-center px-6 py-3 border border-brand-300 text-brand-700 bg-white hover:bg-brand-50 rounded-lg font-medium transition-colors'
							>
								더 많은 소식 보기
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
							</a>
						</div>
					</div>
				</section>
			)}
		</PublicLayout>
	);
}
