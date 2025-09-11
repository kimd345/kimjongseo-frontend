// src/components/admin/ContentEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Content, ContentType, PublishStatus, Menu } from '@/types';
import Button from '@/components/ui/button';
import {
	PhotoIcon,
	DocumentIcon,
	VideoCameraIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ContentEditorProps {
	initialContent?: Content;
}

interface ContentForm {
	title: string;
	content: string;
	type: ContentType;
	status: PublishStatus;
	category?: string;
	menuId?: number;
	youtubeId?: string;
	youtubeUrls?: string;
	authorName?: string;
}

export default function ContentEditor({ initialContent }: ContentEditorProps) {
	const router = useRouter();
	const [menus, setMenus] = useState<Menu[]>([]);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ContentForm>({
		defaultValues: {
			title: initialContent?.title || '',
			content: initialContent?.content || '',
			type: initialContent?.type || ContentType.ARTICLE,
			status: initialContent?.status || PublishStatus.DRAFT,
			category: initialContent?.category || '',
			menuId: initialContent?.menuId,
			youtubeId: initialContent?.youtubeId || '',
			youtubeUrls: initialContent?.youtubeUrls?.join('\n') || '',
			authorName: initialContent?.authorName || '',
		},
	});

	const watchedType = watch('type');

	useEffect(() => {
		const loadMenus = async () => {
			try {
				const menuData = await api.getMenus();
				setMenus(menuData);
			} catch (error) {
				console.error('Failed to load menus:', error);
			}
		};
		loadMenus();
	}, []);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		setUploading(true);
		try {
			const uploadPromises = Array.from(files).map((file) =>
				api.uploadFile(file, initialContent?.id, 'content')
			);
			const uploadedFiles = await Promise.all(uploadPromises);

			// Insert file references into content
			const fileReferences = uploadedFiles
				.map((file) => {
					if (file.category === 'image') {
						return `![${file.originalName}](${api.getFileUrl(file.id)})`;
					} else {
						return `[${file.originalName}](${api.getDownloadUrl(file.id)})`;
					}
				})
				.join('\n\n');

			const currentContent = watch('content');
			setValue('content', currentContent + '\n\n' + fileReferences);
			toast.success(`${files.length}개 파일이 업로드되었습니다.`);
		} catch (error) {
			console.error('Failed to upload files:', error);
			toast.error('파일 업로드에 실패했습니다.');
		} finally {
			setUploading(false);
		}
	};

	const onSubmit = async (data: ContentForm) => {
		setSaving(true);
		try {
			const contentData = {
				...data,
				youtubeUrls: data.youtubeUrls
					? data.youtubeUrls.split('\n').filter((url) => url.trim())
					: undefined,
			};

			if (initialContent) {
				await api.updateContent(initialContent.id, contentData);
				toast.success('게시글이 수정되었습니다.');
			} else {
				await api.createContent(contentData);
				toast.success('게시글이 생성되었습니다.');
			}

			router.push('/admin/content');
		} catch (error) {
			console.error('Failed to save content:', error);
			toast.error('저장에 실패했습니다.');
		} finally {
			setSaving(false);
		}
	};

	const getTypeLabel = (type: ContentType) => {
		switch (type) {
			case ContentType.ARTICLE:
				return '일반글';
			case ContentType.ANNOUNCEMENT:
				return '공지사항';
			case ContentType.PRESS_RELEASE:
				return '보도자료';
			case ContentType.ACADEMIC_MATERIAL:
				return '학술자료';
			case ContentType.VIDEO:
				return '영상';
			case ContentType.PHOTO_GALLERY:
				return '사진갤러리';
			default:
				return type;
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
			<div className='bg-white shadow rounded-lg border border-gray-200'>
				<div className='px-6 py-4 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>게시글 정보</h2>
				</div>

				<div className='p-6 space-y-6'>
					{/* Title */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							제목 *
						</label>
						<input
							{...register('title', { required: '제목을 입력해주세요.' })}
							type='text'
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
							placeholder='게시글 제목을 입력하세요'
						/>
						{errors.title && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.title.message}
							</p>
						)}
					</div>

					{/* Meta Fields */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								게시글 유형
							</label>
							<select
								{...register('type')}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
							>
								{Object.values(ContentType).map((type) => (
									<option key={type} value={type}>
										{getTypeLabel(type)}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								공개 상태
							</label>
							<select
								{...register('status')}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
							>
								<option value={PublishStatus.DRAFT}>초안</option>
								<option value={PublishStatus.PUBLISHED}>공개</option>
								<option value={PublishStatus.PRIVATE}>비공개</option>
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								메뉴 연결
							</label>
							<select
								{...register('menuId')}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
							>
								<option value=''>메뉴 선택</option>
								{menus.map((menu) => (
									<option key={menu.id} value={menu.id}>
										{menu.parent
											? `${menu.parent.name} > ${menu.name}`
											: menu.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Category and Author */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								카테고리
							</label>
							<input
								{...register('category')}
								type='text'
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
								placeholder='카테고리 (선택사항)'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								작성자
							</label>
							<input
								{...register('authorName')}
								type='text'
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
								placeholder='작성자명 (선택사항)'
							/>
						</div>
					</div>

					{/* YouTube fields for video content */}
					{watchedType === ContentType.VIDEO && (
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									YouTube 비디오 ID
								</label>
								<input
									{...register('youtubeId')}
									type='text'
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
									placeholder='예: dQw4w9WgXcQ'
								/>
								<p className='mt-1 text-xs text-gray-500'>
									YouTube URL에서 v= 뒤의 ID만 입력하세요
								</p>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									YouTube URL 목록
								</label>
								<textarea
									{...register('youtubeUrls')}
									rows={3}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
									placeholder='YouTube URL을 한 줄씩 입력하세요'
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Content Editor */}
			<div className='bg-white shadow rounded-lg border border-gray-200'>
				<div className='px-6 py-4 border-b border-gray-200'>
					<div className='flex items-center justify-between'>
						<h2 className='text-lg font-medium text-gray-900'>본문 내용</h2>
						<div className='flex items-center gap-2'>
							<label className='cursor-pointer'>
								<input
									type='file'
									multiple
									accept='image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx'
									onChange={handleFileUpload}
									className='hidden'
								/>
								<Button
									type='button'
									variant='outline'
									size='sm'
									disabled={uploading}
								>
									{uploading ? (
										<>업로드 중...</>
									) : (
										<>
											<PhotoIcon className='h-4 w-4' />
											파일 업로드
										</>
									)}
								</Button>
							</label>
						</div>
					</div>
				</div>

				<div className='p-6'>
					<textarea
						{...register('content', { required: '내용을 입력해주세요.' })}
						rows={20}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm'
						placeholder='게시글 내용을 입력하세요. Markdown 문법을 사용할 수 있습니다.'
					/>
					{errors.content && (
						<p className='mt-1 text-sm text-red-600'>
							{errors.content.message}
						</p>
					)}
					<p className='mt-2 text-xs text-gray-500'>
						Markdown 문법을 지원합니다. 파일 업로드 시 자동으로 링크가
						삽입됩니다.
					</p>
				</div>
			</div>

			{/* Actions */}
			<div className='flex items-center justify-between'>
				<Button type='button' variant='outline' onClick={() => router.back()}>
					취소
				</Button>

				<div className='flex gap-2'>
					<Button type='submit' loading={saving} disabled={saving}>
						{initialContent ? '수정' : '생성'}
					</Button>
				</div>
			</div>
		</form>
	);
}
