// src/app/not-found.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Menu } from '@/types';
import PublicLayout from '@/components/layout/public-layout';

export default function NotFound() {
	const [menus, setMenus] = useState<Menu[]>([]);

	useEffect(() => {
		const loadMenus = async () => {
			try {
				const menusData = await api.getMenuTree();
				setMenus(menusData);
			} catch (error) {
				console.error('Failed to load menus:', error);
			}
		};

		loadMenus();
	}, []);

	return (
		<PublicLayout menus={menus}>
			<div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-md w-full text-center'>
					<div className='mb-8'>
						<h1 className='text-9xl font-bold text-brand-600'>404</h1>
						<h2 className='mt-4 text-3xl font-bold text-gray-900'>
							페이지를 찾을 수 없습니다
						</h2>
						<p className='mt-2 text-gray-600'>
							요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
						</p>
					</div>

					<div className='space-y-4'>
						<Link
							href='/'
							className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors'
						>
							홈페이지로 돌아가기
						</Link>

						{menus.length > 0 && (
							<div className='mt-8'>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>
									주요 메뉴
								</h3>
								<div className='grid grid-cols-1 gap-2'>
									{menus.slice(0, 4).map((menu) => (
										<Link
											key={menu.id}
											href={`/${menu.url}`}
											className='text-brand-600 hover:text-brand-700 transition-colors'
										>
											{menu.name}
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</PublicLayout>
	);
}
