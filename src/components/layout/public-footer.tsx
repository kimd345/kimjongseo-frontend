// src/components/layout/public-footer.tsx
import Image from 'next/image';

export default function PublicFooter() {
	return (
		<footer className='bg-black text-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Organization Info */}
					<div className='md:col-span-2'>
						<div className='flex items-center gap-3 mb-4'>
							<h3 className='text-lg font-bold'>김종서장군기념사업회</h3>
						</div>
						<p className='text-gray-300 mb-4'>
							절재 김종서 장군의 역사적 의의를 기리고 선양사업을 통해 올바른
							역사 인식을 확산하는 공익법인입니다.
						</p>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className='text-lg font-semibold mb-4'>연락처</h4>
						<div className='space-y-2 text-gray-300'>
							<p>전화: 010-4738-9122</p>
							<p>이메일: kjsassociation@naver.com</p>
							<p>
								재단 찾아오시는 길 주소:
								<br />
								서울 중구 남대문로7길 29 복창빌딩 904호
							</p>
						</div>
					</div>

					{/* External Links & Social */}
					<div>
						<h4 className='text-lg font-semibold mb-4'>관련 기관</h4>
						<div className='space-y-4 mb-6'>
							<a
								href='https://www.mcst.go.kr'
								target='_blank'
								rel='noopener noreferrer'
								className='block group'
							>
								{/* Logo container with white background and subtle styling */}
								<div className='inline-block bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105'>
									<Image
										src='/assets/문화체육관광부.jpg'
										alt='문화체육관광부'
										width={160}
										height={48}
										className='object-contain h-10 w-auto'
									/>
								</div>
								<p className='text-xs text-gray-400 mt-2 group-hover:text-gray-300 transition-colors'>
									문화체육관광부 바로가기
								</p>
							</a>
						</div>

						<div className='flex space-x-4'>
							<a
								href='https://instagram.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-gray-400 hover:text-white transition-colors'
								aria-label='인스타그램'
							>
								<svg
									className='w-6 h-6'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
								</svg>
							</a>
							<a
								href='https://youtube.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-gray-400 hover:text-white transition-colors'
								aria-label='유튜브'
							>
								<svg
									className='w-6 h-6'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
								</svg>
							</a>
						</div>
					</div>
				</div>

				<div className='border-t border-gray-800 mt-8 pt-8'>
					{/* Main footer info */}
					<div className='text-center text-gray-400 space-y-2'>
						<p>
							&copy; {new Date().getFullYear()} 김종서장군기념사업회. All rights
							reserved.
						</p>
						<p>기념사업회 대표자: 김진연 | 고유번호: 603-82-13329</p>
					</div>

					{/* Developer Credit - Modern & Traditional */}
					<div className='mt-6 pt-6 border-t border-gray-800/50'>
						<div className='flex flex-col sm:flex-row items-center justify-center gap-1 text-xs text-gray-500'>
							{/* <span className='font-medium'>Made in 🇰🇷 by</span> */}
							<span className='font-medium'>Site by</span>
							<div className='flex items-center gap-1'>
								<span className='text-gray-500'>Dong Hyuk Kim</span>
								{/* <span className='text-gray-600'>·</span> */}
								{/* <span className='text-gray-400'>김동혁</span> */}
								{/* <span className='text-gray-600'>·</span> */}
								{/* <span className='font-korean text-gray-500'>金東赫</span> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
