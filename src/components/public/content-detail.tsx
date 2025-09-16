// src/components/public/content-detail.tsx
'use client';

import { Content, ContentType } from '@/types';
import {
	CalendarIcon,
	EyeIcon,
	UserIcon,
	DocumentTextIcon,
	PlayIcon,
	PhotoIcon,
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface ContentDetailProps {
	content: Content;
}

export default function ContentDetail({ content }: ContentDetailProps) {
	const getContentTypeIcon = (type: ContentType) => {
		switch (type) {
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
			weekday: 'long',
		});
	};

	const IconComponent = getContentTypeIcon(content.type);

	return (
		<article className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
			{/* Featured Image */}
			{content.featuredImage && (
				<div className='relative h-64 md:h-80 bg-gray-200'>
					<img
						src={content.featuredImage}
						alt={content.title}
						className='w-full h-full object-cover'
					/>
					<div className='absolute top-4 left-4'>
						<span
							className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getContentTypeColor(content.type)}`}
						>
							<IconComponent className='h-4 w-4 mr-1' />
							{getContentTypeLabel(content.type)}
						</span>
					</div>
				</div>
			)}

			<div className='p-6 md:p-8'>
				{/* Content Type Badge (if no featured image) */}
				{!content.featuredImage && (
					<div className='mb-4'>
						<span
							className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getContentTypeColor(content.type)}`}
						>
							<IconComponent className='h-4 w-4 mr-1' />
							{getContentTypeLabel(content.type)}
						</span>
					</div>
				)}

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
						{formatDate(content.createdAt)}
					</div>
					<div className='flex items-center gap-1'>
						<EyeIcon className='h-4 w-4' />
						{content.viewCount} 조회
					</div>
					{content.authorName && (
						<div className='flex items-center gap-1'>
							<UserIcon className='h-4 w-4' />
							{content.authorName}
						</div>
					)}
				</div>

				{/* YouTube Video for Video Content */}
				{content.type === ContentType.VIDEO && content.youtubeId && (
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

				{/* Content */}
				<div className='prose prose-lg max-w-none'>
					<ReactMarkdown
						components={{
							// Custom link handling for downloads
							a: ({ href, children, ...props }) => {
								if (href?.includes('/download/')) {
									return (
										<a
											href={href}
											className='inline-flex items-center text-brand-600 hover:text-brand-700 font-medium'
											download
											{...props}
										>
											<DocumentTextIcon className='h-4 w-4 mr-1' />
											{children}
										</a>
									);
								}
								return (
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
								);
							},
							// Custom image handling
							img: ({ src, alt, ...props }) => (
								<div className='my-6'>
									<img
										src={src}
										alt={alt}
										className='w-full rounded-lg shadow-sm'
										{...props}
									/>
									{alt && (
										<p className='text-sm text-gray-500 text-center mt-2'>
											{alt}
										</p>
									)}
								</div>
							),
							// Custom heading styles
							h1: ({ children, ...props }) => (
								<h1
									className='text-2xl font-bold text-gray-900 mt-8 mb-4'
									{...props}
								>
									{children}
								</h1>
							),
							h2: ({ children, ...props }) => (
								<h2
									className='text-xl font-bold text-gray-900 mt-6 mb-3'
									{...props}
								>
									{children}
								</h2>
							),
							h3: ({ children, ...props }) => (
								<h3
									className='text-lg font-semibold text-gray-900 mt-4 mb-2'
									{...props}
								>
									{children}
								</h3>
							),
						}}
					>
						{content.content}
					</ReactMarkdown>
				</div>

				{/* Attachments */}
				{content.attachments && content.attachments.length > 0 && (
					<div className='mt-8 pt-6 border-t border-gray-200'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							첨부파일
						</h3>
						<div className='space-y-2'>
							{content.attachments.map((attachment, index) => (
								<a
									key={index}
									href={attachment}
									className='flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors'
									download
								>
									<DocumentTextIcon className='h-5 w-5' />
									<span>첨부파일 {index + 1}</span>
								</a>
							))}
						</div>
					</div>
				)}

				{/* Metadata Display for Academic Content */}
				{content.metadata && content.type === ContentType.ACADEMIC_MATERIAL && (
					<div className='mt-8 pt-6 border-t border-gray-200'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							논문 정보
						</h3>
						<div className='bg-gray-50 rounded-lg p-4 space-y-2'>
							{content.metadata.author && (
								<div>
									<strong>저자:</strong> {content.metadata.author}
								</div>
							)}
							{content.metadata.journal && (
								<div>
									<strong>학술지:</strong> {content.metadata.journal}
								</div>
							)}
							{content.metadata.year && (
								<div>
									<strong>발행년도:</strong> {content.metadata.year}
								</div>
							)}
							{content.metadata.doi && (
								<div>
									<strong>DOI:</strong> {content.metadata.doi}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</article>
	);
}
