// src/components/ui/mobile-optimized-section.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface MobileSectionProps {
	id: string;
	name: string;
	description: string;
	image: string;
	url: string;
	subsections?: Record<string, string>;
	index: number;
	isReversed?: boolean;
}

export function MobileOptimizedSection({
	id,
	name,
	description,
	image,
	url,
	subsections,
	index,
	isReversed = false,
}: MobileSectionProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { ref, inView } = useInView({
		threshold: 0.2,
		triggerOnce: true,
		rootMargin: '-50px',
	});

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<section
			ref={ref}
			id={`${id}-section`}
			className={`relative min-h-screen flex items-center py-12 md:py-20 ${
				index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
			}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
				{/* Mobile Layout */}
				<div className='md:hidden space-y-8'>
					{/* Image First on Mobile */}
					<div
						className={`transform transition-all duration-1000 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<div className='relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg'>
							<Image
								src={image}
								alt={name}
								fill
								className={`object-cover transition-all duration-700 ${
									imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
								}`}
								sizes='(max-width: 768px) 100vw'
								onLoad={() => setImageLoaded(true)}
								priority={index < 2}
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
						</div>
					</div>

					{/* Content */}
					<div
						className={`space-y-6 transform transition-all duration-1000 delay-300 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						}`}
					>
						<div className='text-center'>
							<span className='inline-block px-3 py-1 bg-brand-100 text-brand-800 text-sm font-medium rounded-full mb-3'>
								{String(index + 1).padStart(2, '0')}
							</span>
							<h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight'>
								{name}
							</h2>
							<p className='text-lg sm:text-xl text-gray-600 leading-relaxed'>
								{description}
							</p>
						</div>

						{/* Subsections - Compact Mobile Layout */}
						{subsections && (
							<div className='space-y-3'>
								<h3 className='text-center text-lg font-semibold text-gray-900 mb-4'>
									주요 내용
								</h3>
								<div className='grid grid-cols-1 gap-3'>
									{Object.entries(subsections)
										.slice(0, isMobile ? 3 : 4)
										.map(([subId, subName]) => (
											<Link
												key={subId}
												href={`/${id}/${subId}`}
												className='flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-300 hover:shadow-md transition-all duration-200 group active:scale-[0.98]'
												style={{ minHeight: '44px' }} // iOS touch target
											>
												<span className='font-medium text-gray-900 group-hover:text-brand-600 text-sm sm:text-base'>
													{subName}
												</span>
												<ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-brand-500 group-hover:transform group-hover:translate-x-1 transition-all flex-shrink-0' />
											</Link>
										))}
									{Object.keys(subsections).length > (isMobile ? 3 : 4) && (
										<div className='text-center text-sm text-gray-500 pt-2'>
											외 {Object.keys(subsections).length - (isMobile ? 3 : 4)}
											개 항목
										</div>
									)}
								</div>
							</div>
						)}

						{/* CTA Button */}
						<div className='text-center pt-4'>
							<Link
								href={url}
								className='inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all duration-200 active:scale-[0.98] shadow-md'
								style={{ minHeight: '44px' }} // iOS touch target
							>
								자세히 보기
								<ArrowRightIcon className='ml-2 h-5 w-5' />
							</Link>
						</div>
					</div>
				</div>

				{/* Desktop Layout */}
				<div className='hidden md:grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
					{/* Content */}
					<div
						className={`space-y-6 ${isReversed ? 'lg:order-2' : ''} transform transition-all duration-1000 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
						}`}
					>
						<div>
							<span className='inline-block px-4 py-2 bg-brand-100 text-brand-800 text-sm font-medium rounded-full mb-4'>
								{String(index + 1).padStart(2, '0')}
							</span>
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
										<ChevronRightIcon className='h-5 w-5 text-gray-400 group-hover:text-brand-500 group-hover:transform group-hover:translate-x-1 transition-all' />
									</Link>
								))}
							</div>
						)}

						{/* CTA */}
						<div className='pt-6'>
							<Link
								href={url}
								className='inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all duration-200 transform hover:scale-105'
							>
								자세히 보기
								<ArrowRightIcon className='ml-2 h-5 w-5' />
							</Link>
						</div>
					</div>

					{/* Image */}
					<div
						className={`relative ${isReversed ? 'lg:order-1' : ''} transform transition-all duration-1000 delay-300 ${
							inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
						}`}
					>
						<div className='relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl'>
							<Image
								src={image}
								alt={name}
								fill
								className={`object-cover transition-all duration-700 ${
									imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
								}`}
								sizes='(max-width: 1024px) 100vw, 50vw'
								onLoad={() => setImageLoaded(true)}
								priority={index < 2}
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

// Touch-optimized hero section for mobile
export function MobileHeroSection() {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [touchStart, setTouchStart] = useState<number | null>(null);

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0].clientY);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!touchStart) return;

		const currentTouch = e.targetTouches[0].clientY;
		const diff = touchStart - currentTouch;

		// Scroll down gesture
		if (diff > 50) {
			const aboutSection = document.getElementById('about-general-section');
			if (aboutSection) {
				aboutSection.scrollIntoView({ behavior: 'smooth' });
			}
			setTouchStart(null);
		}
	};

	return (
		<section
			className='relative min-h-screen h-screen flex items-center justify-center overflow-hidden'
			style={{
				// minHeight: '100vh',
				minHeight: '100dvh', // Dynamic viewport height for mobile
			}}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
		>
			{/* Background Image */}
			<div className='absolute inset-0 w-full h-full'>
				<Image
					src='/assets/home-1.jpg'
					alt='김종서 장군'
					fill
					priority
					className={`object-cover object-center w-full h-full transition-all duration-1000 ${
						imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
					}`}
					quality={90}
					onLoad={() => setImageLoaded(true)}
					sizes='100vw'
				/>
				<div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70' />
			</div>

			{/* Content */}
			<div className='relative z-10 text-center text-white px-4 sm:px-6'>
				<div className='animate-fade-in-up'>
					<h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight'>
						절재 김종서 장군
					</h1>
					<div className='text-xl sm:text-2xl text-brand-300 mb-6'>
						金宗瑞 (1383-1453)
					</div>
				</div>

				<div className='animate-fade-in-up animation-delay-300'>
					<p className='text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto'>
						조선 전기의 명재상이자 무장
						<br className='hidden sm:block' />
						<span className='sm:hidden'> </span>6진 개척을 통한 영토 확장의 주역
					</p>
				</div>

				<div className='animate-fade-in-up animation-delay-500 space-y-4'>
					<button
						onClick={() => {
							const aboutSection = document.getElementById(
								'about-general-section'
							);
							if (aboutSection) {
								aboutSection.scrollIntoView({ behavior: 'smooth' });
							}
						}}
						className='block w-full sm:inline-block sm:w-auto px-8 py-4 bg-brand-600 text-white text-lg font-semibold rounded-full hover:bg-brand-700 transition-all duration-300 active:scale-[0.98] mb-4 sm:mb-0 sm:mr-4'
						style={{ minHeight: '44px' }}
					>
						장군 소개 보기
					</button>

					<Link
						href='/organization'
						className='block w-full sm:inline-block sm:w-auto px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 active:scale-[0.98]'
						style={{ minHeight: '44px' }}
					>
						기념사업회
					</Link>
				</div>
			</div>

			{/* Mobile Scroll Indicator */}
			<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center md:hidden'>
				<div className='w-6 h-10 border-2 border-white rounded-full flex justify-center mb-2 scroll-indicator'>
					<div className='w-1 h-3 bg-white rounded-full mt-2'></div>
				</div>
				<p className='text-white text-sm'>위로 스와이프</p>
			</div>
		</section>
	);
}
