// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: '김종서장군기념사업회',
	description:
		'절재 김종서 장군의 역사적 의의와 기념사업회의 활동 및 투명경영 정보 제공',
	keywords: '김종서, 절재, 조선, 장군, 기념사업회, 역사',
	authors: [{ name: '김종서장군기념사업회' }],
	viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='ko'>
			<body className={`${inter.className} font-korean`}>{children}</body>
		</html>
	);
}
