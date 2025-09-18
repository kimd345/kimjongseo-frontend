// src/app/admin/content/page.tsx - Fixed admin content list with clean previews
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import { api } from '@/lib/api';
import { cleanMarkdownForPreview } from '@/lib/content-utils';
import { FIXED_SECTIONS, hasSubsections } from '@/lib/content-manager';
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	EyeIcon,
	FunnelIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Content {
	id: string;
	title: string;
	content: string;
	section: string;
	type: string;
	status: string;
	category?: string;
	viewCount: number;
	createdAt: string;
	author?: string;
}

export default function ContentManagement() {
	const [contents, setContents] = useState<Content[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<{
		section?: string;
		type?: string;
		status?: string;
		page: number;
	}>({ page: 1 });
	const [total, setTotal] = useState(0);

	const loadContents = async () => {
		try {
			setLoading(true);
			const response = await api.getContents({
				...filter,
				limit: 20,
			});

			// Handle different response formats
			if (response.content) {
				// New format: { content: { section: [items] } }
				const allContents: Content[] = [];
				Object.values(response.content).forEach((sectionContents: any) => {
					if (Array.isArray(sectionContents)) {
						allContents.push(...sectionContents);
					}
				});
				setContents(allContents);
				setTotal(allContents.length);
			} else if (response.data) {
				// Paginated format: { data: [...], total: n }
				setContents(response.data);
				setTotal(response.total);
			} else if (Array.isArray(response)) {
				// Simple array format
				setContents(response);
				setTotal(response.length);
			}
		} catch (error) {
			console.error('Failed to load contents:', error);
			toast.error('게시글을 불러오는데 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadContents();
	}, [filter]);

	const handleDelete = async (id: string) => {
		if (!confirm('정말 삭제하시겠습니까?')) return;

		try {
			await api.deleteContent(id);
			toast.success('게시글이 삭제되었습니다.');
			loadContents();
		} catch (error) {
			console.error('Failed to delete content:', error);
			toast.error('삭제에 실패했습니다.');
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'published':
				return '공개';
			case 'draft':
				return '초안';
			default:
				return status;
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

	const getSectionLabel = (section: string) => {
		const [mainKey, subKey] = section.split('/');
		const mainSection = FIXED_SECTIONS[mainKey];

		if (!mainSection) return section;

		if (subKey && hasSubsections(mainSection)) {
			const subName = mainSection.subsections[subKey];
			return `${mainSection.name} > ${subName}`;
		}

		return mainSection.name;
	};

	// Filter options
	const sectionOptions = Object.entries(FIXED_SECTIONS).flatMap(
		([mainKey, mainSection]) => {
			if (hasSubsections(mainSection)) {
				return Object.entries(mainSection.subsections).map(
					([subKey, subName]) => ({
						value: `${mainKey}/${subKey}`,
						label: `${mainSection.name} > ${subName}`,
					})
				);
			}
			return [
				{
					value: mainKey,
					label: mainSection.name,
				},
			];
		}
	);

	return (
		<AdminLayout>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>게시글 관리</h1>
						<p className='mt-1 text-sm text-gray-500'>
							전체 {total}개의 게시글
						</p>
					</div>
					<Link href='/admin/content/new'>
						<Button>
							<PlusIcon className='h-4 w-4' />새 게시글
						</Button>
					</Link>
				</div>

				{/* Filters */}
				<div className='bg-white p-4 rounded-lg shadow border border-gray-200'>
					<div className='flex items-center gap-4 flex-wrap'>
						<div className='flex items-center gap-2'>
							<FunnelIcon className='h-5 w-5 text-gray-400' />
							<span className='text-sm font-medium text-gray-700'>필터:</span>
						</div>

						<select
							value={filter.section || ''}
							onChange={(e) =>
								setFilter({
									...filter,
									section: e.target.value || undefined,
									page: 1,
								})
							}
							className='rounded-md border-gray-300 text-sm'
						>
							<option value=''>모든 섹션</option>
							{sectionOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>

						<select
							value={filter.type || ''}
							onChange={(e) =>
								setFilter({
									...filter,
									type: e.target.value || undefined,
									page: 1,
								})
							}
							className='rounded-md border-gray-300 text-sm'
						>
							<option value=''>모든 유형</option>
							<option value='article'>일반글</option>
							<option value='announcement'>공지사항</option>
							<option value='press'>보도자료</option>
							<option value='academic'>학술자료</option>
							<option value='video'>영상</option>
						</select>

						<select
							value={filter.status || ''}
							onChange={(e) =>
								setFilter({
									...filter,
									status: e.target.value || undefined,
									page: 1,
								})
							}
							className='rounded-md border-gray-300 text-sm'
						>
							<option value=''>모든 상태</option>
							<option value='published'>공개</option>
							<option value='draft'>초안</option>
						</select>

						{(filter.section || filter.type || filter.status) && (
							<Button
								variant='outline'
								size='sm'
								onClick={() => setFilter({ page: 1 })}
							>
								필터 초기화
							</Button>
						)}
					</div>
				</div>

				{/* Content Table */}
				<div className='bg-white shadow rounded-lg border border-gray-200'>
					{loading ? (
						<div className='p-8 text-center'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto'></div>
							<p className='mt-2 text-sm text-gray-500'>로딩중...</p>
						</div>
					) : contents.length === 0 ? (
						<div className='p-8 text-center'>
							<p className='text-gray-500'>
								{Object.keys(filter).length > 1
									? '조건에 맞는 게시글이 없습니다.'
									: '게시글이 없습니다.'}
							</p>
							<Link href='/admin/content/new' className='mt-4 inline-block'>
								<Button>첫 번째 게시글 작성하기</Button>
							</Link>
						</div>
					) : (
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											제목 & 미리보기
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											섹션
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											유형
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											상태
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											조회수
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											작성일
										</th>
										<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											작업
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{contents.map((content) => (
										<tr key={content.id} className='hover:bg-gray-50'>
											<td className='px-6 py-4'>
												<div>
													<div className='text-sm font-medium text-gray-900 mb-1'>
														{content.title}
													</div>
													{content.category && (
														<div className='text-xs text-brand-600 font-medium mb-1'>
															{content.category}
														</div>
													)}
													<div className='text-xs text-gray-500 line-clamp-2 max-w-md'>
														{cleanMarkdownForPreview(content.content, 120)}
													</div>
												</div>
											</td>
											<td className='px-6 py-4'>
												<div className='text-sm text-gray-900'>
													{getSectionLabel(content.section)}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
													{getTypeLabel(content.type)}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
														content.status === 'published'
															? 'bg-green-100 text-green-800'
															: 'bg-yellow-100 text-yellow-800'
													}`}
												>
													{getStatusLabel(content.status)}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												<div className='flex items-center gap-1'>
													<EyeIcon className='h-4 w-4' />
													{content.viewCount || 0}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{new Date(content.createdAt).toLocaleDateString(
													'ko-KR'
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												<div className='flex items-center justify-end gap-2'>
													<Link href={`/content/${content.id}`} target='_blank'>
														<Button variant='ghost' size='sm' title='미리보기'>
															<EyeIcon className='h-4 w-4' />
														</Button>
													</Link>
													<Link href={`/admin/content/${content.id}`}>
														<Button variant='ghost' size='sm' title='수정'>
															<PencilIcon className='h-4 w-4' />
														</Button>
													</Link>
													<Button
														variant='ghost'
														size='sm'
														onClick={() => handleDelete(content.id)}
														title='삭제'
													>
														<TrashIcon className='h-4 w-4 text-red-500' />
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{/* Simple Statistics */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='bg-white rounded-lg p-4 border border-gray-200'>
						<div className='text-sm text-gray-500'>총 게시글</div>
						<div className='text-2xl font-bold text-gray-900'>{total}</div>
					</div>
					<div className='bg-white rounded-lg p-4 border border-gray-200'>
						<div className='text-sm text-gray-500'>공개 게시글</div>
						<div className='text-2xl font-bold text-green-600'>
							{contents.filter((c) => c.status === 'published').length}
						</div>
					</div>
					<div className='bg-white rounded-lg p-4 border border-gray-200'>
						<div className='text-sm text-gray-500'>초안</div>
						<div className='text-2xl font-bold text-yellow-600'>
							{contents.filter((c) => c.status === 'draft').length}
						</div>
					</div>
					<div className='bg-white rounded-lg p-4 border border-gray-200'>
						<div className='text-sm text-gray-500'>총 조회수</div>
						<div className='text-2xl font-bold text-blue-600'>
							{contents.reduce((sum, c) => sum + (c.viewCount || 0), 0)}
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
