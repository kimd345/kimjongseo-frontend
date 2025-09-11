// src/app/admin/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import { api } from '@/lib/api';
import { Menu } from '@/types';
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	ChevronRightIcon,
	ChevronDownIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function MenuManagement() {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());

	const loadMenus = async () => {
		try {
			setLoading(true);
			const menuData = await api.getMenuTree();
			setMenus(menuData);
		} catch (error) {
			console.error('Failed to load menus:', error);
			toast.error('메뉴를 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadMenus();
	}, []);

	const handleDelete = async (id: number) => {
		if (!confirm('정말 삭제하시겠습니까?')) return;

		try {
			await api.deleteMenu(id);
			toast.success('메뉴가 삭제되었습니다.');
			loadMenus();
		} catch (error: any) {
			console.error('Failed to delete menu:', error);
			toast.error(error.response?.data?.message || '삭제에 실패했습니다.');
		}
	};

	const toggleExpanded = (menuId: number) => {
		const newExpanded = new Set(expandedMenus);
		if (newExpanded.has(menuId)) {
			newExpanded.delete(menuId);
		} else {
			newExpanded.add(menuId);
		}
		setExpandedMenus(newExpanded);
	};

	const seedDefaultMenus = async () => {
		try {
			await api.seedDefaultMenus();
			toast.success('기본 메뉴 구조가 생성되었습니다.');
			loadMenus();
		} catch (error) {
			console.error('Failed to seed menus:', error);
			toast.error('기본 메뉴 생성에 실패했습니다.');
		}
	};

	const renderMenu = (menu: Menu, level: number = 0) => (
		<div key={menu.id} className={`${level > 0 ? 'ml-8' : ''}`}>
			<div className='flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-2'>
				<div className='flex items-center gap-3'>
					{menu.children.length > 0 && (
						<button
							onClick={() => toggleExpanded(menu.id)}
							className='p-1 hover:bg-gray-100 rounded'
						>
							{expandedMenus.has(menu.id) ? (
								<ChevronDownIcon className='h-4 w-4' />
							) : (
								<ChevronRightIcon className='h-4 w-4' />
							)}
						</button>
					)}
					<div>
						<div className='flex items-center gap-2'>
							<span className='font-medium text-gray-900'>{menu.name}</span>
							<span className='text-sm text-gray-500'>({menu.url})</span>
							{!menu.isActive && (
								<span className='px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'>
									비활성
								</span>
							)}
						</div>
						{menu.description && (
							<p className='text-sm text-gray-600 mt-1'>{menu.description}</p>
						)}
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Button variant='ghost' size='sm'>
						<PencilIcon className='h-4 w-4' />
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => handleDelete(menu.id)}
					>
						<TrashIcon className='h-4 w-4 text-red-500' />
					</Button>
				</div>
			</div>

			{expandedMenus.has(menu.id) &&
				menu.children.map((child) => renderMenu(child, level + 1))}
		</div>
	);

	return (
		<AdminLayout>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>메뉴 관리</h1>
						<p className='mt-1 text-sm text-gray-500'>
							웹사이트 메뉴 구조를 관리합니다
						</p>
					</div>
					<div className='flex gap-2'>
						{menus.length === 0 && (
							<Button variant='outline' onClick={seedDefaultMenus}>
								기본 메뉴 생성
							</Button>
						)}
						<Button>
							<PlusIcon className='h-4 w-4' />새 메뉴
						</Button>
					</div>
				</div>

				{loading ? (
					<div className='text-center py-12'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto'></div>
						<p className='mt-2 text-sm text-gray-500'>로딩중...</p>
					</div>
				) : menus.length === 0 ? (
					<div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
						<p className='text-gray-500 mb-4'>메뉴가 없습니다.</p>
						<Button onClick={seedDefaultMenus}>기본 메뉴 구조 생성</Button>
					</div>
				) : (
					<div className='space-y-4'>
						{menus.map((menu) => renderMenu(menu))}
					</div>
				)}
			</div>
		</AdminLayout>
	);
}
