// src/components/public/breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { Menu } from '@/types';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbsProps {
	pathSegments: string[];
	allMenus: Menu[];
	currentMenu: Menu;
}

interface BreadcrumbItem {
	name: string;
	href: string;
	current: boolean;
}

export default function Breadcrumbs({
	pathSegments,
	allMenus,
	// currentMenu,
}: BreadcrumbsProps) {
	const buildBreadcrumbs = (): BreadcrumbItem[] => {
		const breadcrumbs: BreadcrumbItem[] = [
			{
				name: '홈',
				href: '/',
				current: false,
			},
		];

		// Find menu hierarchy
		const findMenuByUrl = (url: string, menus: Menu[]): Menu | null => {
			for (const menu of menus) {
				if (menu.url === url) {
					return menu;
				}
				if (menu.children) {
					const found = findMenuByUrl(url, menu.children);
					if (found) return found;
				}
			}
			return null;
		};

		// Build breadcrumb path
		let currentPath = '';
		pathSegments.forEach((segment, index) => {
			currentPath += (currentPath ? '/' : '') + segment;
			const menu = findMenuByUrl(segment, allMenus);

			if (menu) {
				breadcrumbs.push({
					name: menu.name,
					href: `/${currentPath}`,
					current: index === pathSegments.length - 1,
				});
			}
		});

		return breadcrumbs;
	};

	const breadcrumbs = buildBreadcrumbs();

	return (
		<div className='bg-white border-b border-gray-200'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<nav className='flex py-4' aria-label='Breadcrumb'>
					<ol className='flex items-center space-x-4'>
						{breadcrumbs.map((breadcrumb, index) => (
							<li key={breadcrumb.href}>
								<div className='flex items-center'>
									{index === 0 ? (
										<Link
											href={breadcrumb.href}
											className='text-gray-400 hover:text-gray-500 transition-colors'
										>
											<HomeIcon className='h-5 w-5' />
											<span className='sr-only'>{breadcrumb.name}</span>
										</Link>
									) : (
										<>
											<ChevronRightIcon className='h-5 w-5 text-gray-300 mr-4' />
											{breadcrumb.current ? (
												<span className='text-sm font-medium text-gray-900'>
													{breadcrumb.name}
												</span>
											) : (
												<Link
													href={breadcrumb.href}
													className='text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors'
												>
													{breadcrumb.name}
												</Link>
											)}
										</>
									)}
								</div>
							</li>
						))}
					</ol>
				</nav>
			</div>
		</div>
	);
}
