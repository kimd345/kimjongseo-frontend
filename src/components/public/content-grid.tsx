// src/components/public/content-grid.tsx
'use client';

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
} from '@heroicons/react/24/outline';

interface ContentGridProps {
	contents: Content[];
	menuName: string;
}

export default function ContentGrid({ contents, menuName }: ContentGridProps) {
	if (contents.length === 0) {
		return null;
	}

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

	return (
		<section>
			<div className='text-center mb-8'>
				<h2 className='text-2xl font-bold text-gray-900 mb-4'>
					{menuName} 콘텐츠
				</h2>
				<div className='w-24 h-1 bg-brand-600 mx-auto'></div>
				<p className='mt-4 text-gray-600'>
					총 {contents.length}개의 콘텐츠가 있습니다.
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{contents.map((content) => {
					const IconComponent = getContentIcon(content.type);

					return (
						<article
							key={content.id}
							className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200'
						>
							{/* Featured Image */}
							{content.featuredImage && (
								<div className='relative h-48 bg-gray-200'>
									<img
										src={content.featuredImage}
										alt={content.title}
										className='w-full h-full object-cover'
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
								<h3 className='text-lg font-semibold text-gray-900 mb-3 line-clamp-2'>
									{content.title}
								</h3>

								{/* Content Preview */}
								<p className='text-gray-600 text-sm mb-4 line-clamp-3'>
									{truncateContent(content.content)}
								</p>

								{/* YouTube Preview for Video Content */}
								{content.type === ContentType.VIDEO && content.youtubeId && (
									<div className='mb-4'>
										<div className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden'>
											<img
												src={`https://img.youtube.com/vi/${content.youtubeId}/mqdefault.jpg`}
												alt={content.title}
												className='w-full h-full object-cover'
											/>
											<div className='absolute inset-0 flex items-center justify-center'>
												<div className='bg-red-600 text-white rounded-full p-3'>
													<PlayIcon className='h-6 w-6' />
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Meta Information */}
								<div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
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
										<span className='text-gray-600'>{content.authorName}</span>
									)}
								</div>

								{/* Read More Button */}
								<Link
									href={`/content/${content.id}`}
									className='inline-flex items-center text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors'
								>
									자세히 보기
									<svg
										className='ml-1 h-4 w-4'
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
						</article>
					);
				})}
			</div>

			{/* Load More Button (for future pagination) */}
			{contents.length >= 9 && (
				<div className='text-center mt-8'>
					<button className='inline-flex items-center px-6 py-3 border border-brand-300 text-brand-700 bg-white hover:bg-brand-50 rounded-lg font-medium transition-colors'>
						더 많은 콘텐츠 보기
					</button>
				</div>
			)}
		</section>
	);
}
