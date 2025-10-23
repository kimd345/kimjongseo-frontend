'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ContentItem } from '@/lib/content-manager';
import { cleanMarkdownForPreview } from '@/lib/content-utils';
import { ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface RecentNewsSectionProps {
	contents: ContentItem[];
}

export default function RecentNewsSection({
	contents,
}: RecentNewsSectionProps) {
	if (contents.length === 0) return null;

	return (
		<section className='py-12 md:py-20 bg-black text-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='text-center mb-12 md:mb-16'>
					<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6'>
						기념사업회 소식
					</h2>
					<p className='text-lg md:text-xl text-gray-300 max-w-2xl mx-auto'>
						김종서장군기념사업회의 최근 활동과 소식을 전해드립니다.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
					{contents.map((content) => (
						<Link
							key={content.id}
							href={`/content/${content.id}`}
							className='group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 active:scale-[0.98]'
						>
							{content.images && content.images[0] && (
								<div className='relative h-48 overflow-hidden'>
									<Image
										src={content.images[0]}
										alt={content.title}
										fill
										className='object-cover group-hover:scale-110 transition-transform duration-300'
									/>
								</div>
							)}
							<div className='p-6'>
								<div className='text-sm text-brand-400 font-medium mb-2'>
									{content.category || '일반'}
								</div>
								<h3 className='text-lg md:text-xl font-semibold mb-3 line-clamp-2 group-hover:text-brand-300 transition-colors'>
									{content.title}
								</h3>
								<p className='text-gray-400 text-sm mb-4 line-clamp-3'>
									{cleanMarkdownForPreview(content.content, 120)}
								</p>
								<div className='flex items-center justify-between text-sm text-gray-500'>
									<span>
										{new Date(content.createdAt).toLocaleDateString('ko-KR')}
									</span>
									<span className='flex items-center'>
										더 보기 <ArrowRightIcon className='ml-1 h-4 w-4' />
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>

				<div className='text-center mt-8 md:mt-12'>
					<Link
						href='/library'
						className='inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 active:scale-[0.98]'
					>
						더 많은 소식 보기
						<ChevronRightIcon className='ml-2 h-5 w-5' />
					</Link>
				</div>
			</div>
		</section>
	);
}
