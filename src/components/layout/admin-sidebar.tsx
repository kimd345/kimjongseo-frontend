// src/components/layout/admin-sidebar.tsx - Simplified for current functionality
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	HomeIcon,
	DocumentTextIcon,
	FolderPlusIcon,
	CogIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
	{ name: '대시보드', href: '/admin', icon: HomeIcon },
	{ name: '게시글 관리', href: '/admin/content', icon: DocumentTextIcon },
	{ name: '새 게시글', href: '/admin/content/new', icon: FolderPlusIcon },
	// Remove deprecated items: menu, files, videos, users
	// { name: '설정', href: '/admin/settings', icon: CogIcon }, // Keep for future
];

export default function AdminSidebar() {
	const pathname = usePathname();

	return (
		<div className='admin-sidebar'>
			<div className='p-6'>
				<h1 className='text-xl font-bold text-white'>관리자 페이지</h1>
				<p className='text-slate-300 text-sm mt-1'>김종서장군기념사업회</p>
			</div>

			<nav className='px-3 pb-6'>
				<ul className='space-y-1'>
					{navigation.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href ||
							(item.href !== '/admin' && pathname.startsWith(item.href));

						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={clsx(
										'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
										isActive
											? 'bg-blue-600 text-white'
											: 'text-slate-300 hover:text-white hover:bg-slate-700'
									)}
								>
									<Icon className='h-5 w-5' />
									{item.name}
								</Link>
							</li>
						);
					})}
				</ul>

				{/* Quick Stats in Sidebar */}
				<div className='mt-8 p-4 bg-slate-800 rounded-lg'>
					<h3 className='text-sm font-medium text-slate-300 mb-2'>빠른 정보</h3>
					<div className='text-xs text-slate-400 space-y-1'>
						<div>• 파일기반 콘텐츠 관리</div>
						<div>• JWT 기반 인증</div>
						<div>• Markdown 지원</div>
					</div>
				</div>
			</nav>
		</div>
	);
}
