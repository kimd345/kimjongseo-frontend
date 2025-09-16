// src/components/public/menu-section.tsx - Updated to hide inactive menus
import Link from 'next/link';
import { Menu } from '@/types';

interface MenuSectionProps {
	menus: Menu[];
}

export default function MenuSection({ menus }: MenuSectionProps) {
	// Filter only active menus
	const activeMenus = menus.filter((menu) => menu.isActive);

	const getMenuDescription = (menu: Menu) => {
		return menu.description || '자세한 내용을 확인해보세요.';
	};

	if (activeMenus.length === 0) {
		return null;
	}

	return (
		<section className='py-16 bg-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{activeMenus.map((menu) => {
						// Filter active children
						const activeChildren =
							menu.children?.filter((child) => child.isActive) || [];

						return (
							<Link
								key={menu.id}
								href={`/${menu.url}`}
								className='group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-200'
							>
								<div className='text-center'>
									<div className='w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform'>
										{menu.iconImage ? (
											<img
												src={menu.iconImage}
												alt={menu.name}
												className='w-8 h-8 object-contain'
											/>
										) : (
											<span className='text-white text-xl font-bold'>
												{menu.name.charAt(0)}
											</span>
										)}
									</div>
									<h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors'>
										{menu.name}
									</h3>
									<p className='text-sm text-gray-600 leading-relaxed'>
										{getMenuDescription(menu)}
									</p>
									{activeChildren.length > 0 && (
										<div className='mt-4 pt-4 border-t border-gray-100'>
											<div className='text-xs text-gray-500 space-y-1'>
												{activeChildren.slice(0, 3).map((child) => (
													<div key={child.id}>{child.name}</div>
												))}
												{activeChildren.length > 3 && (
													<div>외 {activeChildren.length - 3}개</div>
												)}
											</div>
										</div>
									)}
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
