// src/app/page.tsx - Fixed with clean content preview
'use client';

import { useState, useEffect } from 'react';
import {
	ContentItem,
	FIXED_SECTIONS,
	hasSubsections,
} from '@/lib/content-manager';
import { cleanMarkdownForPreview } from '@/lib/content-utils';
import Link from 'next/link';
import PublicLayout from '@/components/layout/public-layout';

export default function HomePage() {
	const [recentContents, setRecentContents] = useState<ContentItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await fetch('/api/content?status=published');
				const data = await response.json();
				const allContent = Object.values(
					data.content || {}
				).flat() as ContentItem[];
				const recent = allContent
					.sort(
						(a, b) =>
							new Date(b.publishedAt).getTime() -
							new Date(a.publishedAt).getTime()
					)
					.slice(0, 6);
				setRecentContents(recent);
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
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600'></div>
				</div>
			</PublicLayout>
		);
	}

	return (
		<PublicLayout>
			<div className='min-h-screen'>
				{/* Hero Section */}
				<section className='relative bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
					<div className='absolute inset-0 bg-black/20'></div>
					<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
						<div className='text-center'>
							<span className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6'>
								소개
							</span>
							<h1 className='text-4xl md:text-6xl font-bold mb-6'>
								절재 김종서 장군
							</h1>
							<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto'>
								조선 초기의 명재상이자 무장인 김종서(1383–1453) 장군의 생애와
								업적, 역사적 의의를 소개합니다.
							</p>
						</div>
					</div>
				</section>

				{/* Menu Section - Use fixed sections */}
				<section className='py-16 bg-white'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
							{Object.entries(FIXED_SECTIONS).map(([sectionId, section]) => (
								<Link
									key={sectionId}
									href={`/${sectionId}`}
									className='group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-200'
								>
									<div className='text-center'>
										<div className='w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform'>
											<span className='text-white text-xl font-bold'>
												{section.name.charAt(0)}
											</span>
										</div>
										<h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors'>
											{section.name}
										</h3>
										<p className='text-sm text-gray-600 leading-relaxed'>
											{section.description}
										</p>
										{hasSubsections(section) && (
											<div className='mt-4 pt-4 border-t border-gray-100'>
												<div className='text-xs text-gray-500 space-y-1'>
													{Object.values(section.subsections)
														.slice(0, 3)
														.map((subName, index) => (
															<div key={index}>{subName}</div>
														))}
													{Object.keys(section.subsections).length > 3 && (
														<div>
															외 {Object.keys(section.subsections).length - 3}개
														</div>
													)}
												</div>
											</div>
										)}
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>

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
									<Link
										key={content.id}
										href={`/content/${content.id}`}
										className='group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200'
									>
										{content.images && content.images[0] && (
											<div className='relative h-48 bg-gray-200'>
												<img
													src={content.images[0]}
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
												{cleanMarkdownForPreview(content.content, 100)}
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
									</Link>
								))}
							</div>

							<div className='text-center mt-8'>
								<Link
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
								</Link>
							</div>
						</div>
					</section>
				)}
			</div>
		</PublicLayout>
	);
}
