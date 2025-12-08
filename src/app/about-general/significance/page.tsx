// src/app/about-general/significance/page.tsx
'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import PublicLayout from '@/components/layout/public-layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export default function HistoricalSignificancePage() {
	return (
		<PublicLayout>
			{/* Breadcrumbs */}
			<Breadcrumbs
				items={[
					{ name: '절재 김종서 장군', href: '/about-general' },
					{ name: '역사적 의의', href: '/about-general/significance', current: true },
				]}
			/>

			{/* Page Header */}
			<div className='bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='text-center'>
						<h1 className='text-4xl md:text-5xl font-bold mb-4'>
							역사적 의의
						</h1>
						<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed'>
							조선 초기의 명재상이자 무장, 김종서 장군의 역사적 의의
						</p>
					</div>
				</div>
				<div className='h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
			</div>

			{/* Main Content */}
			<div className='bg-gray-50 py-12 md:py-16'>
				<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
						{/* Content Body */}
						<div className='p-8 md:p-12'>

							{/* Section 6: Historical Evaluation */}
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
								href='/about-general/life'
								className='inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all duration-200 shadow-md'
							>
								생애 및 업적 보기
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
