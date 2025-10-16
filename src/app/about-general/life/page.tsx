// src/app/about-general/life/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import PublicLayout from '@/components/layout/public-layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export default function LifeAchievementsPage() {
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<PublicLayout>
			{/* Breadcrumbs */}
			<Breadcrumbs
				items={[
					{ name: '절재 김종서 장군', href: '/about-general' },
					{ name: '생애 및 업적', href: '/about-general/life', current: true },
				]}
			/>

			{/* Page Header */}
			<div className='bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='text-center'>
						<h1 className='text-4xl md:text-5xl font-bold mb-4'>
							생애 및 업적
						</h1>
						<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed'>
							조선 초기의 명재상이자 무장, 김종서 장군의 생애와 위대한 업적
						</p>
					</div>
				</div>
				<div className='h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
			</div>

			{/* Main Content */}
			<div className='bg-gray-50 py-12 md:py-16'>
				<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
						{/* Portrait Section */}
						<div className='bg-gradient-to-br from-brand-50 to-white p-8 md:p-12 border-b border-gray-200'>
							<div className='flex flex-col md:flex-row items-center gap-8 md:gap-12'>
								{/* Portrait */}
								<div className='flex-shrink-0'>
									<div className='relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white'>
										<Image
											src='/assets/painting.png'
											alt='김종서 장군 초상화'
											fill
											className={`object-contain transition-all duration-700 ${
												imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
											}`}
											onLoad={() => setImageLoaded(true)}
											priority
										/>
									</div>
								</div>

								{/* Basic Info */}
								<div className='text-center md:text-left'>
									<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
										김종서 金宗瑞
									</h2>
									<div className='text-lg text-gray-600 mb-4'>
										<p className='font-semibold'>절재(節齋)</p>
										<p className='text-brand-700 font-bold'>
											1383년 (고려 우왕 9년) - 1453년 (계유정란)
										</p>
									</div>
									<div className='inline-block px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-medium'>
										문무겸전의 명재상
									</div>
								</div>
							</div>
						</div>

						{/* Content Body */}
						<div className='p-8 md:p-12'>
							{/* Section 1: Early Life and Career */}
							<section className='mb-12'>
								<h3 className='text-2xl font-bold text-brand-900 mb-6 pb-3 border-b-2 border-brand-600'>
									출생과 관직 생활
								</h3>
								<div className='prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed'>
									<p>
										<span className='font-semibold text-brand-800'>
											태종 5년(1405년)
										</span>{' '}
										과거에 급제하여 문신으로 관직에 나아갔으나, 조선 초 무신이라
										불리며 문무를 고루 갖춘 인물로 평가받았습니다.
									</p>

									<div className='bg-brand-50 p-6 rounded-lg border-l-4 border-brand-600 my-6'>
										<p className='font-medium text-gray-900'>
											태종부터 단종까지 4대에 걸쳐 좌의정 등 고위관직을 지내며
											조선 초기 종묘사직을 지킴에 충의를 다하였습니다.
										</p>
									</div>

									<p className='text-gray-600'>
										그러나 수양대군(세조)에게 계유정란 때 역적으로 몰려 죽임을
										당했으며, 그로 인해 장군에 대한 사료는 거의 소실된
										상태입니다.
									</p>
								</div>
							</section>

							{/* Section 2: Six Garrison Achievement */}
							<section className='mb-12'>
								<h3 className='text-2xl font-bold text-brand-900 mb-6 pb-3 border-b-2 border-brand-600'>
									6진 개척의 위업
								</h3>
								<div className='prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed'>
									<p className='text-lg font-semibold text-brand-900'>
										세종 15년, 김종서 장군은 6진을 개척하여 현 대한민국의 북방
										국경선인 압록강과 두만강 연안까지 국토를 확장시킨 위대한
										업적을 남기셨습니다.
									</p>

									<div className='bg-gray-100 p-6 rounded-lg my-6'>
										<p className='text-gray-700 italic'>
											신라는 삼국통일을 이루며 대동강과 원산을 잇는 경계선까지
											국토를 확장했지만, 나당연합의 댓가로 고구려 영토 대부분을
											당나라에게 내주게 되었으나, 김종서 장군은 그 중 압록강
											두만강 유역까지의 땅을 회복하신 것입니다.
										</p>
									</div>

									<p>
										이는 단순한 영토 확장이 아니라, 조선의 국방을 튼튼히 하고
										백성들의 삶의 터전을 넓힌 역사적 위업이었습니다.
									</p>
								</div>
							</section>

							{/* Section 3: Hogiga Poem */}
							<section className='mb-12'>
								<h3 className='text-2xl font-bold text-brand-900 mb-6 pb-3 border-b-2 border-brand-600'>
									호기가(豪氣歌)
								</h3>
								<div className='space-y-6'>
									<p className='text-gray-700 leading-relaxed'>
										국경 성곽에 긴 칼 짚고 서서 지으신{' '}
										<span className='font-bold text-brand-800'>《호기가》</span>
										는 장군의 호방한 기백과 의지를 잘 나타낸 대표적인
										시조입니다.
									</p>

									{/* Poem Display */}
									<div className='bg-gradient-to-br from-brand-900 to-brand-700 text-white p-8 md:p-12 rounded-xl shadow-2xl'>
										<div className='font-chosun text-center space-y-4'>
											<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
												삭풍은 나무 끝에 불고
											</p>
											<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
												명월은 눈 속에 찬데
											</p>
											<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
												만리변성에 일장검 짊고 서서
											</p>
											<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
												긴 파람 흰 한소래에
											</p>
											<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
												거칠 것이 없에라
											</p>
											<div className='mt-8 pt-6 border-t border-brand-400'>
												<p className='text-lg text-brand-200'>- 절재 김종서</p>
											</div>
										</div>
									</div>

									<div className='bg-brand-50 p-6 rounded-lg'>
										<p className='text-sm text-gray-600 italic'>
											이 시조는 북방 국경을 지키는 장군의 굳센 의지와 조국에
											대한 충성심을 장엄하게 표현하고 있습니다. 삭풍과 명월,
											만리변성의 이미지는 장군의 불굴의 정신을 상징합니다.
										</p>
									</div>
								</div>
							</section>

							{/* Section 4: Restoration */}
							<section className='mb-12'>
								<h3 className='text-2xl font-bold text-brand-900 mb-6 pb-3 border-b-2 border-brand-600'>
									신원 복권과 재조명
								</h3>
								<div className='prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<div className='bg-white border-2 border-brand-200 rounded-lg p-6 hover:border-brand-400 transition-colors'>
											<h4 className='text-xl font-bold text-brand-800 mb-3'>
												영조 22년
											</h4>
											<p className='text-gray-700'>
												장군은 사후 약 300년이 지난 영조 22년이 되어서야 신원
												복관의 교지를 받고 복권되었으며, 충절의 상징으로
												재조명되었습니다.
											</p>
										</div>

										<div className='bg-white border-2 border-brand-200 rounded-lg p-6 hover:border-brand-400 transition-colors'>
											<h4 className='text-xl font-bold text-brand-800 mb-3'>
												순조 시대
											</h4>
											<p className='text-gray-700'>
												순조 때에는 장군의 충과 그의 장자 승규의 효를 기리는
												정려각을 하사받았습니다.
											</p>
										</div>
									</div>

									<div className='bg-green-50 p-6 rounded-lg border-l-4 border-green-600 mt-6'>
										<p className='font-medium text-gray-900'>
											역사는 결국 진실을 밝혀냅니다. 김종서 장군의 충절과 업적은
											300년의 시간을 거쳐 다시 빛을 보게 되었으며, 오늘날
											대한민국 국민들에게 귀감이 되고 있습니다.
										</p>
									</div>
								</div>
							</section>

							{/* Section 5: Historical Evaluation */}
							<section className='mb-8'>
								<h3 className='text-2xl font-bold text-brand-900 mb-6 pb-3 border-b-2 border-brand-600'>
									역사적 평가
								</h3>
								<div className='bg-gradient-to-r from-brand-50 to-white p-8 rounded-lg border border-brand-200'>
									<blockquote className='text-lg text-gray-800 leading-relaxed italic'>
										&quot;김종서 장군은 조선 초기를 통틀어 진정한 충을 보여주신
										분으로, 문무를 겸비한 탁월한 군사 전략가로 평가받고 있으며,
										그의 6진 개척은 조선 영토의 확장뿐 아니라, 국방의 기틀을
										마련한 불멸의 업적입니다.&quot;
									</blockquote>
									<p className='mt-4 text-right text-brand-700 font-semibold'>
										- 조선왕조실록
									</p>
								</div>
							</section>

							{/* Timeline Summary */}
							<section className='mt-12 pt-8 border-t border-gray-200'>
								<h3 className='text-xl font-bold text-gray-900 mb-6'>
									주요 연표
								</h3>
								<div className='space-y-4'>
									<div className='flex gap-4'>
										<div className='flex-shrink-0 w-32 font-bold text-brand-700'>
											1383년
										</div>
										<div className='text-gray-700'>
											고려 우왕 9년, 강원도 회양에서 출생
										</div>
									</div>
									<div className='flex gap-4'>
										<div className='flex-shrink-0 w-32 font-bold text-brand-700'>
											1405년
										</div>
										<div className='text-gray-700'>태종 5년, 과거 급제</div>
									</div>
									<div className='flex gap-4'>
										<div className='flex-shrink-0 w-32 font-bold text-brand-700'>
											1433년
										</div>
										<div className='text-gray-700'>
											세종 15년, 6진 개척 완료
										</div>
									</div>
									<div className='flex gap-4'>
										<div className='flex-shrink-0 w-32 font-bold text-brand-700'>
											1453년
										</div>
										<div className='text-gray-700'>계유정란으로 순절</div>
									</div>
									<div className='flex gap-4'>
										<div className='flex-shrink-0 w-32 font-bold text-brand-700'>
											1746년
										</div>
										<div className='text-gray-700'>영조 22년, 신원 복권</div>
									</div>
								</div>
							</section>
						</div>
					</div>

					{/* Call to Action */}
					<div className='mt-12 text-center'>
						<div className='inline-flex flex-col sm:flex-row gap-4'>
							<Link
								href='/about-general/significance'
								className='inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all duration-200 shadow-md'
							>
								역사적 의의 보기
								<ChevronRightIcon className='ml-2 h-5 w-5' />
							</Link>
							<Link
								href='/library/sources'
								className='inline-flex items-center px-6 py-3 bg-white border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-all duration-200 shadow-md'
							>
								관련 사료 및 연구
								<ChevronRightIcon className='ml-2 h-5 w-5' />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</PublicLayout>
	);
}
