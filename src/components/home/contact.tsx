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
		address: '서울 중구 남대문로7길 29',
		phone: '010-4738-9122',
		email: 'kjsassociation@naver.com',
		postalCode: '04520',
	};

	return (
		<section id='contact-section' className='py-12 md:py-20 bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Section Header */}
				<div className='text-center mb-12 md:mb-16'>
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
								<div className='w-12 h-12 bg-brand-200 rounded-lg flex items-center justify-center'>
									<MapPinIcon className='h-6 w-6 text-brand-700' />
								</div>
							</div>
							<div>
								{/* <h3 className='text-lg font-semibold text-gray-900 mb-2'>
									주소
								</h3> */}
								<p className='text-gray-600 text-sm leading-relaxed'>
									{contactInfo.address}
								</p>
								<p className='text-gray-500 text-xs mt-1'>
									우편번호: {contactInfo.postalCode}
								</p>
							</div>
						</div>
					</div>

					{/* Building Info Card */}
					<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1'>
						<div className='flex items-start gap-4'>
							<div className='flex-shrink-0'>
								<div className='w-12 h-12 bg-brand-400 rounded-lg flex items-center justify-center'>
									<BuildingOfficeIcon className='h-6 w-6 text-brand-900' />
								</div>
							</div>
							<div>
								{/* <h3 className='text-lg font-semibold text-gray-900 mb-2'>
									상세
								</h3> */}
								<p className='text-gray-600 text-sm'>복창빌딩 904호</p>
								<p className='text-gray-500 text-xs mt-1'>9층 (엘리베이터)</p>
							</div>
						</div>
					</div>

					{/* <div className='mt-8 text-center'> */}
						{/* <div className='flex flex-col sm:flex-row gap-4 justify-center'> */}
							<a
								href={`tel:${contactInfo.phone}`}
								className='inline-flex items-center justify-center px-6 py-3 bg-black text-white font-semibold rounded-lg transition-all duration-200 shadow-md active:scale-[0.98]'
							>
								<PhoneIcon className='h-5 w-5 mr-2' />
								전화 문의
							</a>
							<a
								href={`mailto:${contactInfo.email}`}
								className='inline-flex items-center justify-center px-6 py-3 bg-white text-black border-black border font-semibold rounded-lg transition-all duration-200 shadow-md active:scale-[0.98]'
							>
								<EnvelopeIcon className='h-5 w-5 mr-2' />
								이메일 문의
							</a>
						{/* </div> */}
					{/* </div> */}
				</div>

				{/* Map Section */}
				<div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
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
				</div>
			</div>
		</section>
	);
}
