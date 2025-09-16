// src/components/admin/menu-form.tsx - Fixed version with proper pre-population
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Menu } from '@/types';
import Button from '@/components/ui/button';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MenuFormData {
	name: string;
	url: string;
	description?: string;
	parentId?: number | null;
	type: string;
	isActive: boolean;
	sortOrder: number;
	iconImage?: string;
	cssClass?: string;
}

interface MenuFormProps {
	initialMenu?: Menu;
	parentOptions: Menu[];
	onSubmit: (data: MenuFormData) => Promise<void>;
	onCancel: () => void;
	isOpen: boolean;
	preselectedParentId?: number; // Add this for when adding child menus
}

export default function MenuForm({
	initialMenu,
	parentOptions,
	onSubmit,
	onCancel,
	isOpen,
	preselectedParentId,
}: MenuFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [urlPreview, setUrlPreview] = useState('');

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<MenuFormData>();

	// Set initial values when form opens
	useEffect(() => {
		if (isOpen) {
			const defaultValues = {
				name: initialMenu?.name || '',
				url: initialMenu?.url || '',
				description: initialMenu?.description || '',
				parentId: preselectedParentId || initialMenu?.parentId || null,
				type: initialMenu?.type || 'page',
				isActive: initialMenu?.isActive ?? true,
				sortOrder: initialMenu?.sortOrder || 1,
				iconImage: initialMenu?.iconImage || '',
				cssClass: initialMenu?.cssClass || '',
			};

			// Reset form with new values
			reset(defaultValues);
		}
	}, [isOpen, initialMenu, preselectedParentId, reset]);

	const watchedName = watch('name');
	const watchedParentId = watch('parentId');

	// Auto-generate URL from name (only for new menus)
	useEffect(() => {
		if (!initialMenu && watchedName) {
			const generatedUrl = watchedName
				.toLowerCase()
				.replace(/[^a-z0-9가-힣]/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '');
			setValue('url', generatedUrl);
		}
	}, [watchedName, setValue, initialMenu]);

	// Update URL preview
	useEffect(() => {
		const currentUrl = watch('url');
		const parentMenu = parentOptions.find((p) => p.id === watchedParentId);

		if (parentMenu) {
			setUrlPreview(`/${parentMenu.url}/${currentUrl}`);
		} else {
			setUrlPreview(`/${currentUrl}`);
		}
	}, [watch('url'), watchedParentId, parentOptions, watch]);

	const onFormSubmit = async (data: MenuFormData) => {
		setIsSubmitting(true);
		try {
			await onSubmit(data);
			reset();
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		reset();
		onCancel();
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 overflow-y-auto'>
			<div className='flex min-h-screen items-center justify-center p-4'>
				{/* Backdrop */}
				<div
					className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
					onClick={handleCancel}
				/>

				{/* Modal */}
				<div className='relative w-full max-w-2xl bg-white rounded-lg shadow-xl'>
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h2 className='text-lg font-medium text-gray-900'>
							{initialMenu ? '메뉴 수정' : '새 메뉴 추가'}
						</h2>
						<button
							onClick={handleCancel}
							className='p-2 hover:bg-gray-100 rounded-md transition-colors'
						>
							<XMarkIcon className='h-5 w-5' />
						</button>
					</div>

					<form onSubmit={handleSubmit(onFormSubmit)} className='p-6 space-y-6'>
						{/* Basic Information */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									메뉴명 *
								</label>
								<input
									{...register('name', { required: '메뉴명을 입력해주세요.' })}
									type='text'
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
									placeholder='메뉴 이름을 입력하세요'
								/>
								{errors.name && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.name.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									URL *
								</label>
								<input
									{...register('url', {
										required: 'URL을 입력해주세요.',
										pattern: {
											value: /^[a-z0-9가-힣-]+$/,
											message: '영문, 숫자, 한글, 하이픈만 사용 가능합니다.',
										},
									})}
									type='text'
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
									placeholder='url-slug'
								/>
								{urlPreview && (
									<p className='mt-1 text-xs text-gray-500'>
										미리보기: <span className='font-mono'>{urlPreview}</span>
									</p>
								)}
								{errors.url && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.url.message}
									</p>
								)}
							</div>
						</div>

						{/* Description */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								설명
							</label>
							<textarea
								{...register('description')}
								rows={3}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
								placeholder='메뉴에 대한 설명을 입력하세요 (선택사항)'
							/>
						</div>

						{/* Parent Menu and Type */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									상위 메뉴
								</label>
								<select
									{...register('parentId', {
										setValueAs: (value) => {
											console.log(
												'Select value:',
												value,
												'Type:',
												typeof value
											); // Debug log
											if (value === '' || value === 'null' || value === null) {
												return null; // Explicitly set to null for top-level
											}
											return Number(value);
										},
									})}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
								>
									<option value=''>최상위 메뉴</option>
									{parentOptions
										.filter((menu) => menu.id !== initialMenu?.id) // Prevent self-selection
										.map((menu) => (
											<option key={menu.id} value={menu.id}>
												{menu.name}
											</option>
										))}
								</select>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									메뉴 타입
								</label>
								<select
									{...register('type')}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
								>
									<option value='page'>페이지</option>
									<option value='section'>섹션</option>
									<option value='external'>외부 링크</option>
								</select>
							</div>
						</div>

						{/* Sort Order and Status */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									정렬 순서
								</label>
								<input
									{...register('sortOrder', {
										setValueAs: (value) => Number(value),
										min: { value: 1, message: '1 이상의 숫자를 입력해주세요.' },
									})}
									type='number'
									min='1'
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
								/>
								{errors.sortOrder && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.sortOrder.message}
									</p>
								)}
							</div>

							<div className='flex items-center pt-8'>
								<input
									{...register('isActive')}
									type='checkbox'
									id='isActive'
									className='h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500'
								/>
								<label
									htmlFor='isActive'
									className='ml-2 text-sm text-gray-700'
								>
									메뉴 활성화
								</label>
							</div>
						</div>

						{/* Advanced Options */}
						<div className='border-t border-gray-200 pt-6'>
							<h3 className='text-sm font-medium text-gray-900 mb-4'>
								고급 옵션
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										아이콘 이미지 URL
									</label>
									<input
										{...register('iconImage')}
										type='url'
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
										placeholder='https://example.com/icon.png'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										CSS 클래스
									</label>
									<input
										{...register('cssClass')}
										type='text'
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
										placeholder='custom-class-name'
									/>
								</div>
							</div>
						</div>

						{/* Form Actions */}
						<div className='flex items-center justify-end gap-3 pt-6 border-t border-gray-200'>
							<Button
								type='button'
								variant='outline'
								onClick={handleCancel}
								disabled={isSubmitting}
							>
								취소
							</Button>
							<Button
								type='submit'
								loading={isSubmitting}
								disabled={isSubmitting}
							>
								{initialMenu ? '수정' : '생성'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
