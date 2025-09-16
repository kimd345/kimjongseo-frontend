// src/components/public/sub-menu-section.tsx
'use client';

import Link from 'next/link';
import { Menu } from '@/types';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface SubMenuSectionProps {
	parentMenu: Menu;
	subMenus: Menu[];
	currentPath: string;
}

export default function SubMenuSection({
	parentMenu,
	subMenus,
	currentPath,
}: SubMenuSectionProps) {
	const activeSubMenus = subMenus
		.filter((menu) => menu.isActive)
		.sort((a, b) => a.sortOrder - b.sortOrder);

	if (activeSubMenus.length === 0) {
		return null;
	}

	return (
		<section className='mb-12'>
			<div className='text-center mb-8'>
				<h2 className='text-2xl font-bold text-gray-900 mb-4'>
					{parentMenu.name} 하위 메뉴
				</h2>
				<div className='w-24 h-1 bg-brand-600 mx-auto'></div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{activeSubMenus.map((subMenu) => {
					const subMenuPath = `/${parentMenu.url}/${subMenu.url}`;
					const isActive = currentPath.includes(subMenu.url);

					return (
						<Link
							key={subMenu.id}
							href={subMenuPath}
							className={`group block bg-white rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${
								isActive
									? 'border-brand-500 shadow-md'
									: 'border-gray-200 hover:border-brand-300'
							}`}
						>
							<div className='flex items-center justify-between mb-4'>
								<h3
									className={`text-lg font-semibold transition-colors ${
										isActive
											? 'text-brand-600'
											: 'text-gray-900 group-hover:text-brand-600'
									}`}
								>
									{subMenu.name}
								</h3>
								<ChevronRightIcon
									className={`h-5 w-5 transition-all duration-200 ${
										isActive
											? 'text-brand-500 transform translate-x-1'
											: 'text-gray-400 group-hover:text-brand-500 group-hover:transform group-hover:translate-x-1'
									}`}
								/>
							</div>

							{subMenu.description && (
								<p className='text-gray-600 text-sm leading-relaxed mb-4'>
									{subMenu.description}
								</p>
							)}

							{subMenu.iconImage && (
								<div className='flex justify-center'>
									<img
										src={subMenu.iconImage}
										alt={subMenu.name}
										className='h-12 w-12 object-contain opacity-60 group-hover:opacity-100 transition-opacity'
									/>
								</div>
							)}

							{/* Sub-menu indicator */}
							{subMenu.children && subMenu.children.length > 0 && (
								<div className='mt-4 pt-4 border-t border-gray-100'>
									<div className='flex items-center text-xs text-gray-500'>
										<span>{subMenu.children.length}개의 하위 항목</span>
									</div>
								</div>
							)}
						</Link>
					);
				})}
			</div>
		</section>
	);
}
