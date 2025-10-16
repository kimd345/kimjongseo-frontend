// src/components/ui/breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
	name: string;
	href: string;
	current?: boolean;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	className?: string;
}

export default function Breadcrumbs({
	items,
	className = '',
}: BreadcrumbsProps) {
	// Always include home as the first item
	const breadcrumbItems: BreadcrumbItem[] = [
		{ name: '홈', href: '/' },
		...items,
	];

	return (
		<div className={`bg-white border-b border-gray-200 ${className}`}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<nav className='flex py-4' aria-label='Breadcrumb'>
					<ol className='flex items-center space-x-4'>
						{breadcrumbItems.map((item, index) => (
							<li key={item.href}>
								{index === 0 ? (
									// Home icon for first item
									<Link
										href={item.href}
										className='text-gray-400 hover:text-gray-500 transition-colors'
									>
										<HomeIcon className='h-5 w-5' />
										<span className='sr-only'>{item.name}</span>
									</Link>
								) : (
									<div className='flex items-center'>
										<ChevronRightIcon className='h-5 w-5 text-gray-300 mr-4' />
										{item.current || index === breadcrumbItems.length - 1 ? (
											// Current page - not a link
											<span className='text-sm font-medium text-gray-900 truncate max-w-60'>
												{item.name}
											</span>
										) : (
											// Link to parent pages
											<Link
												href={item.href}
												className='text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors truncate max-w-40'
											>
												{item.name}
											</Link>
										)}
									</div>
								)}
							</li>
						))}
					</ol>
				</nav>
			</div>
		</div>
	);
}

// Helper function to generate breadcrumbs from path
export function generateBreadcrumbs(
	pathname: string,
	customNames?: Record<string, string>
): BreadcrumbItem[] {
	const segments = pathname.split('/').filter(Boolean);
	const breadcrumbs: BreadcrumbItem[] = [];

	// Build breadcrumbs from path segments
	segments.forEach((segment, index) => {
		const href = '/' + segments.slice(0, index + 1).join('/');
		const name = customNames?.[segment] || segment;

		breadcrumbs.push({
			name,
			href,
			current: index === segments.length - 1,
		});
	});

	return breadcrumbs;
}
