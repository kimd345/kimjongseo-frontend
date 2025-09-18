// 3. UPDATE: src/components/layout/public-layout.tsx - Remove menus prop requirement
'use client';

import { ReactNode } from 'react';
import PublicHeader from './public-header';
import PublicFooter from './public-footer';

interface PublicLayoutProps {
	children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
	return (
		<div className='min-h-screen flex flex-col'>
			<PublicHeader />
			<main className='flex-1'>{children}</main>
			<PublicFooter />
		</div>
	);
}
