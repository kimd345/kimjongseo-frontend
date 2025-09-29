// src/components/home/contact-section.tsx
'use client';

import { useState } from 'react';
import {
	MapPinIcon,
	PhoneIcon,
	EnvelopeIcon,
	BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

export default function ContactSection() {
	const [mapLoaded, setMapLoaded] = useState(false);

	const contactInfo = {
		address: '서울 중구 남대문로7길 29 복창빌딩 904호',
		phone: '010-4738-9122',
		email: 'kjsassociation@naver.com',
		postalCode: '04520',
	};

	return (
		<section id='contact-section' className='py-12 md:py-20 bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Section Header */}
				<div className='text-center mb-12 md:mb-16'>
					<span className='inline-block px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-full mb-4'>
						Contact
					</span>
					<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
						연락처 & 오시는 길
					</h2>
					<p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
						김종서장군기념사업회를 찾아주시는 길을 안내해드립니다
					</p>
				</div>

				{/* Contact Cards Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
					{/* Address Card */}
					<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1'>
						<div className='flex items-start gap-4'>
							<div className='flex-shrink-0'>
								<div className='w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center'>
									<MapPinIcon className='h-6 w-6 text-brand-600' />
								</div>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									주소
								</h3>
								<p className='text-gray-600 text-sm leading-relaxed'>
									{contactInfo.address}
								</p>
								<p className='text-gray-500 text-xs mt-1'>
									우편번호: {contactInfo.postalCode}
								</p>
							</div>
						</div>
					</div>

					{/* Phone Card */}
					<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1'>
						<div className='flex items-start gap-4'>
							<div className='flex-shrink-0'>
								<div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
									<PhoneIcon className='h-6 w-6 text-green-600' />
								</div>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									전화번호
								</h3>
								<a
									href={`tel:${contactInfo.phone}`}
									className='text-gray-600 hover:text-brand-600 transition-colors text-sm'
								>
									{contactInfo.phone}
								</a>
								<p className='text-gray-500 text-xs mt-1'>평일 09:00 - 18:00</p>
							</div>
						</div>
					</div>

					{/* Email Card */}
					<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1'>
						<div className='flex items-start gap-4'>
							<div className='flex-shrink-0'>
								<div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
									<EnvelopeIcon className='h-6 w-6 text-purple-600' />
								</div>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									이메일
								</h3>
								<a
									href={`mailto:${contactInfo.email}`}
									className='text-gray-600 hover:text-brand-600 transition-colors text-sm break-all'
								>
									{contactInfo.email}
								</a>
								<p className='text-gray-500 text-xs mt-1'>
									문의사항을 보내주세요
								</p>
							</div>
						</div>
					</div>

					{/* Building Info Card */}
					<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1'>
						<div className='flex items-start gap-4'>
							<div className='flex-shrink-0'>
								<div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
									<BuildingOfficeIcon className='h-6 w-6 text-orange-600' />
								</div>
							</div>
							<div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									위치
								</h3>
								<p className='text-gray-600 text-sm'>복창빌딩 904호</p>
								<p className='text-gray-500 text-xs mt-1'>9층 (엘리베이터)</p>
							</div>
						</div>
					</div>
				</div>

				{/* Map Section */}
				<div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
					<div className='bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4'>
						<h3 className='text-2xl font-bold text-white flex items-center gap-2'>
							<MapPinIcon className='h-6 w-6' />
							오시는 길
						</h3>
					</div>

					{/* Kakao Map Embed */}
					<div className='relative w-full h-[400px] md:h-[500px] bg-gray-100'>
						{!mapLoaded && (
							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='text-center'>
									<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4'></div>
									<p className='text-gray-500'>지도를 불러오는 중...</p>
								</div>
							</div>
						)}
						<iframe
							src='https://map.kakao.com/link/map/서울특별시 중구 남대문로7길 29,37.5638, 126.9802'
							width='100%'
							height='100%'
							style={{ border: 0 }}
							allowFullScreen
							loading='lazy'
							referrerPolicy='no-referrer-when-downgrade'
							onLoad={() => setMapLoaded(true)}
							title='김종서장군기념사업회 위치 - 복창빌딩'
						></iframe>
					</div>

					{/* Transportation Guide - Compact for Home Page */}
					<div className='p-6 md:p-8 bg-gray-50 border-t border-gray-200'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{/* Subway */}
							<div className='bg-white rounded-lg p-5 border border-gray-200'>
								<div className='flex items-center gap-2 mb-3'>
									<div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
										<span className='text-white text-sm font-bold'>M</span>
									</div>
									<h4 className='text-base font-semibold text-gray-900'>
										지하철
									</h4>
								</div>
								<ul className='space-y-2 text-gray-600 text-sm'>
									<li className='flex items-start gap-2'>
										<span className='inline-block w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0'></span>
										<span>2호선 을지로입구역 7번 출구 (도보 3분)</span>
									</li>
									<li className='flex items-start gap-2'>
										<span className='inline-block w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0'></span>
										<span>1/2호선 시청역 7번 출구 (도보 4분)</span>
									</li>
									<li className='flex items-start gap-2'>
										<span className='inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0'></span>
										<span>4호선 회현역 7번 출구 (도보 8분)</span>
									</li>
								</ul>
							</div>

							{/* Bus */}
							<div className='bg-white rounded-lg p-5 border border-gray-200'>
								<div className='flex items-center gap-2 mb-3'>
									<div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center'>
										<span className='text-white text-sm font-bold'>🚌</span>
									</div>
									<h4 className='text-base font-semibold text-gray-900'>
										버스
									</h4>
								</div>
								<ul className='space-y-2 text-gray-600 text-sm'>
									<li className='flex items-start gap-2'>
										<span className='inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0'></span>
										<span>간선: 402, 406, N26</span>
									</li>
									{/* <li className='flex items-start gap-2'>
										<span className='inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0'></span>
										<span>정류장: 남대문경찰서, 회현역</span>
									</li> */}
								</ul>
							</div>

							{/* Landmarks */}
							<div className='bg-white rounded-lg p-5 border border-gray-200'>
								<div className='flex items-center gap-2 mb-3'>
									<div className='w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center'>
										<span className='text-white text-sm font-bold'>📍</span>
									</div>
									<h4 className='text-base font-semibold text-gray-900'>
										주변 안내
									</h4>
								</div>
								<ul className='space-y-2 text-gray-600 text-sm'>
									<li className='flex items-start gap-2'>
										<span className='inline-block w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0'></span>
										<span>남대문시장 도보 5분</span>
									</li>
									<li className='flex items-start gap-2'>
										<span className='inline-block w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0'></span>
										<span>남대문 도보 7분</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Contact CTA - Compact */}
				<div className='mt-8 text-center'>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<a
							href={`tel:${contactInfo.phone}`}
							className='inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all duration-200 shadow-md active:scale-[0.98]'
						>
							<PhoneIcon className='h-5 w-5 mr-2' />
							전화 문의
						</a>
						<a
							href={`mailto:${contactInfo.email}`}
							className='inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-all duration-200 shadow-md active:scale-[0.98]'
						>
							<EnvelopeIcon className='h-5 w-5 mr-2' />
							이메일 문의
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
