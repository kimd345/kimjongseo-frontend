// src/app/admin/menu/page.tsx - Fixed version
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import MenuTree from '@/components/admin/menu-tree';
import MenuForm from '@/components/admin/menu-form';
import Button from '@/components/ui/button';
import { api } from '@/lib/api';
import { Menu } from '@/types';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MenuFormData {
	name: string;
	url: string;
	description?: string;
	parentId?: number;
	type: string;
	isActive: boolean;
	sortOrder: number;
	iconImage?: string;
	cssClass?: string;
}

export default function MenuManagement() {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingMenu, setEditingMenu] = useState<Menu | undefined>();
	const [preselectedParentId, setPreselectedParentId] = useState<
		number | undefined
	>();
	const [parentOptions, setParentOptions] = useState<Menu[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const loadMenus = async () => {
		try {
			setLoading(true);
			const menuData = await api.getMenuTree();
			setMenus(menuData);

			// Build parent options (flat list of all menus)
			const flatMenus = flattenMenus(menuData);
			setParentOptions(flatMenus);
		} catch (error) {
			console.error('Failed to load menus:', error);
			toast.error('메뉴를 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const flattenMenus = (menuList: Menu[]): Menu[] => {
		const flat: Menu[] = [];
		const flatten = (menus: Menu[]) => {
			menus.forEach((menu) => {
				flat.push(menu);
				if (menu.children && menu.children.length > 0) {
					flatten(menu.children);
				}
			});
		};
		flatten(menuList);
		return flat;
	};

	useEffect(() => {
		loadMenus();
	}, []);

	const handleCreateMenu = () => {
		setEditingMenu(undefined);
		setPreselectedParentId(undefined);
		setIsFormOpen(true);
	};

	const handleEditMenu = (menu: Menu) => {
		setEditingMenu(menu);
		setPreselectedParentId(undefined);
		setIsFormOpen(true);
	};

	const handleAddChildMenu = (parentId: number) => {
		setEditingMenu(undefined);
		setPreselectedParentId(parentId);
		setIsFormOpen(true);
	};

	const handleFormSubmit = async (data: MenuFormData) => {
		try {
			if (editingMenu) {
				await api.updateMenu(editingMenu.id, data);
				toast.success('메뉴가 수정되었습니다.');
			} else {
				await api.createMenu(data);
				toast.success('메뉴가 생성되었습니다.');
			}

			setIsFormOpen(false);
			setEditingMenu(undefined);
			setPreselectedParentId(undefined);
			await loadMenus();
		} catch (error: any) {
			console.error('Failed to save menu:', error);
			toast.error(error.response?.data?.message || '메뉴 저장에 실패했습니다.');
			throw error; // Re-throw to prevent form from closing
		}
	};

	const handleDeleteMenu = async (id: number) => {
		try {
			await api.deleteMenu(id);
			toast.success('메뉴가 삭제되었습니다.');
			await loadMenus();
		} catch (error: any) {
			console.error('Failed to delete menu:', error);
			toast.error(error.response?.data?.message || '메뉴 삭제에 실패했습니다.');
		}
	};

	const handleToggleMenuStatus = async (id: number, isActive: boolean) => {
		try {
			await api.updateMenu(id, { isActive });
			toast.success(`메뉴가 ${isActive ? '활성화' : '비활성화'}되었습니다.`);
			await loadMenus();
		} catch (error: any) {
			console.error('Failed to toggle menu status:', error);
			toast.error('메뉴 상태 변경에 실패했습니다.');
		}
	};

	const seedDefaultMenus = async () => {
		try {
			setRefreshing(true);
			await api.seedDefaultMenus();
			toast.success('기본 메뉴 구조가 생성되었습니다.');
			await loadMenus();
		} catch (error: any) {
			console.error('Failed to seed menus:', error);
			toast.error('기본 메뉴 생성에 실패했습니다.');
		} finally {
			setRefreshing(false);
		}
	};

	const refreshMenus = async () => {
		setRefreshing(true);
		await loadMenus();
		setRefreshing(false);
		toast.success('메뉴가 새로고침되었습니다.');
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setEditingMenu(undefined);
		setPreselectedParentId(undefined);
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className='text-center py-12'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto'></div>
					<p className='mt-2 text-sm text-gray-500'>로딩중...</p>
				</div>
			</AdminLayout>
		);
	}

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
						<Button
							variant='outline'
							onClick={refreshMenus}
							loading={refreshing}
							disabled={refreshing}
						>
							<ArrowPathIcon className='h-4 w-4' />
							새로고침
						</Button>
						{menus.length === 0 && (
							<Button
								variant='outline'
								onClick={seedDefaultMenus}
								loading={refreshing}
								disabled={refreshing}
							>
								기본 메뉴 생성
							</Button>
						)}
						<Button onClick={handleCreateMenu}>
							<PlusIcon className='h-4 w-4' />새 메뉴
						</Button>
					</div>
				</div>

				{/* Menu Statistics */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg border border-gray-200'>
						<div className='text-sm font-medium text-gray-500'>총 메뉴</div>
						<div className='text-2xl font-bold text-gray-900'>
							{flattenMenus(menus).length}
						</div>
					</div>
					<div className='bg-white p-4 rounded-lg border border-gray-200'>
						<div className='text-sm font-medium text-gray-500'>최상위 메뉴</div>
						<div className='text-2xl font-bold text-gray-900'>
							{menus.length}
						</div>
					</div>
					<div className='bg-white p-4 rounded-lg border border-gray-200'>
						<div className='text-sm font-medium text-gray-500'>활성 메뉴</div>
						<div className='text-2xl font-bold text-green-600'>
							{flattenMenus(menus).filter((m) => m.isActive).length}
						</div>
					</div>
					<div className='bg-white p-4 rounded-lg border border-gray-200'>
						<div className='text-sm font-medium text-gray-500'>비활성 메뉴</div>
						<div className='text-2xl font-bold text-red-600'>
							{flattenMenus(menus).filter((m) => !m.isActive).length}
						</div>
					</div>
				</div>

				{/* Menu Tree */}
				{menus.length === 0 ? (
					<div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
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
							<h3 className='mt-2 text-sm font-medium text-gray-900'>
								메뉴가 없습니다
							</h3>
							<p className='mt-1 text-sm text-gray-500'>
								새 메뉴를 생성하거나 기본 메뉴 구조를 만들어보세요.
							</p>
							<div className='mt-6 flex justify-center gap-3'>
								<Button onClick={handleCreateMenu}>
									<PlusIcon className='h-4 w-4' />새 메뉴 생성
								</Button>
								<Button
									variant='outline'
									onClick={seedDefaultMenus}
									loading={refreshing}
								>
									기본 메뉴 구조 생성
								</Button>
							</div>
						</div>
					</div>
				) : (
					<MenuTree
						menus={menus}
						onEdit={handleEditMenu}
						onDelete={handleDeleteMenu}
						onToggleStatus={handleToggleMenuStatus}
						onAddChild={handleAddChildMenu}
					/>
				)}

				{/* Menu Form Modal */}
				<MenuForm
					initialMenu={editingMenu}
					parentOptions={parentOptions}
					preselectedParentId={preselectedParentId}
					onSubmit={handleFormSubmit}
					onCancel={handleFormCancel}
					isOpen={isFormOpen}
				/>
			</div>
		</AdminLayout>
	);
}
