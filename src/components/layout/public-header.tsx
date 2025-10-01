// src/components/layout/public-header.tsx - Logo with image
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FIXED_SECTIONS, hasSubsections } from '@/lib/content-manager';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function PublicHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();
	const isHomePage = pathname === '/';

	// Use fixed sections - safely handle optional subsections
	const sections = Object.entries(FIXED_SECTIONS).map(([id, section]) => ({
		id,
		name: section.name,
		url: `/${id}`,
		subsections: hasSubsections(section)
			? Object.entries(section.subsections).map(([subId, subName]) => ({
					id: subId,
					name: subName,
					url: `/${id}/${subId}`,
				}))
			: [],
	}));

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const headerClasses = `
    fixed top-0 left-0 right-0 z-[9999] transition-all duration-300
    ${
			isScrolled || !isHomePage
				? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
				: 'bg-transparent'
		}
  `;

	const logoClasses = `
    flex items-center gap-3 transition-all duration-300
    ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}
  `;

	const navLinkClasses = `
    px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
    ${
			isScrolled || !isHomePage
				? 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
				: 'text-white/90 hover:text-white hover:bg-white/10'
		}
  `;

	const mobileButtonClasses = `
    p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 transition-colors
    ${
			isScrolled || !isHomePage
				? 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
				: 'text-white/90 hover:text-white hover:bg-white/10'
		}
  `;

	return (
		<>
			<header className={headerClasses}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						{/* Logo */}
						<Link href='/' className={logoClasses}>
							<div className='w-10 h-10 rounded-lg overflow-hidden flex-shrink-0'>
								<Image
									src='/assets/logo.png'
									alt='김종서장군기념사업회 로고'
									width={40}
									height={40}
									className='w-full h-full object-contain'
									priority
								/>
							</div>
							<div className='font-bold'>
								<span className='hidden sm:inline'>김종서장군기념사업회</span>
								<span className='sm:hidden'>기념사업회</span>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<nav className='hidden md:flex space-x-1'>
							{sections.map((section) => (
								<div key={section.id} className='relative group'>
									<Link href={section.url} className={navLinkClasses}>
										{section.name}
									</Link>

									{section.subsections.length > 0 && (
										<div className='absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 z-[10000]'>
											<div className='py-1'>
												{section.subsections.map((subsection) => (
													<Link
														key={subsection.id}
														href={subsection.url}
														className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-600'
													>
														{subsection.name}
													</Link>
												))}
											</div>
										</div>
									)}
								</div>
							))}
						</nav>

						{/* Social Links */}
						<div className='hidden md:flex items-center space-x-2'>
							<a
								href='https://instagram.com'
								target='_blank'
								rel='noopener noreferrer'
								className={`p-2 rounded-full transition-all duration-300 ${
									isScrolled || !isHomePage
										? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
										: 'text-white/70 hover:text-white hover:bg-white/10'
								}`}
								aria-label='인스타그램'
							>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
								</svg>
							</a>
							<a
								href='https://youtube.com'
								target='_blank'
								rel='noopener noreferrer'
								className={`p-2 rounded-full transition-all duration-300 ${
									isScrolled || !isHomePage
										? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
										: 'text-white/70 hover:text-white hover:bg-white/10'
								}`}
								aria-label='유튜브'
							>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
								</svg>
							</a>
						</div>

						{/* Mobile menu button */}
						<div className='md:hidden'>
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className={mobileButtonClasses}
							>
								{isMenuOpen ? (
									<XMarkIcon className='h-6 w-6' />
								) : (
									<Bars3Icon className='h-6 w-6' />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className='md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md'>
						<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
							{sections.map((section) => (
								<div key={section.id}>
									<Link
										href={section.url}
										className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-md'
										onClick={() => setIsMenuOpen(false)}
									>
										{section.name}
									</Link>
									{section.subsections.length > 0 && (
										<div className='pl-4 space-y-1'>
											{section.subsections.map((subsection) => (
												<Link
													key={subsection.id}
													href={subsection.url}
													className='block px-3 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-gray-50 rounded-md'
													onClick={() => setIsMenuOpen(false)}
												>
													{subsection.name}
												</Link>
											))}
										</div>
									)}
								</div>
							))}

							{/* Mobile Social Links */}
							<div className='flex items-center justify-center space-x-4 pt-4 border-t border-gray-200 mt-4'>
								<a
									href='https://instagram.com'
									target='_blank'
									rel='noopener noreferrer'
									className='p-2 text-gray-400 hover:text-gray-600'
									aria-label='인스타그램'
								>
									<svg
										className='w-5 h-5'
										fill='currentColor'
										viewBox='0 0 24 24'
									>
										<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
									</svg>
								</a>
								<a
									href='https://youtube.com'
									target='_blank'
									rel='noopener noreferrer'
									className='p-2 text-gray-400 hover:text-gray-600'
									aria-label='유튜브'
								>
									<svg
										className='w-5 h-5'
										fill='currentColor'
										viewBox='0 0 24 24'
									>
										<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
									</svg>
								</a>
							</div>
						</div>
					</div>
				)}
			</header>

			{/* Spacer for fixed header */}
			{!isHomePage && <div className='h-16'></div>}
		</>
	);
}
