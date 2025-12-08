// src/app/organization/chairman/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import PublicLayout from '@/components/layout/public-layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export default function ChairmanMessagePage() {
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<PublicLayout>
			{/* Breadcrumbs */}
			<Breadcrumbs
				items={[
					{ name: '기념사업회', href: '/organization' },
					{
						name: '회장 인사말',
						href: '/organization/chairman',
						current: true,
					},
				]}
			/>

			{/* Page Header */}
			<div className='bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='text-center'>
						<h1 className='text-4xl md:text-5xl font-bold mb-4'>회장 인사말</h1>
						<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed'>
							김종서장군기념사업회 이사장의 환영 인사말씀
						</p>
					</div>
				</div>
				<div className='h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
			</div>

			{/* Main Content */}
			<div className='bg-gray-50 py-12 md:py-16'>
				<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
						{/* Chairman Photo Section */}
						<div className='bg-gradient-to-br from-brand-50 to-white p-8 md:p-12 border-b border-gray-200'>
							<div className='flex flex-col md:flex-row items-center gap-8 md:gap-12'>
								{/* Photo */}
								<div className='flex-shrink-0'>
									<div className='relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white'>
										<Image
											src='/assets/hwejang.jpg'
											alt='김진연 이사장'
											fill
											className={`object-cover transition-all duration-700 ${
												imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
											}`}
											onLoad={() => setImageLoaded(true)}
											priority
										/>
									</div>
								</div>

								{/* Chairman Info */}
								<div className='text-center md:text-left'>
									<div className='inline-block px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-medium mb-3'>
										이사장
									</div>
									<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
										김진연
									</h2>
									<p className='text-lg text-gray-600 mb-4'>金眞淵</p>
									<p className='text-sm text-gray-500'>
										김종서장군기념사업회 이사장
									</p>
								</div>
							</div>
						</div>

						{/* Message Content */}
						<div className='p-8 md:p-12'>
							{/* Opening */}
							<div className='mb-8'>
								<h3 className='text-2xl font-bold text-brand-900 mb-6 pb-3 border-b-2 border-brand-600'>
									환영 인사말씀
								</h3>
							</div>

							{/* Message Body */}
							<div className='prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed'>
								<p className='text-lg font-medium text-gray-900'>
									안녕하세요.
									<br />본 홈페이지를 방문하신 여러분들을 대환영합니다.
								</p>

								<p>저는 김종서 장군 기념사업회 이사장을 맡은 김진연입니다.</p>

								<p>
									본인은 조선 세종때 좌의정 충익공 절재 김종서 장군의
									인품(人稟)과 학문(學問) 그리고 청사에 길이 빛나는 위대한
									업적과 충의대절(忠義大節)을 흠모하여 김종서 장군을
									대조명(大照明) 하고자 문화체육관광부 장관의 승인허가를 얻어 본
									기념사업회를 설립하기에 이르렀습니다.
								</p>

								<p>
									여러분들도 잘 아시는 바와 같이 장군은 세종 때 함길도관찰사로서
									여진족(女眞族)을 토벌, 두만강(豆滿江)변에 6진을 설치 과거
									삼국통일의 댓가로 당나라에 빼앗겼던 영토를 현 대한민국의 북방
									국경인 압록강 두만강 연안까지 국토를 수복하신 그 혁혁한 업적은
									현세에 재조명되야 함이 마땅할 것입니다. 또한 장군은
									고려사(高麗史)와 고려사절요(高麗史節要)를 편찬(編纂)하여
									고려국사(高麗國史)를 바로 세웠고 특히 세종대왕의 빛나는 업적인
									세종실록(世宗實錄)을 편찬하였습니다. 또한 장군은 단종 원년
									계유정변(癸酉政變)에 참화(慘禍)를 입어 충의대절(忠義大節)의
									사표(師表)가 되었습니다.
								</p>

								<p>
									더불어 장군은 어린 나이에 문신으로 출사하셨으나 문무를 고루
									겸비한 분으로 조선시대를 통털어 진정한 충을 보여주신 분이시니
									본인은 이러한 선생의 인품(人稟)과 학문(學問)을 기리고 위대한
									업적과 충의대절(忠義大節)을 대조명(大照明)하는 일에
									헌신(獻身)코자 합니다.
								</p>

								<p>
									저는 이 사업회에 관심가지시는 여러분들과 우리 이사회
									임원분들의 도움과 지원을 받아 김종서 장군을 널리 알리고
									추모(追慕)하여 기리는 일에 성심을 다할 것입니다.
								</p>

								<p className='text-lg font-medium text-gray-900'>
									끝으로 홈페이지를 방문하신 여러분들과 기념사업회 임원들의
									적극적인 협력을 기대하면서 간단한 환영의 인사 말씀에
									가름합니다.
								</p>
							</div>

							{/* Signature */}
							<div className='mt-12 pt-8 border-t border-gray-200'>
								<div className='text-right space-y-2'>
									<p className='text-gray-600'>2025년 9월 29일</p>
									<p className='text-xl font-bold text-brand-900'>
										절재기념사업회 이사장
									</p>
									<p className='text-2xl font-bold text-gray-900'>김진연</p>
								</div>
							</div>

							{/* Decorative seal/stamp effect */}
							<div className='mt-8 flex justify-end'>
								<div className='w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg transform rotate-12'>
									<span className='text-white text-2xl font-bold transform -rotate-12'>
										印
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Call to Action */}
					<div className='mt-12 text-center'>
						<div className='inline-flex flex-col sm:flex-row gap-4'>
							<Link
								href='/organization'
								className='inline-flex items-center px-6 py-3 bg-white border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-all duration-200 shadow-md'
							>
								기념사업회 소개 보기
								<ChevronRightIcon className='ml-2 h-5 w-5' />
							</Link>
							<Link
								href='/organization/projects'
								className='inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all duration-200 shadow-md'
							>
								선양사업 보기
								<ChevronRightIcon className='ml-2 h-5 w-5' />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</PublicLayout>
	);
}
