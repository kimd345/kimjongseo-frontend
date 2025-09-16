// src/app/[...slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Menu, Content } from '@/types';
import PublicLayout from '@/components/layout/public-layout';
import MenuPageLayout from '@/components/public/menu-page-layout';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface DynamicPageProps {
	params: { slug: string[] };
}

export default function DynamicPage({ params }: DynamicPageProps) {
	const [menu, setMenu] = useState<Menu | null>(null);
	const [allMenus, setAllMenus] = useState<Menu[]>([]);
	const [contents, setContents] = useState<Content[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { slug } = useParams();
	const path = Array.isArray(slug) ? slug.join('/') : slug || '';

	useEffect(() => {
		const loadPageData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Load all menus for navigation
				const menusPromise = api.getMenuTree();

				// Load specific menu for this path
				const menuPromise = api.getMenuByPath(path);

				// Load content for this menu path
				const contentsPromise = api.getContentByMenuPath(path);

				const [menusData, menuData, contentsData] = await Promise.all([
					menusPromise,
					menuPromise,
					contentsPromise,
				]);

				setAllMenus(menusData);
				setMenu(menuData);
				setContents(contentsData);
			} catch (error) {
				console.error('Failed to load page data:', error);
				setError('페이지를 찾을 수 없습니다.');
			} finally {
				setLoading(false);
			}
		};

		if (path) {
			loadPageData();
		}
	}, [path]);

	if (loading) {
		return (
			<PublicLayout>
				<div className='min-h-screen flex items-center justify-center'>
					<LoadingSpinner size='lg' />
				</div>
			</PublicLayout>
		);
	}

	if (error || !menu) {
		notFound();
	}

	return (
		<PublicLayout menus={allMenus}>
			<MenuPageLayout
				menu={menu}
				contents={contents}
				allMenus={allMenus}
				currentPath={path}
			/>
		</PublicLayout>
	);
}
