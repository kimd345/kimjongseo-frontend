// src/components/public/enhanced-content-grid.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Content, ContentType } from '@/types';
import {
	DocumentTextIcon,
	MegaphoneIcon,
	NewspaperIcon,
	AcademicCapIcon,
	PlayIcon,
	PhotoIcon,
	EyeIcon,
	CalendarIcon,
	MagnifyingGlassIcon,
	FunnelIcon,
} from '@heroicons/react/24/outline';

interface ContentGridProps {
	contents: Content[];
	menuName: string;
	showFilters?: boolean;
}

export default function ContentGrid({
	contents,
	menuName,
	showFilters = true,
}: ContentGridProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const getContentIcon = (type: ContentType) => {
		switch (type) {
			case ContentType.ANNOUNCEMENT:
				return MegaphoneIcon;
			case ContentType.PRESS_RELEASE:
				return NewspaperIcon;
			case ContentType.ACADEMIC_MATERIAL:
				return AcademicCapIcon;
			case ContentType.VIDEO:
				return PlayIcon;
			case ContentType.PHOTO_GALLERY:
				return PhotoIcon;
			default:
				return DocumentTextIcon;
		}
	};

	const getContentTypeLabel = (type: ContentType) => {
		switch (type) {
			case ContentType.ANNOUNCEMENT:
				return '공지사항';
			case ContentType.PRESS_RELEASE:
				return '보도자료';
			case ContentType.ACADEMIC_MATERIAL:
				return '학술자료';
			case ContentType.VIDEO:
				return '영상';
			case ContentType.PHOTO_GALLERY:
				return '사진갤러리';
			default:
				return '일반글';
		}
	};

	const getContentTypeColor = (type: ContentType) => {
		switch (type) {
			case ContentType.ANNOUNCEMENT:
				return 'bg-red-100 text-red-800';
			case ContentType.PRESS_RELEASE:
				return 'bg-blue-100 text-blue-800';
			case ContentType.ACADEMIC_MATERIAL:
				return 'bg-purple-100 text-purple-800';
			case ContentType.VIDEO:
				return 'bg-green-100 text-green-800';
			case ContentType.PHOTO_GALLERY:
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Get unique categories and types
	const categories = useMemo(() => {
		const uniqueCategories = [
			...new Set(contents.map((c) => c.category).filter(Boolean)),
		];
		return uniqueCategories;
	}, [contents]);

	const contentTypes = useMemo(() => {
		const uniqueTypes = [...new Set(contents.map((c) => c.type))];
		return uniqueTypes;
	}, [contents]);

	// Filter contents
	const filteredContents = useMemo(() => {
		return contents.filter((content) => {
			const matchesSearch =
				searchTerm === '' ||
				content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				content.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(content.category &&
					content.category.toLowerCase().includes(searchTerm.toLowerCase()));

			const matchesType =
				selectedType === 'all' || content.type === selectedType;
			const matchesCategory =
				selectedCategory === 'all' || content.category === selectedCategory;

			return matchesSearch && matchesType && matchesCategory;
		});
	}, [contents, searchTerm, selectedType, selectedCategory]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const truncateContent = (content: string, maxLength: number = 150) => {
		const stripped = content.replace(/[#*_`]/g, '').replace(/\n/g, ' ');
		return stripped.length > maxLength
			? stripped.substring(0, maxLength) + '...'
			: stripped;
	};

	if (contents.length === 0) {
		return (
			<section className='text-center py-16'>
				<div className='max-w-md mx-auto'>
					<DocumentTextIcon className='mx-auto h-12 w-12 text-gray-400' />
					<h3 className='mt-2 text-lg font-medium text-gray-900'>
						콘텐츠가 없습니다
					</h3>
					<p className='mt-1 text-gray-500'>
						이 메뉴에 등록된 콘텐츠가 없습니다.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<div className='text-center mb-8'>
				<h2 className='text-2xl font-bold text-gray-900 mb-4'>
					{menuName} 콘텐츠
				</h2>
				<div className='w-24 h-1 bg-brand-600 mx-auto'></div>
				<p className='mt-4 text-gray-600'>
					총 {filteredContents.length}개의 콘텐츠가 있습니다.
				</p>
			</div>

			{/* Filters */}
			{showFilters && (contents.length > 6 || categories.length > 0) && (
				<div className='mb-8 space-y-4'>
					{/* Search Bar */}
					<div className='relative max-w-md mx-auto'>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							placeholder='콘텐츠 검색...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-500 focus:border-brand-500'
						/>
					</div>

					{/* Filter Options */}
					<div className='flex flex-wrap items-center justify-center gap-4'>
						<div className='flex items-center gap-2'>
							<FunnelIcon className='h-4 w-4 text-gray-500' />
							<span className='text-sm font-medium text-gray-700'>필터:</span>
						</div>

						{/* Content Type Filter */}
						{contentTypes.length > 1 && (
							<select
								value={selectedType}
								onChange={(e) =>
									setSelectedType(e.target.value as ContentType | 'all')
								}
								className='text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500'
							>
								<option value='all'>모든 유형</option>
								{contentTypes.map((type) => (
									<option key={type} value={type}>
										{getContentTypeLabel(type)}
									</option>
								))}
							</select>
						)}

						{/* Category Filter */}
						{categories.length > 0 && (
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className='text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500'
							>
								<option value='all'>모든 카테고리</option>
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						)}

						{/* Clear Filters */}
						{(searchTerm ||
							selectedType !== 'all' ||
							selectedCategory !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setSelectedType('all');
									setSelectedCategory('all');
								}}
								className='text-sm text-brand-600 hover:text-brand-700 font-medium'
							>
								필터 초기화
							</button>
						)}
					</div>
				</div>
			)}

			{/* No Results */}
			{filteredContents.length === 0 && (
				<div className='text-center py-12'>
					<MagnifyingGlassIcon className='mx-auto h-12 w-12 text-gray-400' />
					<h3 className='mt-2 text-lg font-medium text-gray-900'>
						검색 결과가 없습니다
					</h3>
					<p className='mt-1 text-gray-500'>
						다른 검색어나 필터를 시도해보세요.
					</p>
				</div>
			)}

			{/* Content Grid */}
			{filteredContents.length > 0 && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredContents.map((content) => {
						const IconComponent = getContentIcon(content.type);

						return (
							<Link
								key={content.id}
								href={`/content/${content.id}`}
								className='group'
							>
								<article className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-300 transition-all duration-200'>
									{/* Featured Image */}
									{content.featuredImage && (
										<div className='relative h-48 bg-gray-200 overflow-hidden'>
											<img
												src={content.featuredImage}
												alt={content.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
											/>
											<div className='absolute top-4 left-4'>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(content.type)}`}
												>
													<IconComponent className='h-3 w-3 mr-1' />
													{getContentTypeLabel(content.type)}
												</span>
											</div>
										</div>
									)}

									<div className='p-6'>
										{/* Content Type Badge (if no featured image) */}
										{!content.featuredImage && (
											<div className='mb-3'>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(content.type)}`}
												>
													<IconComponent className='h-3 w-3 mr-1' />
													{getContentTypeLabel(content.type)}
												</span>
											</div>
										)}

										{/* Category */}
										{content.category && (
											<div className='text-sm text-brand-600 font-medium mb-2'>
												{content.category}
											</div>
										)}

										{/* Title */}
										<h3 className='text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors'>
											{content.title}
										</h3>

										{/* Content Preview */}
										<p className='text-gray-600 text-sm mb-4 line-clamp-3'>
											{truncateContent(content.content)}
										</p>

										{/* YouTube Preview for Video Content */}
										{content.type === ContentType.VIDEO &&
											content.youtubeId && (
												<div className='mb-4'>
													<div className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden'>
														<img
															src={`https://img.youtube.com/vi/${content.youtubeId}/mqdefault.jpg`}
															alt={content.title}
															className='w-full h-full object-cover'
														/>
														<div className='absolute inset-0 flex items-center justify-center'>
															<div className='bg-red-600 text-white rounded-full p-3 group-hover:scale-110 transition-transform'>
																<PlayIcon className='h-6 w-6' />
															</div>
														</div>
													</div>
												</div>
											)}

										{/* Meta Information */}
										<div className='flex items-center justify-between text-sm text-gray-500'>
											<div className='flex items-center gap-4'>
												<span className='flex items-center gap-1'>
													<CalendarIcon className='h-4 w-4' />
													{formatDate(content.createdAt)}
												</span>
												<span className='flex items-center gap-1'>
													<EyeIcon className='h-4 w-4' />
													{content.viewCount}
												</span>
											</div>
											{content.authorName && (
												<span className='text-gray-600 truncate max-w-24'>
													{content.authorName}
												</span>
											)}
										</div>
									</div>
								</article>
							</Link>
						);
					})}
				</div>
			)}

			{/* Load More / Pagination placeholder */}
			{filteredContents.length >= 12 && (
				<div className='text-center mt-8'>
					<button className='inline-flex items-center px-6 py-3 border border-brand-300 text-brand-700 bg-white hover:bg-brand-50 rounded-lg font-medium transition-colors'>
						더 많은 콘텐츠 보기
					</button>
				</div>
			)}
		</section>
	);
}
