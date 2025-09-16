// src/components/public/menu-page-layout.tsx
'use client';

import { Menu, Content } from '@/types';
import Breadcrumbs from './breadcrumbs';
import SubMenuSection from './sub-menu-section';
import ContentGrid from './content-grid';
import PageHeader from './page-header';

interface MenuPageLayoutProps {
	menu: Menu;
	contents: Content[];
	allMenus: Menu[];
	currentPath: string;
}

export default function MenuPageLayout({
	menu,
	contents,
	allMenus,
	currentPath,
}: MenuPageLayoutProps) {
	const pathSegments = currentPath.split('/').filter(Boolean);
	const hasSubMenus = menu.children && menu.children.length > 0;
	const hasContent = contents && contents.length > 0;

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Breadcrumbs */}
			<Breadcrumbs
				pathSegments={pathSegments}
				allMenus={allMenus}
				currentMenu={menu}
			/>

			{/* Page Header */}
			<PageHeader menu={menu} />

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Sub-menus Section */}
				{hasSubMenus && (
					<SubMenuSection
						parentMenu={menu}
						subMenus={menu.children}
						currentPath={currentPath}
					/>
				)}

				{/* Content Section */}
				{hasContent && (
					<div className={hasSubMenus ? 'mt-12' : ''}>
						<ContentGrid contents={contents} menuName={menu.name} />
					</div>
				)}

				{/* Empty State */}
				{!hasSubMenus && !hasContent && (
					<div className='text-center py-16'>
						<div className='max-w-md mx-auto'>
							<svg
								className='mx-auto h-12 w-12 text-gray-400'
								stroke='currentColor'
								fill='none'
								viewBox='0 0 48 48'
							>
								<path
									d='M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m-16-4c1.381 0 2.721-.087 4-.252'
									strokeWidth={2}
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							<h3 className='mt-2 text-lg font-medium text-gray-900'>
								준비 중입니다
							</h3>
							<p className='mt-1 text-gray-500'>
								이 페이지의 내용이 곧 업데이트될 예정입니다.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
