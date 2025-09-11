// src/components/public/MenuSection.tsx
import Link from 'next/link';
import { Menu } from '@/types';

interface MenuSectionProps {
	menus: Menu[];
}

export default function MenuSection({ menus }: MenuSectionProps) {
	const getMenuDescription = (menuName: string) => {
		switch (menuName) {
			case '절재 김종서 장군':
				return '조선 전기 명재상이자 무장인 김종서 장군의 생애와 업적을 살펴봅니다.';
			case '기념사업회':
				return '김종서 장군을 기리는 기념사업회의 설립목적과 주요 활동을 소개합니다.';
			case '자료실':
				return '김종서 장군과 관련된 학술자료, 보도자료, 사진 등을 제공합니다.';
			case '연락처 & 오시는 길':
				return '기념사업회 사무국 연락처와 찾아오시는 방법을 안내합니다.';
			default:
				return '자세한 내용을 확인해보세요.';
		}
	};

	return (
		<section className='py-16 bg-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{menus.map((menu) => (
						<Link
							key={menu.id}
							href={`/${menu.url}`}
							className='group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-200'
						>
							<div className='text-center'>
								<div className='w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform'>
									<span className='text-white text-xl font-bold'>
										{menu.name.charAt(0)}
									</span>
								</div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors'>
									{menu.name}
								</h3>
								<p className='text-sm text-gray-600 leading-relaxed'>
									{getMenuDescription(menu.name)}
								</p>
								{menu.children.length > 0 && (
									<div className='mt-4 pt-4 border-t border-gray-100'>
										<div className='text-xs text-gray-500 space-y-1'>
											{menu.children.slice(0, 3).map((child) => (
												<div key={child.id}>{child.name}</div>
											))}
											{menu.children.length > 3 && (
												<div>외 {menu.children.length - 3}개</div>
											)}
										</div>
									</div>
								)}
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
