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
											1383년 (고려 우왕 9년) - 1453년 (단종 원년 계유정란)
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
											고려 우왕 9년(1393년)
										</span>{' '}
										충청도 공주 요당 월곡리에서 삼군 도총제 김수와 성주배씨의
										차남으로 태어남.
									</p>

									<p>
										본관은 순천, 호는 절재, 자는 국경, 시호는 충익공, 벼슬은
										좌의정 이름은 김종서임.
									</p>

									<p>
										<span className='font-semibold text-brand-800'>
											조선 태종 5년(1405년)
										</span>{' '}
										응류 대과에 급제한 문신.
									</p>

									<p>
										태종 15년 상서원 직장, 죽산현감, 병조좌랑을 지냈고, 세종때
										사헌부 집의, 승정원 좌우승지, 이조 우참판, 함길도관찰사,
										형조와 예조판서, 우의정을 역임함.
									</p>

									<p className='text-gray-600'>
										문종과 단종때 좌의정에 오른 조선 초기에 문무를 겸전하고
										뛰어난 인품과 학문, 그릭 청사에 빛나는 업적을 고루 갖춘
										인물로 평가됨.
									</p>
								</div>
							</section>

							{/* Section 2: Six Garrison Achievement */}
							<section className='mb-12'>
								<h3 className='text-2xl font-bold text-brand-900 mb-6 pb-3 border-b-2 border-brand-600'>
									위대한 업적
								</h3>
								<div className='prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed'>
									<p className='text-gray-600'>
										감찰사 시절 강원, 충청, 평안도의 굶주린 백성 구휼로
										경세제민의 정치 구현.
									</p>

									<p className='text-lg font-semibold text-brand-900'>
										6진 개척
									</p>

									<p className='text-gray-600'>
										1433년 한길도관찰사로서 그 지역에 할거하던 여진족을 토벌,
										두만강 유역에 6진을 설치, 지금의 압록 두만강 까지 영토를
										확장함.
									</p>

									<p className='text-lg font-semibold text-brand-900'>
										제승방략 저술과 북방정책 수립
									</p>

									<p>
										육진개척변비책과 제승방략을 저술, 확고한 한반도 북방정책에
										반영. 제승방략에서는 군사의 인사, 정보, 작전, 동원 등을
										망라하였으며 한 군현에 외적 침입 시 이웃 군현 병사의 즉각적
										동원을 통한 국란극복 정책을 적용, 이는 조선 후기 까지 전달
										운영되었음.
									</p>

									<div className='space-y-6'>
										<p className='text-lg font-semibold text-brand-900'>
											호기가(豪氣歌)와 인각화상(麟閣畵像)의 시조
										</p>
										<p className='text-gray-700 leading-relaxed'>
											국경 성곽에 긴 칼 짚고 서서 지으신{' '}
											<span className='font-bold text-brand-800'>
												《호기가》
											</span>
											는 장군의 호방한 기백과 의지를 잘 나타낸 대표적인 시조.
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
													만리변성에 일장검 짚고 서서
												</p>
												<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
													긴 파람 큰 한소리에
												</p>
												<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
													거칠 것이 없어라
												</p>
												<div className='mt-8 pt-6 border-t border-brand-400'>
													<p className='text-lg text-brand-200'>
														- 절재 김종서
													</p>
												</div>
											</div>
										</div>
										<div className='bg-gradient-to-br from-brand-900 to-brand-700 text-white p-8 md:p-12 rounded-xl shadow-2xl'>
											<div className='font-chosun text-center space-y-4'>
												<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
													장백산에 기를 꽂고
												</p>
												<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
													두만강에 말을 씻겨
												</p>
												<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
													썩은 저 선비야 우리 아니 사나이냐
												</p>
												<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
													어떻다 인각화상을
												</p>
												<p className='text-2xl md:text-3xl font-bold leading-relaxed'>
													누가 먼저 하리오
												</p>
												<div className='mt-8 pt-6 border-t border-brand-400'>
													<p className='text-lg text-brand-200'>
														- 절재 김종서
													</p>
												</div>
											</div>
										</div>
										<div className='bg-brand-50 p-6 rounded-lg'>
											<p className='text-sm text-gray-600 italic'>
												이 시조 두편은 단순한 문학작품을 넘어 강렬한 애국심과
												충성심을 나타내는 시문으로 절재 선생의 웅장한 기상과
												불굴의 정신을 상징합니다.
											</p>
										</div>
									</div>

									<p className='text-lg font-semibold text-brand-900'>
										고려사와 고려사절요 쳔찬
									</p>
									<div className='prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed'>
										<p className='text-gray-600'>
											조선 초기 세종의 명으로 4년에 걸쳐 고려사와 고려사절요를
											편찬. 지금까지 고려정사로 전승되고 있음.
										</p>
									</div>
								</div>
							</section>

							{/* Section 3: Restoration */}
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
												장군은 사후 293년이 지난 영조 22년(1746)에 이르러 신원
												복관의 교지를 받고 복권되었으며, 시호를 충익이라 하였고
												영조임금이 몸소 제문을 지어 선생의 묘소에 치제하니
												충의대절의 상징으로 재조명되었다.
											</p>
										</div>

										<div className='bg-white border-2 border-brand-200 rounded-lg p-6 hover:border-brand-400 transition-colors'>
											<h4 className='text-xl font-bold text-brand-800 mb-3'>
												정조, 순조 시대
											</h4>
											<p className='text-gray-700'>
												정조때는 부조전을 내리고 순조 때에는 장군의 장남 김승규의 충효에 대한 정려문인 국가의 은전을 하사하셨다.
											</p>
										</div>
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
								href='/library/academic'
								className='inline-flex items-center px-6 py-3 bg-white border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-all duration-200 shadow-md'
							>
								학술 자료 보기
								<ChevronRightIcon className='ml-2 h-5 w-5' />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</PublicLayout>
	);
}
