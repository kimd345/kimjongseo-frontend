// src/components/admin/file-upload.tsx - Standalone file upload component
'use client';

import { useState, useRef } from 'react';
import {
	PhotoIcon,
	DocumentIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/button';
import toast from 'react-hot-toast';

interface FileUploadProps {
	onFileUploaded: (fileUrl: string, fileName: string, isImage: boolean) => void;
	disabled?: boolean;
}

export default function FileUpload({
	onFileUploaded,
	disabled = false,
}: FileUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<
		Array<{
			name: string;
			url: string;
			isImage: boolean;
		}>
	>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		setUploading(true);
		const newUploadedFiles = [];

		try {
			for (const file of Array.from(files)) {
				console.log('Uploading file:', file.name);

				const formData = new FormData();
				formData.append('file', file);

				const token = document.cookie
					.split('; ')
					.find((row) => row.startsWith('auth-token='))
					?.split('=')[1];

				const response = await fetch('/api/upload', {
					method: 'POST',
					headers: token ? { Authorization: `Bearer ${token}` } : {},
					body: formData,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Upload failed: ${response.status} ${errorText}`);
				}

				const result = await response.json();
				console.log('Upload successful:', result);

				const isImage = result.category === 'images';
				newUploadedFiles.push({
					name: result.originalName,
					url: result.url,
					isImage,
				});

				// Call the callback for each uploaded file
				onFileUploaded(result.url, result.originalName, isImage);
			}

			setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
			toast.success(`${files.length}개 파일이 업로드되었습니다.`);
		} catch (error) {
			console.error('Failed to upload files:', error);
			toast.error(`파일 업로드에 실패했습니다: ${error.message}`);
		} finally {
			setUploading(false);
			// Reset the input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const removeFile = (index: number) => {
		setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className='space-y-4'>
			{/* Upload Button */}
			<div className='flex items-center gap-2'>
				<input
					ref={fileInputRef}
					type='file'
					multiple
					accept='image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.md'
					onChange={handleFileChange}
					className='hidden'
				/>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={handleFileSelect}
					disabled={uploading || disabled}
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
				<span className='text-xs text-gray-500'>
					이미지, 문서, 영상 파일을 업로드할 수 있습니다.
				</span>
			</div>

			{/* Uploaded Files List */}
			{uploadedFiles.length > 0 && (
				<div className='border border-gray-200 rounded-md p-4 bg-gray-50'>
					<h4 className='text-sm font-medium text-gray-900 mb-2'>
						업로드된 파일
					</h4>
					<div className='space-y-2'>
						{uploadedFiles.map((file, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-2 bg-white border border-gray-200 rounded'
							>
								<div className='flex items-center gap-2'>
									{file.isImage ? (
										<PhotoIcon className='h-4 w-4 text-green-600' />
									) : (
										<DocumentIcon className='h-4 w-4 text-blue-600' />
									)}
									<span className='text-sm text-gray-700'>{file.name}</span>
									{file.isImage && (
										<img
											src={file.url}
											alt={file.name}
											className='h-8 w-8 object-cover rounded'
										/>
									)}
								</div>
								<button
									onClick={() => removeFile(index)}
									className='text-red-500 hover:text-red-700'
									title='제거'
								>
									<XMarkIcon className='h-4 w-4' />
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
