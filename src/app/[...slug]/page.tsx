// src/app/[...slug]/page.tsx - Fixed with clean content preview
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import {
	ContentItem,
	FIXED_SECTIONS,
	hasSubsections,
} from '@/lib/content-manager';
import { cleanMarkdownForPreview } from '@/lib/content-utils';
import PublicLayout from '@/components/layout/public-layout';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export default function DynamicPage() {
	const { slug } = useParams();
	const [contents, setContents] = useState<ContentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const currentPath = Array.isArray(slug) ? slug.join('/') : slug || '';
	const [mainSection, subSection] = currentPath.split('/');

	// Get section info from fixed structure
	const sectionInfo =
		FIXED_SECTIONS[mainSection as keyof typeof FIXED_SECTIONS];

	useEffect(() => {
		const loadPageData = async () => {
			try {
				setLoading(true);
				setError(null);

				if (!sectionInfo) {
					setError('페이지를 찾을 수 없습니다.');
					return;
				}

				// Load content for this specific section
				const response = await fetch('/api/content');
				const data = await response.json();

				let sectionContent: ContentItem[] = [];

				if (subSection) {
					// Load content for subsection (e.g., "library/press")
					const subsectionKey = `${mainSection}/${subSection}`;
					sectionContent = data.content[subsectionKey] || [];
					console.log(
						`Loading content for subsection: ${subsectionKey}`,
						sectionContent
					);
				} else {
					// Load content for main section - aggregate all subsections
					if (hasSubsections(sectionInfo)) {
						Object.keys(sectionInfo.subsections).forEach((subKey) => {
							const subsectionKey = `${mainSection}/${subKey}`;
							const subsectionContent = data.content[subsectionKey] || [];
							sectionContent = [...sectionContent, ...subsectionContent];
						});
					} else {
						// For sections without subsections, load directly
						sectionContent = data.content[mainSection] || [];
					}
					console.log(
						`Loading content for main section: ${mainSection}`,
						sectionContent
					);
				}

				// Filter only published content for public pages
				const publishedContent = sectionContent.filter(
					(item) => item.status === 'published'
				);

				// Sort by creation date (newest first)
				publishedContent.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);

				setContents(publishedContent);
			} catch (error) {
				console.error('Failed to load page data:', error);
				setError('페이지를 찾을 수 없습니다.');
			} finally {
				setLoading(false);
			}
		};

		loadPageData();
	}, [currentPath, mainSection, subSection, sectionInfo]);

	if (loading) {
		return (
			<PublicLayout>
				<div className='min-h-screen flex items-center justify-center'>
					<LoadingSpinner size='lg' />
				</div>
			</PublicLayout>
		);
	}

	if (error || !sectionInfo) {
		notFound();
	}

	const currentSectionName = subSection
		? hasSubsections(sectionInfo)
			? sectionInfo.subsections[subSection]
			: subSection
		: sectionInfo.name;

	return (
		<PublicLayout>
			{/* Breadcrumbs */}
			<Breadcrumbs
				items={
					subSection
						? [
								{ name: sectionInfo.name, href: `/${mainSection}` },
								{
									name: currentSectionName,
									href: `/${currentPath}`,
									current: true,
								},
							]
						: [
								{
									name: sectionInfo.name,
									href: `/${mainSection}`,
									current: true,
								},
							]
				}
			/>

			{/* Page Header */}
			<div className='bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='text-center'>
						<h1 className='text-4xl md:text-5xl font-bold mb-4'>
							{currentSectionName}
						</h1>
						{sectionInfo.description && !subSection && (
							<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed'>
								{sectionInfo.description}
							</p>
						)}
					</div>
				</div>
				<div className='h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
			</div>

			<div className='min-h-screen bg-gray-50 py-8'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{/* Subsection Navigation */}
					{!subSection && hasSubsections(sectionInfo) && (
						<div className='mb-12'>
							<div className='text-center mb-8'>
								<h2 className='text-2xl font-bold text-gray-900 mb-4'>
									{sectionInfo.name} 하위 메뉴
								</h2>
								<div className='w-24 h-1 bg-brand-600 mx-auto'></div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{Object.entries(sectionInfo.subsections).map(
									([subId, subName]) => (
										<Link
											key={subId}
											href={`/${mainSection}/${subId}`}
											className='group block bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all duration-200'
										>
											<div className='flex items-center justify-between mb-4'>
												<h3 className='text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors'>
													{subName}
												</h3>
												<ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-brand-500 group-hover:transform group-hover:translate-x-1 transition-all duration-200' />
											</div>
										</Link>
									)
								)}
							</div>
						</div>
					)}

					{/* Content Grid */}
					{contents.length > 0 ? (
						<div className='space-y-6'>
							<div className='text-center mb-8'>
								<h2 className='text-2xl font-bold text-gray-900 mb-4'>
									{currentSectionName} 콘텐츠
								</h2>
								<div className='w-24 h-1 bg-brand-600 mx-auto'></div>
								<p className='mt-4 text-gray-600'>
									총 {contents.length}개의 콘텐츠가 있습니다.
								</p>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{contents.map((content) => (
									<Link
										key={content.id}
										href={`/content/${content.id}`}
										className='group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-300 transition-all duration-200'
									>
										{content.images && content.images[0] && (
											<div className='relative h-48 bg-gray-200 overflow-hidden'>
												<img
													src={content.images[0]}
													alt={content.title}
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
												/>
											</div>
										)}

										<div className='p-6'>
											{content.category && (
												<div className='text-sm text-brand-600 font-medium mb-2'>
													{content.category}
												</div>
											)}

											<h3 className='text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors'>
												{content.title}
											</h3>

											<p className='text-gray-600 text-sm mb-4 line-clamp-3'>
												{cleanMarkdownForPreview(content.content, 150)}
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
						</div>
					) : (
						<div className='text-center py-16'>
							<div className='max-w-md mx-auto'>
								<svg
									className='mx-auto h-12 w-12 text-gray-400'
									stroke='currentColor'
									fill='none'
									viewBox='0 0 48 48'
								>
									<path
										d='M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-16-4c1.381 0 2.721-.087 4-.252'
										strokeWidth={2}
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
								<h3 className='mt-2 text-lg font-medium text-gray-900'>
									{subSection ? '콘텐츠가 없습니다' : '준비 중입니다'}
								</h3>
								<p className='mt-1 text-gray-500'>
									{subSection
										? '이 섹션에 등록된 콘텐츠가 아직 없습니다.'
										: '이 페이지의 내용이 곧 업데이트될 예정입니다.'}
								</p>

								{/* Show available sub-menus even if no content */}
								{!subSection && hasSubsections(sectionInfo) && (
									<div className='mt-4'>
										<p className='text-sm text-gray-400 mb-2'>
											사용 가능한 하위 메뉴:
										</p>
										<div className='text-sm text-gray-600'>
											{Object.values(sectionInfo.subsections).join(', ')}
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Content Summary for sections with both sub-menus and content */}
					{!subSection &&
						hasSubsections(sectionInfo) &&
						contents.length > 0 && (
							<div className='mt-12 bg-brand-50 rounded-xl p-6'>
								<h3 className='text-lg font-semibold text-brand-900 mb-2'>
									{sectionInfo.name} 전체 콘텐츠
								</h3>
								<p className='text-brand-700 mb-4'>
									이 섹션에는 총 {contents.length}개의 콘텐츠가 있습니다. 위의
									하위 메뉴를 통해 카테고리별로 살펴보거나, 위에서 전체 콘텐츠를
									확인하실 수 있습니다.
								</p>
							</div>
						)}
				</div>
			</div>
		</PublicLayout>
	);
}
