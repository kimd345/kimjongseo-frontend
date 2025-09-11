// src/components/layout/AdminHeader.tsx
'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
	ChevronDownIcon,
	UserIcon,
	CogIcon,
	ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/types';

interface AdminHeaderProps {
	user?: User | null;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
	const { logout } = useAuth();

	return (
		<header className='bg-white border-b border-gray-200 px-6 py-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-lg font-semibold text-gray-900'>
						관리자 대시보드
					</h2>
					<p className='text-sm text-gray-500'>
						{new Date().toLocaleDateString('ko-KR', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long',
						})}
					</p>
				</div>

				{user && (
					<Menu as='div' className='relative'>
						<Menu.Button className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors'>
							<UserIcon className='h-5 w-5' />
							<span>{user.username}</span>
							<ChevronDownIcon className='h-4 w-4' />
						</Menu.Button>

						<Transition
							as={Fragment}
							enter='transition ease-out duration-100'
							enterFrom='transform opacity-0 scale-95'
							enterTo='transform opacity-100 scale-100'
							leave='transition ease-in duration-75'
							leaveFrom='transform opacity-100 scale-100'
							leaveTo='transform opacity-0 scale-95'
						>
							<Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
								<Menu.Item>
									{({ active }) => (
										<button
											className={`${
												active ? 'bg-gray-100' : ''
											} flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700`}
										>
											<CogIcon className='h-4 w-4' />
											설정
										</button>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<button
											onClick={logout}
											className={`${
												active ? 'bg-gray-100' : ''
											} flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700`}
										>
											<ArrowRightOnRectangleIcon className='h-4 w-4' />
											로그아웃
										</button>
									)}
								</Menu.Item>
							</Menu.Items>
						</Transition>
					</Menu>
				)}
			</div>
		</header>
	);
}
