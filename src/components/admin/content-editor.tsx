// src/components/admin/content-editor.tsx - Fixed for simplified architecture
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { FIXED_SECTIONS, hasSubsections } from '@/lib/content-manager';
import Button from '@/components/ui/button';
import { PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import FileUpload from './file-upload';

interface ContentEditorProps {
	initialContent?: any; // Using any for now since we're migrating
}

interface ContentForm {
	title: string;
	content: string;
	section: string;
	type: 'article' | 'announcement' | 'press' | 'academic' | 'video';
	status: 'draft' | 'published';
	category?: string;
	youtubeId?: string;
	youtubeUrls?: string;
	authorName?: string;
}

// Sections that allow content creation
const CONTENT_ENABLED_SECTIONS = [
	'library/press', // 자료실 > 보도자료
	'library/academic', // 자료실 > 학술 자료
	'library/archive', // 자료실 > 사진·영상 아카이브
	'organization/projects', // 기념사업회 > 선양사업
	'organization/announcements', // 기념사업회 > 공지사항
	'about-general/sources', // 절재 김종서 장군 > 관련 사료 및 연구
	'about-general/photos', // 절재 김종서 장군 > 사진·영상 자료
];

export default function ContentEditor({ initialContent }: ContentEditorProps) {
	const router = useRouter();
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
			section: initialContent?.section || '',
			type: initialContent?.type || 'article',
			status: initialContent?.status || 'draft',
			category: initialContent?.category || '',
			youtubeId: initialContent?.youtubeId || '',
			youtubeUrls: Array.isArray(initialContent?.youtubeUrls)
				? initialContent.youtubeUrls.join('\n')
				: initialContent?.youtubeUrls || '',
			authorName: initialContent?.author || initialContent?.authorName || '',
		},
	});

	const watchedType = watch('type');
	const watchedSection = watch('section');

	// Generate section options with proper hierarchy
	const getSectionOptions = () => {
		const options: { value: string; label: string; disabled?: boolean }[] = [];

		Object.entries(FIXED_SECTIONS).forEach(([mainKey, mainSection]) => {
			if (hasSubsections(mainSection)) {
				Object.entries(mainSection.subsections).forEach(([subKey, subName]) => {
					const sectionPath = `${mainKey}/${subKey}`;
					const isEnabled = CONTENT_ENABLED_SECTIONS.includes(sectionPath);
					options.push({
						value: sectionPath,
						label: `${mainSection.name} > ${subName}`,
						disabled: !isEnabled,
					});
				});
			} else {
				// For sections without subsections (like contact)
				options.push({
					value: mainKey,
					label: mainSection.name,
					disabled: true, // Contact page doesn't allow content
				});
			}
		});

		return options;
	};

	const handleFileUploaded = (
		fileUrl: string,
		fileName: string,
		isImage: boolean
	) => {
		const currentContent = watch('content');
		const fileReference = isImage
			? `![${fileName}](${fileUrl})`
			: `[📄 ${fileName}](${fileUrl})`;

		setValue('content', currentContent + '\n\n' + fileReference);
	};

	const onSubmit = async (data: ContentForm) => {
		setSaving(true);
		try {
			// Validate section selection
			if (!CONTENT_ENABLED_SECTIONS.includes(data.section)) {
				toast.error('선택한 섹션에서는 콘텐츠를 생성할 수 없습니다.');
				return;
			}

			// Prepare content data - ensure no double escaping
			const contentData = {
				title: data.title,
				content: data.content, // Keep content as-is, don't escape
				section: data.section,
				type: data.type,
				status: data.status,
				category: data.category || '',
				youtubeId: data.youtubeId || '',
				youtubeUrls: data.youtubeUrls || '',
				authorName: data.authorName || '',
			};

			console.log('Submitting content data:', contentData);

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

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'article':
				return '일반글';
			case 'announcement':
				return '공지사항';
			case 'press':
				return '보도자료';
			case 'academic':
				return '학술자료';
			case 'video':
				return '영상';
			default:
				return type;
		}
	};

	const sectionOptions = getSectionOptions();

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

					{/* Section Selection - Most Important */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							게시 섹션 *
						</label>
						<select
							{...register('section', {
								required: '섹션을 선택해주세요.',
								validate: (value) =>
									CONTENT_ENABLED_SECTIONS.includes(value) ||
									'선택한 섹션에서는 콘텐츠를 생성할 수 없습니다.',
							})}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500'
						>
							<option value=''>섹션을 선택하세요</option>
							{sectionOptions.map((option) => (
								<option
									key={option.value}
									value={option.value}
									disabled={option.disabled}
									className={option.disabled ? 'text-gray-400' : ''}
								>
									{option.label} {option.disabled ? '(콘텐츠 생성 불가)' : ''}
								</option>
							))}
						</select>
						{errors.section && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.section.message}
							</p>
						)}
						<p className='mt-1 text-xs text-gray-500'>
							콘텐츠 생성이 가능한 섹션만 선택할 수 있습니다.
						</p>
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
								<option value='article'>일반글</option>
								<option value='announcement'>공지사항</option>
								<option value='press'>보도자료</option>
								<option value='academic'>학술자료</option>
								<option value='video'>영상</option>
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
								<option value='draft'>초안</option>
								<option value='published'>공개</option>
							</select>
						</div>

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
					</div>

					{/* Author */}
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

					{/* YouTube fields for video content */}
					{watchedType === 'video' && (
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
					</div>
				</div>

				<div className='p-6 space-y-4'>
					{/* File Upload Component */}
					<FileUpload onFileUploaded={handleFileUploaded} disabled={saving} />

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
