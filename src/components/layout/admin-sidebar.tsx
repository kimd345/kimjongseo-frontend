// src/components/layout/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	HomeIcon,
	DocumentTextIcon,
	FolderIcon,
	PhotoIcon,
	Bars3Icon,
	CogIcon,
	UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
	{ name: '대시보드', href: '/admin', icon: HomeIcon },
	{ name: '메뉴 관리', href: '/admin/menu', icon: Bars3Icon },
	{ name: '게시글 관리', href: '/admin/content', icon: DocumentTextIcon },
	{ name: '파일 관리', href: '/admin/files', icon: FolderIcon },
	{ name: '영상 관리', href: '/admin/videos', icon: PhotoIcon },
	{ name: '사용자 관리', href: '/admin/users', icon: UsersIcon },
	{ name: '설정', href: '/admin/settings', icon: CogIcon },
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
			</nav>
		</div>
	);
}
