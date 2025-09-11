// src/app/admin/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import Button from '@/components/ui/button';
import toast from 'react-hot-toast';

interface LoginForm {
	username: string;
	password: string;
}

export default function AdminLogin() {
	const { login, isAuthenticated, loading } = useAuth();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>();

	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.push('/admin');
		}
	}, [loading, isAuthenticated, router]);

	const onSubmit = async (data: LoginForm) => {
		setIsSubmitting(true);
		try {
			await login(data.username, data.password);
			toast.success('로그인되었습니다.');
			router.push('/admin');
		} catch (error: any) {
			console.error('Login error:', error);
			toast.error(error.response?.data?.message || '로그인에 실패했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600'></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<div className='mx-auto h-16 w-16 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center'>
						<span className='text-white text-xl font-bold'>紀</span>
					</div>
					<h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>
						관리자 로그인
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						김종서장군기념사업회 관리자 페이지
					</p>
				</div>

				<form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
					<div className='space-y-4'>
						<div>
							<label
								htmlFor='username'
								className='block text-sm font-medium text-gray-700'
							>
								사용자명
							</label>
							<input
								{...register('username', {
									required: '사용자명을 입력해주세요.',
								})}
								type='text'
								autoComplete='username'
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500'
								placeholder='사용자명을 입력하세요'
							/>
							{errors.username && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.username.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700'
							>
								비밀번호
							</label>
							<input
								{...register('password', {
									required: '비밀번호를 입력해주세요.',
								})}
								type='password'
								autoComplete='current-password'
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500'
								placeholder='비밀번호를 입력하세요'
							/>
							{errors.password && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.password.message}
								</p>
							)}
						</div>
					</div>

					<Button
						type='submit'
						fullWidth
						loading={isSubmitting}
						disabled={isSubmitting}
					>
						로그인
					</Button>
				</form>

				<div className='text-center'>
					<p className='text-xs text-gray-500'>기본 계정: admin / admin123!</p>
				</div>
			</div>
		</div>
	);
}
