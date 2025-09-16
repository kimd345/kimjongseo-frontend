// src/components/admin/menu-tree.tsx - Simplified version without drag & drop
'use client';

import { useState } from 'react';
import { Menu } from '@/types';
import Button from '@/components/ui/button';
import {
	ChevronRightIcon,
	ChevronDownIcon,
	PencilIcon,
	TrashIcon,
	PlusIcon,
	EyeIcon,
	EyeSlashIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface MenuTreeProps {
	menus: Menu[];
	onEdit: (menu: Menu) => void;
	onDelete: (id: number) => void;
	onToggleStatus: (id: number, isActive: boolean) => void;
	onAddChild: (parentId: number) => void;
}

interface TreeNode extends Menu {
	level: number;
	isExpanded: boolean;
}

export default function MenuTree({
	menus,
	onEdit,
	onDelete,
	onToggleStatus,
	onAddChild,
}: MenuTreeProps) {
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

	// Convert hierarchical menu structure to flat list for display
	const buildFlatTree = (menus: Menu[], level = 0): TreeNode[] => {
		const flatTree: TreeNode[] = [];

		menus
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.forEach((menu) => {
				const isExpanded = expandedItems.has(menu.id);
				flatTree.push({
					...menu,
					level,
					isExpanded,
				});

				if (isExpanded && menu.children && menu.children.length > 0) {
					flatTree.push(...buildFlatTree(menu.children, level + 1));
				}
			});

		return flatTree;
	};

	const flatMenus = buildFlatTree(menus);

	const toggleExpand = (menuId: number) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(menuId)) {
			newExpanded.delete(menuId);
		} else {
			newExpanded.add(menuId);
		}
		setExpandedItems(newExpanded);
	};

	const getIndentStyle = (level: number) => ({
		paddingLeft: `${level * 24 + 16}px`,
	});

	const handleDelete = (menu: Menu) => {
		if (menu.children && menu.children.length > 0) {
			const hasChildren = window.confirm(
				`"${menu.name}" 메뉴에 하위 메뉴가 있습니다. 정말 삭제하시겠습니까? 하위 메뉴도 함께 삭제됩니다.`
			);
			if (!hasChildren) return;
		} else {
			const confirmDelete = window.confirm(
				`"${menu.name}" 메뉴를 삭제하시겠습니까?`
			);
			if (!confirmDelete) return;
		}
		onDelete(menu.id);
	};

	return (
		<div className='bg-white rounded-lg border border-gray-200'>
			<div className='p-4 border-b border-gray-200'>
				<h3 className='text-lg font-medium text-gray-900'>메뉴 구조</h3>
				<p className='text-sm text-gray-500 mt-1'>
					정렬 순서를 변경하려면 메뉴를 수정하여 정렬 순서 값을 변경하세요.
				</p>
			</div>

			{flatMenus.length === 0 ? (
				<div className='p-8 text-center text-gray-500'>
					<p>메뉴가 없습니다.</p>
				</div>
			) : (
				<div className='divide-y divide-gray-100'>
					{flatMenus.map((menu) => (
						<div key={menu.id} className='hover:bg-gray-50 transition-colors'>
							<div
								className='flex items-center py-3'
								style={getIndentStyle(menu.level)}
							>
								{/* Expand/Collapse Button */}
								<button
									onClick={() => toggleExpand(menu.id)}
									className='mr-3 p-1 hover:bg-gray-200 rounded'
									disabled={!menu.children || menu.children.length === 0}
								>
									{menu.children && menu.children.length > 0 ? (
										expandedItems.has(menu.id) ? (
											<ChevronDownIcon className='h-4 w-4 text-gray-600' />
										) : (
											<ChevronRightIcon className='h-4 w-4 text-gray-600' />
										)
									) : (
										<div className='h-4 w-4' />
									)}
								</button>

								{/* Menu Info */}
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-2'>
										<span className='text-xs text-gray-400 font-mono min-w-[2rem]'>
											#{menu.sortOrder}
										</span>
										<h4 className='text-sm font-medium text-gray-900'>
											{menu.name}
										</h4>
										<span className='text-xs text-gray-500'>/{menu.url}</span>
										{!menu.isActive && (
											<span className='inline-flex px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'>
												비활성
											</span>
										)}
										<span
											className={clsx(
												'inline-flex px-2 py-1 text-xs rounded-full',
												menu.type === 'page' && 'bg-blue-100 text-blue-800',
												menu.type === 'section' &&
													'bg-green-100 text-green-800',
												menu.type === 'external' &&
													'bg-purple-100 text-purple-800'
											)}
										>
											{menu.type === 'page' && '페이지'}
											{menu.type === 'section' && '섹션'}
											{menu.type === 'external' && '외부링크'}
										</span>
									</div>
									{menu.description && (
										<p className='text-xs text-gray-600 mt-1 truncate'>
											{menu.description}
										</p>
									)}
								</div>

								{/* Actions */}
								<div className='flex items-center gap-1 ml-4'>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => onToggleStatus(menu.id, !menu.isActive)}
										title={menu.isActive ? '비활성화' : '활성화'}
									>
										{menu.isActive ? (
											<EyeIcon className='h-4 w-4' />
										) : (
											<EyeSlashIcon className='h-4 w-4' />
										)}
									</Button>

									<Button
										variant='ghost'
										size='sm'
										onClick={() => onAddChild(menu.id)}
										title='하위 메뉴 추가'
									>
										<PlusIcon className='h-4 w-4' />
									</Button>

									<Button
										variant='ghost'
										size='sm'
										onClick={() => onEdit(menu)}
										title='수정'
									>
										<PencilIcon className='h-4 w-4' />
									</Button>

									<Button
										variant='ghost'
										size='sm'
										onClick={() => handleDelete(menu)}
										title='삭제'
									>
										<TrashIcon className='h-4 w-4 text-red-500' />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Quick Actions */}
			<div className='p-4 border-t border-gray-200 bg-gray-50'>
				<div className='flex items-center justify-between'>
					<div className='text-sm text-gray-600'>
						총 {menus.length}개의 최상위 메뉴
					</div>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							// Expand all menus
							const allIds = new Set<number>();
							const collectIds = (menuList: Menu[]) => {
								menuList.forEach((menu) => {
									if (menu.children && menu.children.length > 0) {
										allIds.add(menu.id);
										collectIds(menu.children);
									}
								});
							};
							collectIds(menus);
							setExpandedItems(allIds);
						}}
					>
						모두 펼치기
					</Button>
				</div>
			</div>
		</div>
	);
}
