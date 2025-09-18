// app/admin/page.tsx - Admin dashboard
'use client';

import { useState, useEffect } from 'react';
import { SimpleAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			const token = SimpleAuth.getToken();
			if (token) {
				const user = await SimpleAuth.verifyToken(token);
				setIsAuthenticated(!!user);
			}
			setLoading(false);
		};
		checkAuth();
	}, []);

	const handleLogout = () => {
		SimpleAuth.removeToken();
		router.push('/admin/login');
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		router.push('/admin/login');
		return null;
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<header className='bg-white shadow'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-4'>
						<h1 className='text-2xl font-bold text-gray-900'>
							관리자 대시보드
						</h1>
						<button
							onClick={handleLogout}
							className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700'
						>
							로그아웃
						</button>
					</div>
				</div>
			</header>

			<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
				<div className='px-4 py-6 sm:px-0'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='bg-white p-6 rounded-lg shadow'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>
								콘텐츠 관리
							</h3>
							<p className='text-gray-600 mb-4'>
								웹사이트의 콘텐츠를 추가, 수정, 삭제할 수 있습니다.
							</p>
							<button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
								콘텐츠 관리
							</button>
						</div>

						<div className='bg-white p-6 rounded-lg shadow'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>
								파일 업로드
							</h3>
							<p className='text-gray-600 mb-4'>
								이미지와 문서를 업로드하고 관리할 수 있습니다.
							</p>
							<button className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700'>
								파일 관리
							</button>
						</div>

						<div className='bg-white p-6 rounded-lg shadow'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>설정</h3>
							<p className='text-gray-600 mb-4'>
								사이트 설정과 관리자 정보를 변경할 수 있습니다.
							</p>
							<button className='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700'>
								설정
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
