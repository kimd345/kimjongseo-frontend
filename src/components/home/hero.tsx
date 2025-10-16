import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

// Interactive word component for Korean/Chinese character swapping
function InteractiveWord({
	korean,
	chinese,
}: {
	korean: string;
	chinese: string;
}) {
	const [showChinese, setShowChinese] = useState(false);

	return (
		<span
			className='inline-block cursor-pointer text-brand-200 hover:text-brand-300 transition-colors duration-200 select-none'
			style={{
				letterSpacing: showChinese ? '0.25em' : 'normal',
			}}
			onMouseEnter={() => setShowChinese(true)}
			onMouseLeave={() => setShowChinese(false)}
			onTouchStart={() => setShowChinese(!showChinese)}
		>
			{showChinese ? chinese : korean}
		</span>
	);
}

interface EnhancedHeroSectionProps {
	onScrollToNext: () => void;
}

export default function EnhancedHeroSection({}: EnhancedHeroSectionProps) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [hyoonggapLoaded, setHyoonggapLoaded] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
	// const scrollIndicatorRef = useRef<HTMLDivElement>(null);

	// Track mouse movement for hyoonggap parallax effect
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!hyoonggapRef.current) return;

			const rect = hyoonggapRef.current.getBoundingClientRect();
			const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
			const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

			setMousePosition({ x, y });
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

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

			// Fade out hyoonggap image completely as user scrolls
			if (hyoonggapRef.current) {
				gsap.to(hyoonggapRef.current, {
					opacity: 0,
					scale: 1,
					y: 0,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: heroRef.current,
						start: 'top+=10% top',
						end: 'top+=20% top',
						scrub: true,
					},
				});
			}

			// Pin poem wrapper near the top when it enters viewport
			ScrollTrigger.create({
				trigger: poemWrapperRef.current,
				start: 'top 20%',
				end: () => `+=${heroRef.current!.offsetHeight * 0.35}`,
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
						start: `top+=${10 + index * 4}% top`,
						end: `top+=${16 + index * 4}% top`,
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
					start: 'top+=35% top',
					end: 'top+=42% top',
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
			// if (scrollIndicatorRef.current) {
			// 	gsap.to(scrollIndicatorRef.current, {
			// 		opacity: 0,
			// 		scrollTrigger: {
			// 			trigger: heroRef.current,
			// 			start: 'top top',
			// 			end: 'top+=150 top',
			// 			scrub: true,
			// 		},
			// 	});
			// }
		}, heroRef);

		return () => ctx.revert();
	}, [imageLoaded]);

	return (
		<section
			ref={heroRef}
			className='relative overflow-hidden select-none'
			style={{ height: '170vh', minHeight: '170vh' }}
		>
			{/* Background Image with Parallax - LIGHT OVERLAY */}
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
				{/* REVERSED: Light gradient overlay */}
				<div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40' />
			</div>

			{/* Main Content - Right Aligned at Top - DARK TEXT */}
			<div
				ref={contentRef}
				className='relative z-10 text-right text-black px-6 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full pt-24 sm:pt-32 md:pt-40'
			>
				<div className='ml-auto max-w-2xl'>
					<h1 className='font-chosun text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6 leading-tight'>
						절재 김종서 장군
					</h1>
					<div className='font-chosun text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 mb-6 md:mb-8'>
						金宗瑞 (1383-1453)
					</div>
					<p className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 leading-relaxed'>
						조선 전기의 명재상이자 무장
						<br />
						6진 개척을 통한 영토 확장의 주역
					</p>
				</div>
			</div>

			{/* Hyoonggap Image - Right Aligned, Smaller, with Interactive Hover Effect */}
			<div
				ref={hyoonggapRef}
				className='relative z-10 flex justify-end px-6 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto w-full mt-8 sm:mt-12 md:mt-16'
			>
				<div
					className='relative w-48 sm:w-56 md:w-64 lg:w-72 cursor-pointer group'
					style={{
						transform: `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${mousePosition.y * -10}deg)`,
						transition: 'transform 0.3s ease-out',
					}}
				>
					<Image
						src='/assets/hyoonggap.png'
						alt='형갑'
						width={400}
						height={300}
						className={`w-full h-auto transition-all duration-1000 drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(251,191,36,0.5)] ${
							hyoonggapLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
						}`}
						priority
						onLoad={() => setHyoonggapLoaded(true)}
					/>
					{/* Glow effect behind image */}
					<div className='absolute inset-0 bg-brand-400/0 group-hover:bg-brand-400/20 blur-2xl transition-all duration-500 -z-10' />
				</div>
			</div>

			{/* Poem Section - Vertical layout left-aligned, slides down from above - DARK TEXT */}
			<div
				ref={poemWrapperRef}
				className='absolute left-6 sm:left-8 md:left-12 lg:left-20 z-10'
				style={{ top: '45vh' }}
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
						<p className='font-chosun text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-shadow-lg tracking-wide'>
							<InteractiveWord korean='삭풍' chinese='朔風' />
							은나모끝에불고
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
						<p className='font-chosun text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-shadow-lg tracking-wide'>
							<InteractiveWord korean='명월' chinese='明月' />
							은눈속에찬데
						</p>
					</div>

					{/* Stanza 3 - 만리변성에일장검짊고서서 */}
					<div
						ref={poemStanza3Ref}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'upright',
						}}
					>
						<p className='font-chosun text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-shadow-lg tracking-wide'>
							<InteractiveWord korean='만리변성' chinese='萬里邊城' />에
							<InteractiveWord korean='일장검' chinese='一長劍' />
							짊고서서
						</p>
					</div>

					{/* Stanza 4 - 긴파람흰한소래에 */}
					<div
						ref={poemStanza4Ref}
						className='opacity-0'
						style={{
							transform: 'translateY(-60px)',
							writingMode: 'vertical-rl',
							textOrientation: 'upright',
						}}
					>
						<p className='font-chosun text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-shadow-lg tracking-wide'>
							긴파람흰한소래에
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
						<p className='font-chosun text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-shadow-lg tracking-wide'>
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
						<p className='font-chosun text-sm sm:text-base md:text-lg lg:text-xl font-bold border-r-2 border-gray-900/40 pr-2 sm:pr-3 text-shadow-lg'>
							- 김종서 장군의 시조{' '}
							<InteractiveWord korean='호기가' chinese='豪氣歌' />
						</p>
					</div>
				</div>
			</div>
			{/* Gradient Overlay at Bottom */}
			{/* <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10' /> */}
		</section>
	);
}
