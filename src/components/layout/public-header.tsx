// src/components/layout/public-header.tsx - Updated to hide inactive menus
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from '@/types';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface PublicHeaderProps {
	menus: Menu[];
}

export default function PublicHeader({ menus }: PublicHeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Filter only active menus
	const activeMenus = menus.filter((menu) => menu.isActive);

	return (
		<header className='sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo */}
					<Link href='/' className='flex items-center gap-3'>
						<div className='w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center'>
							<span className='text-white text-lg font-bold'>紀</span>
						</div>
						<div className='font-bold text-gray-900'>김종서장군기념사업회</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex space-x-8'>
						{activeMenus.map((menu) => {
							// Filter active children
							const activeChildren =
								menu.children?.filter((child) => child.isActive) || [];

							return (
								<div key={menu.id} className='relative group'>
									<Link
										href={`/${menu.url}`}
										className='text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
									>
										{menu.name}
									</Link>

									{activeChildren.length > 0 && (
										<div className='absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200'>
											<div className='py-1'>
												{activeChildren.map((child) => (
													<Link
														key={child.id}
														href={`/${menu.url}/${child.url}`}
														className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-600'
													>
														{child.name}
													</Link>
												))}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</nav>

					{/* Social Links */}
					<div className='hidden md:flex items-center space-x-2'>
						<a
							href='https://instagram.com'
							target='_blank'
							rel='noopener noreferrer'
							className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
							aria-label='인스타그램'
						>
							📷
						</a>
						<a
							href='https://youtube.com'
							target='_blank'
							rel='noopener noreferrer'
							className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
							aria-label='유튜브'
						>
							▶️
						</a>
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden'>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500'
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
				<div className='md:hidden border-t border-gray-200 bg-white'>
					<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
						{activeMenus.map((menu) => {
							const activeChildren =
								menu.children?.filter((child) => child.isActive) || [];

							return (
								<div key={menu.id}>
									<Link
										href={`/${menu.url}`}
										className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded-md'
										onClick={() => setIsMenuOpen(false)}
									>
										{menu.name}
									</Link>
									{activeChildren.length > 0 && (
										<div className='pl-4'>
											{activeChildren.map((child) => (
												<Link
													key={child.id}
													href={`/${menu.url}/${child.url}`}
													className='block px-3 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-gray-50 rounded-md'
													onClick={() => setIsMenuOpen(false)}
												>
													{child.name}
												</Link>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</header>
	);
}
