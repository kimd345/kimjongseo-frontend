// src/components/public/page-header.tsx
'use client';

import { Menu } from '@/types';

interface PageHeaderProps {
	menu: Menu;
}

export default function PageHeader({ menu }: PageHeaderProps) {
	return (
		<div className='bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='text-center'>
					{menu.iconImage && (
						<div className='flex justify-center mb-6'>
							<img
								src={menu.iconImage}
								alt={menu.name}
								className='h-16 w-16 object-contain'
							/>
						</div>
					)}

					<h1 className='text-4xl md:text-5xl font-bold mb-4'>{menu.name}</h1>

					{menu.description && (
						<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed'>
							{menu.description}
						</p>
					)}
				</div>
			</div>

			{/* Decorative bottom border */}
			<div className='h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
		</div>
	);
}
