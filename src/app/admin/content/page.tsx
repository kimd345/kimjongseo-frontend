// src/app/admin/content/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layout/admin-layout';
import Button from '@/components/ui/button';
import { api } from '@/lib/api';
import { Content, ContentType, PublishStatus } from '@/types';
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	EyeIcon,
	FunnelIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ContentManagement() {
	const [contents, setContents] = useState<Content[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<{
		type?: ContentType;
		status?: PublishStatus;
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
			setContents(response.data);
			setTotal(response.total);
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

	const handleDelete = async (id: number) => {
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

	const getStatusLabel = (status: PublishStatus) => {
		switch (status) {
			case PublishStatus.PUBLISHED:
				return '공개';
			case PublishStatus.DRAFT:
				return '초안';
			case PublishStatus.PRIVATE:
				return '비공개';
			default:
				return status;
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
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<FunnelIcon className='h-5 w-5 text-gray-400' />
							<span className='text-sm font-medium text-gray-700'>필터:</span>
						</div>

						<select
							value={filter.type || ''}
							onChange={(e) =>
								setFilter({
									...filter,
									type: (e.target.value as ContentType) || undefined,
									page: 1,
								})
							}
							className='rounded-md border-gray-300 text-sm'
						>
							<option value=''>모든 유형</option>
							{Object.values(ContentType).map((type) => (
								<option key={type} value={type}>
									{getTypeLabel(type)}
								</option>
							))}
						</select>

						<select
							value={filter.status || ''}
							onChange={(e) =>
								setFilter({
									...filter,
									status: (e.target.value as PublishStatus) || undefined,
									page: 1,
								})
							}
							className='rounded-md border-gray-300 text-sm'
						>
							<option value=''>모든 상태</option>
							{Object.values(PublishStatus).map((status) => (
								<option key={status} value={status}>
									{getStatusLabel(status)}
								</option>
							))}
						</select>
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
							<p className='text-gray-500'>게시글이 없습니다.</p>
						</div>
					) : (
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											제목
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
												<div className='text-sm font-medium text-gray-900'>
													{content.title}
												</div>
												{content.category && (
													<div className='text-sm text-gray-500'>
														{content.category}
													</div>
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
													{getTypeLabel(content.type)}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
														content.status === PublishStatus.PUBLISHED
															? 'bg-green-100 text-green-800'
															: content.status === PublishStatus.DRAFT
																? 'bg-yellow-100 text-yellow-800'
																: 'bg-gray-100 text-gray-800'
													}`}
												>
													{getStatusLabel(content.status)}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												<div className='flex items-center gap-1'>
													<EyeIcon className='h-4 w-4' />
													{content.viewCount}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{new Date(content.createdAt).toLocaleDateString(
													'ko-KR'
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												<div className='flex items-center justify-end gap-2'>
													<Link href={`/admin/content/${content.id}`}>
														<Button variant='ghost' size='sm'>
															<PencilIcon className='h-4 w-4' />
														</Button>
													</Link>
													<Button
														variant='ghost'
														size='sm'
														onClick={() => handleDelete(content.id)}
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

				{/* Pagination */}
				{total > 20 && (
					<div className='flex items-center justify-between'>
						<div className='text-sm text-gray-700'>
							{(filter.page - 1) * 20 + 1}-{Math.min(filter.page * 20, total)} /
							총 {total}개
						</div>
						<div className='flex gap-2'>
							<Button
								variant='outline'
								size='sm'
								disabled={filter.page === 1}
								onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
							>
								이전
							</Button>
							<Button
								variant='outline'
								size='sm'
								disabled={filter.page * 20 >= total}
								onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
							>
								다음
							</Button>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	);
}
