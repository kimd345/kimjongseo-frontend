// src/components/layout/PublicFooter.tsx
export default function PublicFooter() {
	return (
		<footer className='bg-gray-900 text-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Organization Info */}
					<div className='md:col-span-2'>
						<div className='flex items-center gap-3 mb-4'>
							<div className='w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center'>
								<span className='text-white text-lg font-bold'>紀</span>
							</div>
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
							<p>전화: 02-000-0000</p>
							<p>이메일: info@kimjongseo.org</p>
							<p>주소: 서울특별시 ○○구 ○○로 00</p>
						</div>
					</div>

					{/* External Links */}
					<div>
						<h4 className='text-lg font-semibold mb-4'>관련 기관</h4>
						<div className='space-y-2'>
							<a
								href='https://www.mcst.go.kr'
								target='_blank'
								rel='noopener noreferrer'
								className='block text-gray-300 hover:text-white transition-colors'
							>
								문화체육관광부
							</a>
							<div className='flex space-x-4 mt-4'>
								<a
									href='https://instagram.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
								>
									📷
								</a>
								<a
									href='https://youtube.com'
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-400 hover:text-white transition-colors'
								>
									▶️
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
					<p>
						&copy; {new Date().getFullYear()} 김종서장군기념사업회. All rights
						reserved.
					</p>
					<p className='mt-2'>대표자: 성명 | 고유번호: 000-00-00000</p>
				</div>
			</div>
		</footer>
	);
}
