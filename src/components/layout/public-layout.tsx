// src/components/layout/PublicLayout.tsx
'use client';

import { ReactNode } from 'react';
import { Menu } from '@/types';
import PublicHeader from './public-header';
import PublicFooter from './public-footer';

interface PublicLayoutProps {
	children: ReactNode;
	menus?: Menu[];
}

export default function PublicLayout({
	children,
	menus = [],
}: PublicLayoutProps) {
	return (
		<div className='min-h-screen flex flex-col'>
			<PublicHeader menus={menus} />
			<main className='flex-1'>{children}</main>
			<PublicFooter />
		</div>
	);
}
