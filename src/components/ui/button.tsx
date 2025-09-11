// src/components/ui/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import LoadingSpinner from './loading-spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
	fullWidth?: boolean;
}

export default function Button({
	children,
	variant = 'primary',
	size = 'md',
	loading = false,
	fullWidth = false,
	className,
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			className={clsx(
				'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
				{
					// Variants
					'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500':
						variant === 'primary',
					'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500':
						variant === 'secondary',
					'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-brand-500':
						variant === 'outline',
					'text-gray-700 hover:bg-gray-100 focus:ring-gray-500':
						variant === 'ghost',
					'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
						variant === 'danger',

					// Sizes
					'px-3 py-2 text-sm': size === 'sm',
					'px-4 py-2 text-sm': size === 'md',
					'px-6 py-3 text-base': size === 'lg',

					// States
					'opacity-50 cursor-not-allowed': disabled || loading,
					'w-full': fullWidth,
				},
				className
			)}
			disabled={disabled || loading}
			{...props}
		>
			{loading && <LoadingSpinner size='sm' />}
			{children}
		</button>
	);
}