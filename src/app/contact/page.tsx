// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/public-layout';
import {
	HomeIcon,
	ChevronRightIcon,
	MapPinIcon,
	PhoneIcon,
	EnvelopeIcon,
	BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

export default function ContactPage() {
	const [mapLoaded, setMapLoaded] = useState(false);

	const contactInfo = {
		address: '서울 중구 남대문로7길 29 복창빌딩 904호',
		phone: '010-4738-9122',
		email: 'kjsassociation@naver.com',
		postalCode: '04520',
	};

	return (
		<PublicLayout>
			{/* Breadcrumbs */}
			<div className='bg-white border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<nav className='flex py-4' aria-label='Breadcrumb'>
						<ol className='flex items-center space-x-4'>
							<li>
								<Link
									href='/'
									className='text-gray-400 hover:text-gray-500 transition-colors'
								>
									<HomeIcon className='h-5 w-5' />
									<span className='sr-only'>홈</span>
								</Link>
							</li>
							<li>
								<div className='flex items-center'>
									<ChevronRightIcon className='h-5 w-5 text-gray-300 mr-4' />
									<span className='text-sm font-medium text-gray-900'>
										연락처 & 오시는 길
									</span>
								</div>
							</li>
						</ol>
					</nav>
				</div>
			</div>

			{/* Page Header */}
			<div className='bg-gradient-to-r from-brand-900 to-brand-700 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
					<div className='text-center'>
						<h1 className='text-4xl md:text-5xl font-bold mb-4'>
							연락처 & 오시는 길
						</h1>
						<p className='text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto leading-relaxed'>
							김종서장군기념사업회를 찾아주시는 길을 안내해드립니다
						</p>
					</div>
				</div>
				<div className='h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
			</div>

			{/* Main Content */}
			<div className='bg-gray-50 py-12 md:py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{/* Contact Cards Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
						{/* Address Card */}
						<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100'>
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
						<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100'>
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
									<p className='text-gray-500 text-xs mt-1'>
										평일 09:00 - 18:00
									</p>
								</div>
							</div>
						</div>

						{/* Email Card */}
						<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100'>
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
						<div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100'>
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
						<div className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4'>
							<h2 className='text-2xl font-bold text-white flex items-center gap-2'>
								<MapPinIcon className='h-6 w-6' />
								오시는 길
							</h2>
						</div>

						{/* Kakao Map Embed */}
						<div className='relative w-full h-[500px] bg-gray-100'>
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

					{/* Contact CTA */}
					<div className='mt-12 text-center bg-white rounded-2xl shadow-lg p-8 md:p-12'>
						<h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
							문의하기
						</h3>
						<p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
							김종서장군기념사업회에 대한 문의사항이나 방문 예약이 필요하신 경우
							언제든지 연락 주시기 바랍니다.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<a
								href={`tel:${contactInfo.phone}`}
								className='inline-flex items-center justify-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all duration-200 shadow-md'
							>
								<PhoneIcon className='h-5 w-5 mr-2' />
								전화 문의하기
							</a>
							<a
								href={`mailto:${contactInfo.email}`}
								className='inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-all duration-200 shadow-md'
							>
								<EnvelopeIcon className='h-5 w-5 mr-2' />
								이메일 문의하기
							</a>
						</div>
					</div>
				</div>
			</div>
		</PublicLayout>
	);
}
