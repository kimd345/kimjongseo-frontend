// src/app/admin/content/new/page.tsx
'use client';

import AdminLayout from '@/components/layout/admin-layout';
import ContentEditor from '@/components/admin/content-editor';

export default function NewContent() {
	return (
		<AdminLayout>
			<div className='max-w-4xl'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-gray-900'>새 게시글 작성</h1>
					<p className='mt-1 text-sm text-gray-500'>
						새로운 게시글을 작성합니다.
					</p>
				</div>
				<ContentEditor />
			</div>
		</AdminLayout>
	);
}
