// src/components/public/HeroSection.tsx
export default function HeroSection() {
	return (
		<section className='relative bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
			<div className='absolute inset-0 bg-black/20'></div>
			<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
				<div className='text-center'>
					<span className='inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6'>
						소개
					</span>
					<h1 className='text-4xl md:text-6xl font-bold mb-6'>
						절재 김종서 장군
					</h1>
					<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto'>
						조선 초기의 명재상이자 무장인 김종서(1383–1453) 장군의 생애와 업적,
						역사적 의의를 소개합니다.
					</p>
				</div>
			</div>
		</section>
	);
}
