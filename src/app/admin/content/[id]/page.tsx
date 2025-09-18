// src/app/admin/content/[id]/page.tsx - Fixed edit page
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';
import ContentEditor from '@/components/admin/content-editor';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function EditContent() {
	const params = useParams();
	const contentId = params.id as string;
	const [content, setContent] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadContent = async () => {
			try {
				console.log('Loading content for edit, ID:', contentId);
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/content/${contentId}`);

				if (response.ok) {
					const contentData = await response.json();
					console.log('Loaded content for edit:', contentData);
					setContent(contentData);
				} else {
					console.error('Failed to load content:', response.status);
					setError('게시글을 찾을 수 없습니다.');
				}
			} catch (error) {
				console.error('Failed to load content:', error);
				setError('게시글을 로드하는 중 오류가 발생했습니다.');
			} finally {
				setLoading(false);
			}
		};

		if (contentId) {
			loadContent();
		}
	}, [contentId]);

	if (loading) {
		return (
			<AdminLayout>
				<div className='flex items-center justify-center py-12'>
					<div className='text-center'>
						<LoadingSpinner size='lg' />
						<p className='mt-4 text-gray-600'>게시글을 불러오는 중...</p>
					</div>
				</div>
			</AdminLayout>
		);
	}

	if (error) {
		return (
			<AdminLayout>
				<div className='text-center py-12'>
					<p className='text-red-500'>{error}</p>
					<button
						onClick={() => window.history.back()}
						className='mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
					>
						돌아가기
					</button>
				</div>
			</AdminLayout>
		);
	}

	if (!content) {
		return (
			<AdminLayout>
				<div className='text-center py-12'>
					<p className='text-gray-500'>게시글을 찾을 수 없습니다.</p>
					<button
						onClick={() => window.history.back()}
						className='mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
					>
						돌아가기
					</button>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className='max-w-4xl'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-gray-900'>게시글 수정</h1>
					<p className='mt-1 text-sm text-gray-500'>{content.title}</p>
				</div>
				<ContentEditor initialContent={content} />
			</div>
		</AdminLayout>
	);
}
