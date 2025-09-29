// src/app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ContentItem } from '@/lib/content-manager';
import PublicLayout from '@/components/layout/public-layout';
import EnhancedHeroSection from '@/components/home/hero';
import ContentSections from '@/components/home/content';
import RecentNewsSection from '@/components/home/recent-news';
import ContactSection from '@/components/home/contact';

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

	const scrollToFirstSection = () => {
		scrollToSection('about-general-section');
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
			{/* Enhanced Hero Section with Poem */}
			<EnhancedHeroSection onScrollToNext={scrollToFirstSection} />

			{/* Content Sections */}
			<ContentSections />

			{/* Recent News Section */}
			<RecentNewsSection contents={recentContents} />

			{/* Contact & Location Section - Static Implementation */}
			<ContactSection />
		</PublicLayout>
	);
}
