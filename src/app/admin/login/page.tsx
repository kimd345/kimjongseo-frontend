// 3. UPDATE: src/app/admin/login/page.tsx - Prevent redirect loop on login page
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

	// Only redirect if already authenticated, not if failed auth
	useEffect(() => {
		if (!loading && isAuthenticated) {
			router.push('/admin');
		}
	}, [loading, isAuthenticated, router]);

	const onSubmit = async (data: LoginForm) => {
		setIsSubmitting(true);
		try {
			const success = await login(data.username, data.password);
			if (success) {
				toast.success('로그인되었습니다.');
				// Don't manually redirect - let useEffect handle it
			} else {
				toast.error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
			}
		} catch (error: any) {
			console.error('Login error:', error);
			toast.error('로그인 중 오류가 발생했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show loading while checking current auth status
	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600'></div>
			</div>
		);
	}

	// Don't show login form if already authenticated (will redirect via useEffect)
	if (isAuthenticated) {
		return null;
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
			</div>
		</div>
	);
}
