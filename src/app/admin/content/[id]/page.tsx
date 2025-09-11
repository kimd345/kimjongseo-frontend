// src/app/admin/content/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';
import ContentEditor from '@/components/admin/content-editor';
import { api } from '@/lib/api';
import { Content } from '@/types';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function EditContent() {
	const params = useParams();
	const contentId = parseInt(params.id as string);
	const [content, setContent] = useState<Content | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadContent = async () => {
			try {
				const contentData = await api.getContent(contentId);
				setContent(contentData);
			} catch (error) {
				console.error('Failed to load content:', error);
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
					<LoadingSpinner size='lg' />
				</div>
			</AdminLayout>
		);
	}

	if (!content) {
		return (
			<AdminLayout>
				<div className='text-center py-12'>
					<p className='text-gray-500'>게시글을 찾을 수 없습니다.</p>
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
