// src/app/content/[id]/page.tsx - Fixed hydration error
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ContentItem, FIXED_SECTIONS } from '@/lib/content-manager';
import PublicLayout from '@/components/layout/public-layout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ReactMarkdown from 'react-markdown';
import {
	ChevronLeftIcon,
	HomeIcon,
	ChevronRightIcon,
	CalendarIcon,
	EyeIcon,
	UserIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

export default function ContentDetailPage() {
	const { id } = useParams();
	const [content, setContent] = useState<ContentItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadContent = async () => {
			try {
				setLoading(true);
				setError(null);

				console.log('Loading content with ID:', id);

				// First, get the content
				const response = await fetch(`/api/content/${id}`);

				if (response.ok) {
					const contentData = await response.json();
					setContent(contentData);

					// Then increment view count (only once)
					fetch(`/api/content/${id}/view`, { method: 'POST' }).catch(
						console.error
					);
				} else {
					console.error('Content not found, response:', response.status);
					setError('콘텐츠를 찾을 수 없습니다.');
				}
			} catch (error) {
				console.error('Failed to load content:', error);
				setError('콘텐츠를 로드하는 중 오류가 발생했습니다.');
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			loadContent();
		}
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

	if (error || !content) {
		notFound();
	}

	// Build breadcrumbs
	const sectionInfo =
		FIXED_SECTIONS[content.section as keyof typeof FIXED_SECTIONS];
	const breadcrumbs = [{ name: '홈', href: '/' }];

	if (sectionInfo) {
		breadcrumbs.push({
			name: sectionInfo.name,
			href: `/${content.section}`,
		});
	}

	breadcrumbs.push({
		name: content.title,
		href: `/content/${content.id}`,
	});

	return (
		<PublicLayout>
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

					{/* Content */}
					<article className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
						{/* Featured Image */}
						{content.images && content.images[0] && (
							<div className='relative h-64 md:h-80 bg-gray-200'>
								<img
									src={content.images[0]}
									alt={content.title}
									className='w-full h-full object-cover'
								/>
							</div>
						)}

						<div className='p-6 md:p-8'>
							{/* Category */}
							{content.category && (
								<div className='text-brand-600 font-medium mb-2'>
									{content.category}
								</div>
							)}

							{/* Title */}
							<h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight'>
								{content.title}
							</h1>

							{/* Meta Information */}
							<div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200'>
								<div className='flex items-center gap-1'>
									<CalendarIcon className='h-4 w-4' />
									{new Date(content.createdAt).toLocaleDateString('ko-KR', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</div>
								<div className='flex items-center gap-1'>
									<EyeIcon className='h-4 w-4' />
									{content.viewCount} 조회
								</div>
								{content.author && (
									<div className='flex items-center gap-1'>
										<UserIcon className='h-4 w-4' />
										{content.author}
									</div>
								)}
							</div>

							{/* YouTube Video for Video Content */}
							{content.type === 'video' && content.youtubeId && (
								<div className='mb-8'>
									<div className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden'>
										<iframe
											src={`https://www.youtube.com/embed/${content.youtubeId}`}
											title={content.title}
											className='w-full h-full'
											allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
											allowFullScreen
										/>
									</div>
								</div>
							)}

							{/* Additional YouTube Videos */}
							{content.youtubeUrls && content.youtubeUrls.length > 0 && (
								<div className='mb-8'>
									<h3 className='text-lg font-semibold text-gray-900 mb-4'>
										관련 영상
									</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										{content.youtubeUrls.map((url, index) => {
											const videoId = url.match(
												/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
											)?.[1];
											if (!videoId) return null;

											return (
												<div
													key={index}
													className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden'
												>
													<iframe
														src={`https://www.youtube.com/embed/${videoId}`}
														title={`관련 영상 ${index + 1}`}
														className='w-full h-full'
														allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
														allowFullScreen
													/>
												</div>
											);
										})}
									</div>
								</div>
							)}

							{/* Content Body - FIXED to prevent hydration errors */}
							<div className='prose prose-lg max-w-none'>
								<ReactMarkdown
									components={{
										// Fixed: Don't wrap images in p tags to prevent figure > p nesting
										p: ({ children, ...props }) => {
											// Check if paragraph only contains an image
											const hasOnlyImage = React.Children.toArray(
												children
											).every(
												(child) =>
													React.isValidElement(child) &&
													(child.type === 'img' || child.props?.src)
											);

											if (hasOnlyImage) {
												return <div {...props}>{children}</div>;
											}

											return <p {...props}>{children}</p>;
										},
										// Custom link handling
										a: ({ href, children, ...props }) => (
											<a
												href={href}
												className='text-brand-600 hover:text-brand-700'
												target={href?.startsWith('http') ? '_blank' : undefined}
												rel={
													href?.startsWith('http')
														? 'noopener noreferrer'
														: undefined
												}
												{...props}
											>
												{children}
											</a>
										),
										// Custom image handling - use figure without nesting in p
										img: ({ src, alt, ...props }) => (
											<figure className='my-6'>
												<img
													src={src}
													alt={alt}
													className='w-full rounded-lg shadow-sm'
													{...props}
												/>
												{alt && (
													<figcaption className='text-sm text-gray-500 text-center mt-2'>
														{alt}
													</figcaption>
												)}
											</figure>
										),
									}}
								>
									{content.content}
								</ReactMarkdown>
							</div>
						</div>
					</article>

					{/* Navigation back to section */}
					{sectionInfo && (
						<div className='mt-12 text-center'>
							<Link
								href={`/${content.section}`}
								className='inline-flex items-center px-6 py-3 border border-brand-300 text-brand-700 bg-white hover:bg-brand-50 rounded-lg font-medium transition-colors'
							>
								{sectionInfo.name} 더 보기
								<ChevronRightIcon className='ml-2 h-4 w-4' />
							</Link>
						</div>
					)}
				</div>
			</div>
		</PublicLayout>
	);
}
