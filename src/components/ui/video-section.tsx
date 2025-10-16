// src/components/ui/modern-video-section.tsx - Simplified: Videos only on desktop
'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface VideoSectionProps {
	id: string;
	name: string;
	description: string;
	image: string;
	videoSrc: string;
	url: string;
	subsections?: Record<string, string>;
	index: number;
	isReversed?: boolean;
}

export function VideoSection({
	id,
	name,
	description,
	image,
	videoSrc,
	url,
	subsections,
	index,
	isReversed = false,
}: VideoSectionProps) {
	const [isMobile, setIsMobile] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const { ref, inView } = useInView({
		threshold: 0.1,
		triggerOnce: true,
		rootMargin: '100px',
	});

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Auto-play video on desktop when in view
	useEffect(() => {
		if (!isMobile && inView && videoRef.current) {
			videoRef.current.play().catch(() => {
				// Autoplay blocked - that's fine
			});
		}
	}, [inView, isMobile]);

	const togglePlayPause = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
		}
	};

	return (
		<section
			ref={ref}
			id={`${id}-section`}
			className={`relative min-h-screen flex items-center ${
				index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
			}`}
		>
			<div className='w-full'>
				{/* Mobile Layout - Image Only (No Video) */}
				<div className='md:hidden'>
					<div
						className={`relative transform transition-all duration-1000 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<div className='relative w-full aspect-video'>
							<Image
								src={image}
								alt={name}
								fill
								className='object-contain'
								sizes='100vw'
								priority={index === 0}
							/>
						</div>
					</div>

					<div
						className={`px-6 py-12 transform transition-all duration-1000 delay-300 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<div className='space-y-6'>
							<div className='text-center'>
								<h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight'>
									{name}
								</h2>
								<p className='text-lg sm:text-xl text-gray-600 leading-relaxed'>
									{description}
								</p>
							</div>

							{subsections && (
								<div className='space-y-3'>
									<h3 className='text-center text-lg font-semibold text-gray-900 mb-4'>
										주요 내용
									</h3>
									<div className='grid grid-cols-1 gap-3'>
										{Object.entries(subsections)
											.slice(0, 3)
											.map(([subId, subName]) => (
												<Link
													key={subId}
													href={`/${id}/${subId}`}
													className='flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-md transition-all duration-200 group active:scale-[0.98]'
												>
													<span className='font-medium text-gray-900 group-hover:text-brand-600'>
														{subName}
													</span>
													<ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all' />
												</Link>
											))}
										{Object.keys(subsections).length > 3 && (
											<div className='text-center text-sm text-gray-500 pt-2'>
												외 {Object.keys(subsections).length - 3}개 항목
											</div>
										)}
									</div>
								</div>
							)}

							<div className='text-center pt-4'>
								<Link
									href={url}
									className='inline-flex items-center px-6 py-3 bg-white text-black border-black border font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] shadow-md'
								>
									자세히 보기
									<ArrowRightIcon className='ml-2 h-5 w-5' />
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Desktop Layout - Video on Left/Right, Content on Other Side */}
				<div className='hidden md:grid grid-cols-1 lg:grid-cols-2 min-h-screen'>
					{/* Video Side - Desktop Only */}
					<div
						className={`relative ${isReversed ? 'lg:order-2' : ''} transform transition-all duration-1000 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
						}`}
					>
						<div className='sticky top-0 h-screen bg-gray-900'>
							{/* Video - Shows on Desktop */}
							{videoSrc ? (
								<>
									<video
										ref={videoRef}
										className='absolute inset-0 w-full h-full object-cover'
										loop
										muted
										playsInline
										preload='auto'
										onPlay={() => setIsPlaying(true)}
										onPause={() => setIsPlaying(false)}
									>
										<source src={videoSrc} type='video/mp4' />
									</video>

									{/* Click overlay to pause/play */}
									<button
										onClick={togglePlayPause}
										className='absolute inset-0 w-full h-full bg-transparent hover:bg-black/10 transition-colors cursor-pointer'
										aria-label={isPlaying ? '일시정지' : '재생'}
										type='button'
									/>
								</>
							) : (
								// Fallback to image if no video
								<Image
									src={image}
									alt={name}
									fill
									className='object-cover'
									sizes='50vw'
									priority={index === 0}
								/>
							)}

							{/* Gradient Overlay */}
							<div className='absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none' />
						</div>
					</div>

					{/* Content Side */}
					<div
						className={`relative flex items-center ${isReversed ? 'lg:order-1' : ''} transform transition-all duration-1000 delay-300 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
						}`}
					>
						<div className='w-full px-8 lg:px-16 py-16'>
							<div className='max-w-xl mx-auto space-y-8'>
								{/* Decorative Small Image */}
								<div className='relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white'>
									<Image
										src={image}
										alt={`${name} 아이콘`}
										fill
										className='object-cover'
										sizes='128px'
									/>
								</div>

								{/* Title & Description */}
								<div>
									<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
										{name}
									</h2>
									<p className='text-xl md:text-2xl text-gray-600 leading-relaxed mb-8'>
										{description}
									</p>
								</div>

								{/* Subsections */}
								{subsections && (
									<div className='space-y-3'>
										<h3 className='text-lg font-semibold text-gray-900 mb-4'>
											주요 내용
										</h3>
										{Object.entries(subsections).map(([subId, subName]) => (
											<Link
												key={subId}
												href={`/${id}/${subId}`}
												className='flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-md transition-all duration-200 group'
											>
												<span className='font-medium text-gray-900 group-hover:text-brand-600'>
													{subName}
												</span>
												<ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all' />
											</Link>
										))}
									</div>
								)}

								{/* CTA */}
								<div className='pt-6'>
									<Link
										href={url}
										className='inline-flex items-center px-6 py-3 bg-white text-black border-black border font-semibold rounded-lg transition-all duration-200 transform hover:scale-105'
									>
										자세히 보기
										<ArrowRightIcon className='ml-2 h-5 w-5' />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
