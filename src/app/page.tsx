'use client';

// src/app/page.tsx - Clean, simple version
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
	ContentItem,
	FIXED_SECTIONS,
	hasSubsections,
} from '@/lib/content-manager';
import { cleanMarkdownForPreview } from '@/lib/content-utils';
import Link from 'next/link';
import PublicLayout from '@/components/layout/public-layout';
import Image from 'next/image';
import { ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { MobileOptimizedSection } from '@/components/ui/mobile-optimized-section';

// Register GSAP plugins
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
	const [recentContents, setRecentContents] = useState<ContentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const lenisRef = useRef<Lenis | null>(null);
	const rafRef = useRef<number | null>(null);

	// Scroll data
	const sections = Object.entries(FIXED_SECTIONS).map(
		([id, section], index) => ({
			id,
			name: section.name,
			description: section.description,
			image: `/assets/home-${index + 1}.jpg`,
			url: `/${id}`,
			subsections: hasSubsections(section) ? section.subsections : null,
		})
	);

	// Check for mobile device
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Initialize Lenis smooth scroll
	useEffect(() => {
		if (!isMobile && typeof window !== 'undefined') {
			const lenis = new Lenis({
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			});

			lenisRef.current = lenis;

			const raf = (time: number) => {
				lenis.raf(time);
				rafRef.current = requestAnimationFrame(raf);
			};
			rafRef.current = requestAnimationFrame(raf);

			lenis.on('scroll', ScrollTrigger.update);

			return () => {
				if (rafRef.current) {
					cancelAnimationFrame(rafRef.current);
				}
				lenis.destroy();
			};
		}
	}, [isMobile]);

	// Load content data
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
							new Date(b.publishedAt || b.createdAt).getTime() -
							new Date(a.publishedAt || a.createdAt).getTime()
					)
					.slice(0, 3);
				setRecentContents(recent);
			} catch (error) {
				console.error('Failed to load homepage data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			if (lenisRef.current) {
				lenisRef.current.scrollTo(element, { offset: -80 });
			} else {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	};

	if (loading) {
		return (
			<PublicLayout>
				<div className='min-h-screen flex items-center justify-center bg-gray-900'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
						<p className='text-white'>로딩중...</p>
					</div>
				</div>
			</PublicLayout>
		);
	}

	return (
		<PublicLayout>
			{/* Hero Section */}
			<section className='relative flex items-center justify-center overflow-hidden h-screen'>
				{/* Background Image */}
				<div className='absolute inset-0 w-full h-full'>
					<Image
						src='/assets/home-1.jpg'
						alt='김종서 장군'
						fill
						priority
						className='object-cover object-center'
						quality={90}
						sizes='100vw'
					/>
					<div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70'></div>
				</div>

				{/* Hero Content */}
				<div className='relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight'>
						절재 김종서 장군
						<span className='block text-xl sm:text-2xl md:text-4xl lg:text-5xl text-brand-300 mt-2 md:mt-4'>
							金宗瑞 (1383-1453)
						</span>
					</h1>
					<p className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto'>
						조선 전기의 명재상이자 무장
						<br />
						6진 개척을 통한 영토 확장의 주역
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<button
							onClick={() => scrollToSection('about-general-section')}
							className='w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-brand-600 text-white text-base md:text-lg font-semibold rounded-full hover:bg-brand-700 transition-all duration-300 transform hover:scale-105 active:scale-95'
						>
							장군 소개 보기
							<ArrowRightIcon className='ml-2 h-4 md:h-5 w-4 md:w-5' />
						</button>
						<Link
							href='/organization'
							className='w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white text-base md:text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 active:scale-95'
						>
							기념사업회
							<ChevronRightIcon className='ml-2 h-4 md:h-5 w-4 md:w-5' />
						</Link>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div
					className='absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer'
					onClick={() => scrollToSection('about-general-section')}
				>
					<div className='w-5 md:w-6 h-8 md:h-10 border-2 border-white rounded-full flex justify-center'>
						<div className='w-0.5 md:w-1 h-2 md:h-3 bg-white rounded-full mt-1.5 md:mt-2'></div>
					</div>
					<p className='text-white text-xs md:text-sm mt-1 md:mt-2 text-center'>
						스크롤
					</p>
				</div>
			</section>

			{/* Section Cards */}
			<div className='bg-gray-50'>
				{sections.map((section, index) => (
					<MobileOptimizedSection
						key={section.id}
						{...section}
						index={index}
						isReversed={index % 2 === 1}
						subsections={section.subsections || undefined}
					/>
				))}
			</div>

			{/* Recent News Section */}
			{recentContents.length > 0 && (
				<section className='py-12 md:py-20 bg-gray-900 text-white'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center mb-12 md:mb-16'>
							<span className='inline-block px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-full mb-4'>
								최신 소식
							</span>
							<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6'>
								기념사업회 소식
							</h2>
							<p className='text-lg md:text-xl text-gray-300 max-w-2xl mx-auto'>
								김종서장군기념사업회의 최근 활동과 소식을 전해드립니다.
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
							{recentContents.map((content) => (
								<Link
									key={content.id}
									href={`/content/${content.id}`}
									className='group bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 active:scale-[0.98]'
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
												{new Date(content.createdAt).toLocaleDateString(
													'ko-KR'
												)}
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
								className='inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-brand-600 text-brand-400 font-semibold rounded-full hover:bg-brand-600 hover:text-white transition-all duration-300 active:scale-[0.98]'
							>
								더 많은 소식 보기
								<ChevronRightIcon className='ml-2 h-5 w-5' />
							</Link>
						</div>
					</div>
				</section>
			)}
		</PublicLayout>
	);
}
