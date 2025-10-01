import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface EnhancedHeroSectionProps {
	onScrollToNext: () => void;
}

export default function EnhancedHeroSection({
	onScrollToNext,
}: EnhancedHeroSectionProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [hyoonggapLoaded, setHyoonggapLoaded] = useState(false);
	const heroRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const hyoonggapRef = useRef<HTMLDivElement>(null);
	const poemWrapperRef = useRef<HTMLDivElement>(null);
	const poemStanza1Ref = useRef<HTMLDivElement>(null);
	const poemStanza2Ref = useRef<HTMLDivElement>(null);
	const poemStanza3Ref = useRef<HTMLDivElement>(null);
	const poemStanza4Ref = useRef<HTMLDivElement>(null);
	const poemStanza5Ref = useRef<HTMLDivElement>(null);
	const poemAttributionRef = useRef<HTMLDivElement>(null);
	const scrollIndicatorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!heroRef.current || !contentRef.current || !poemWrapperRef.current)
			return;

		const ctx = gsap.context(() => {
			// Parallax effect for background image
			gsap.to('.hero-background', {
				yPercent: 50,
				ease: 'none',
				scrollTrigger: {
					trigger: heroRef.current,
					start: 'top top',
					end: 'bottom top',
					scrub: true,
				},
			});

			// Fade out main content
			gsap.to(contentRef.current, {
				opacity: 0,
				y: -150,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: heroRef.current,
					start: 'top top',
					end: 'top+=300 top',
					scrub: true,
				},
			});

			// Pin hyoonggap image to stay visible during poem transition
			if (hyoonggapRef.current) {
				ScrollTrigger.create({
					trigger: hyoonggapRef.current,
					start: 'top 50%',
					end: () =>
						`+=${heroRef.current!.offsetHeight - window.innerHeight}`,
					pin: true,
					pinSpacing: false,
				});

				// Subtle fade and scale on scroll
				gsap.to(hyoonggapRef.current, {
					opacity: 0.7,
					scale: 0.95,
					ease: 'none',
					scrollTrigger: {
						trigger: heroRef.current,
						start: 'top+=50% top',
						end: 'bottom top',
						scrub: true,
					},
				});
			}

			// Pin poem wrapper near the top when it enters viewport
			ScrollTrigger.create({
				trigger: poemWrapperRef.current,
				start: 'top 15%',
				end: () =>
					`+=${heroRef.current!.offsetHeight - window.innerHeight * 1.4}`,
				pin: true,
				pinSpacing: false,
			});

			// Animate each stanza sliding down from above with faster timing
			const stanzas = [
				poemStanza1Ref.current,
				poemStanza2Ref.current,
				poemStanza3Ref.current,
				poemStanza4Ref.current,
				poemStanza5Ref.current,
			];

			stanzas.forEach((stanza, index) => {
				if (stanza) {
					ScrollTrigger.create({
						trigger: heroRef.current,
						start: `top+=${25 + index * 5}% top`,
						end: `top+=${32 + index * 5}% top`,
						onEnter: () => {
							gsap.to(stanza, {
								opacity: 1,
								y: 0,
								duration: 0.6,
								ease: 'power3.out',
							});
						},
						onLeaveBack: () => {
							gsap.to(stanza, {
								opacity: 0,
								y: -60,
								duration: 0.4,
								ease: 'power2.in',
							});
						},
					});
				}
			});

			// Animate attribution - appears with last stanza, stays visible longer
			if (poemAttributionRef.current) {
				ScrollTrigger.create({
					trigger: heroRef.current,
					start: 'top+=55% top',
					end: 'top+=63% top',
					onEnter: () => {
						gsap.to(poemAttributionRef.current, {
							opacity: 1,
							y: 0,
							duration: 0.6,
							ease: 'power2.out',
						});
					},
					onLeaveBack: () => {
						gsap.to(poemAttributionRef.current, {
							opacity: 0,
							y: -60,
							duration: 0.4,
							ease: 'power2.in',
						});
					},
				});
			}

			// Fade out scroll indicator
			gsap.to(scrollIndicatorRef.current, {
				opacity: 0,
				scrollTrigger: {
					trigger: heroRef.current,
					start: 'top top',
					end: 'top+=150 top',
					scrub: true,
				},
			});
		}, heroRef);

		return () => ctx.revert();
	}, [imageLoaded]);

	return (
		<section
			ref={heroRef}
			className='relative overflow-hidden'
			style={{ height: '200vh', minHeight: '200vh' }}
		>
			{/* Background Image with Parallax */}
			<div className='hero-background absolute inset-0 w-full h-full'>
				<Image
					src='/assets/hero.jpg'
					alt='김종서 장군'
					fill
					priority
					className={`object-cover object-center transition-all duration-1000 ${
						imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
					}`}
					quality={90}
					sizes='100vw'
					onLoad={() => setImageLoaded(true)}
				/>
				<div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70' />
			</div>

			{/* Main Content - Right Aligned at Top */}
			<div
				ref={contentRef}
				className='relative z-10 text-right text-white px-6 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full pt-24 sm:pt-32 md:pt-40'
			>
				<div className='ml-auto max-w-2xl'>
					<h1 className='font-chosun text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6 leading-tight'>
						절재 김종서 장군
					</h1>
					<div className='font-chosun text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-brand-300 mb-6 md:mb-8'>
						金宗瑞 (1383-1453)
					</div>
					<p className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed'>
						조선 전기의 명재상이자 무장
						<br />
						6진 개척을 통한 영토 확장의 주역
					</p>
				</div>
			</div>

			{/* Hyoonggap Image - Right Aligned, Smaller, Pinned */}
			<div
				ref={hyoonggapRef}
				className='relative z-10 flex justify-end px-6 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full mt-8 sm:mt-12 md:mt-16'
			>
				<div className='relative w-48 sm:w-56 md:w-64 lg:w-72'>
					<Image
						src='/assets/hyoonggap.png'
						alt='형갑'
						width={400}
						height={300}
						className={`w-full h-auto transition-all duration-1000 drop-shadow-2xl ${
							hyoonggapLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
						}`}
						priority
						onLoad={() => setHyoonggapLoaded(true)}
					/>
				</div>
			</div>

			{/* Poem Section - Vertical layout left-aligned, slides down from above */}
			<div
				ref={poemWrapperRef}
				className='absolute left-6 sm:left-8 md:left-12 lg:left-20 z-10'
				style={{ top: '90vh' }}
			>
				<div className='flex flex-row-reverse items-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-white'>
					{/* Stanza 1 - 삭풍은나모끝에불고 (Rightmost - read first) */}
					<div
						ref={poemStanza1Ref}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'upright',
						}}
					>
						<p className='font-chosun text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-shadow-lg tracking-wide'>
							삭풍은나모끝에불고
						</p>
					</div>

					{/* Stanza 2 - 명월은눈속에찬데 */}
					<div
						ref={poemStanza2Ref}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'upright',
						}}
					>
						<p className='font-chosun text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-shadow-lg tracking-wide'>
							명월은눈속에찬데
						</p>
					</div>

					{/* Stanza 3 - 만리변성에일장검짚고서서 */}
					<div
						ref={poemStanza3Ref}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'upright',
						}}
					>
						<p className='font-chosun text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-shadow-lg tracking-wide'>
							만리변성에일장검짚고서서
						</p>
					</div>

					{/* Stanza 4 - 긴파람큰한소래에 */}
					<div
						ref={poemStanza4Ref}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'upright',
						}}
					>
						<p className='font-chosun text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-shadow-lg tracking-wide'>
							긴파람큰한소래에
						</p>
					</div>

					{/* Stanza 5 - 거칠것이없에라 */}
					<div
						ref={poemStanza5Ref}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'upright',
						}}
					>
						<p className='font-chosun text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-shadow-lg tracking-wide'>
							거칠것이없에라
						</p>
					</div>

					{/* Attribution - Leftmost column (read last) */}
					<div
						ref={poemAttributionRef}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'mixed',
						}}
					>
						<p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 italic font-medium border-r-2 border-white/40 pr-2 sm:pr-3'>
							- 절재 김종서 장군의 시조 호기가
						</p>
					</div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<div
				ref={scrollIndicatorRef}
				className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center cursor-pointer z-20'
				onClick={onScrollToNext}
			>
				<div className='flex flex-col items-center animate-bounce'>
					<div className='w-6 h-10 border-2 border-white/80 rounded-full flex justify-center mb-2'>
						<div className='w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse' />
					</div>
					<p className='text-white/80 text-sm font-medium'>
						스크롤하여 더 보기
					</p>
				</div>
			</div>

			{/* Gradient Overlay at Bottom */}
			<div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10' />
		</section>
	);
}