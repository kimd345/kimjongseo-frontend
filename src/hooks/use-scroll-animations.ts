// src/hooks/use-scroll-animations.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

// Hook for managing scroll-based animations with performance optimizations
export function useScrollAnimations() {
	const animationRefs = useRef<Set<gsap.core.Tween>>(new Set());

	const createScrollAnimation = useCallback(
		(
			element: string | Element,
			animation: gsap.TweenVars,
			trigger?: {
				trigger?: string | Element;
				start?: string;
				end?: string;
				scrub?: boolean | number;
				toggleActions?: string;
			}
		) => {
			if (typeof window === 'undefined') return null;

			const tween = gsap.to(element, {
				...animation,
				scrollTrigger: trigger
					? {
							trigger: trigger.trigger || element,
							start: trigger.start || 'top 80%',
							end: trigger.end,
							scrub: trigger.scrub || false,
							toggleActions: trigger.toggleActions || 'play none none reverse',
							...trigger,
						}
					: undefined,
			});

			animationRefs.current.add(tween);
			return tween;
		},
		[]
	);

	const createRevealAnimation = useCallback(
		(
			elements: string | NodeList | Element[],
			options?: {
				delay?: number;
				stagger?: number;
				start?: string;
			}
		) => {
			if (typeof window === 'undefined') return null;

			const tween = gsap.fromTo(
				elements,
				{
					y: 50,
					opacity: 0,
				},
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: 'power3.out',
					delay: options?.delay || 0,
					stagger: options?.stagger || 0.2,
					scrollTrigger: {
						// trigger: Array.isArray(elements) ? elements[0] : elements,
						start: options?.start || 'top 85%',
						toggleActions: 'play none none reverse',
					},
				}
			);

			animationRefs.current.add(tween);
			return tween;
		},
		[]
	);

	const createParallaxAnimation = useCallback(
		(
			element: string | Element,
			options?: {
				speed?: number;
				direction?: 'up' | 'down';
			}
		) => {
			if (typeof window === 'undefined') return null;

			const speed = options?.speed || 0.5;
			const direction = options?.direction || 'up';
			const yPercent = direction === 'up' ? -50 * speed : 50 * speed;

			const tween = gsap.to(element, {
				yPercent,
				ease: 'none',
				scrollTrigger: {
					trigger: element,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
				},
			});

			animationRefs.current.add(tween);
			return tween;
		},
		[]
	);

	// Cleanup function
	const cleanup = useCallback(() => {
		animationRefs.current.forEach((tween) => {
			if (tween.scrollTrigger) {
				tween.scrollTrigger.kill();
			}
			tween.kill();
		});
		animationRefs.current.clear();
	}, []);

	useEffect(() => {
		return () => cleanup();
	}, [cleanup]);

	return {
		createScrollAnimation,
		createRevealAnimation,
		createParallaxAnimation,
		cleanup,
	};
}

// Hook for performance monitoring and reduced motion support
export function useScrollPerformance() {
	useEffect(() => {
		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		);

		if (prefersReducedMotion.matches) {
			// Disable complex animations for users who prefer reduced motion
			gsap.globalTimeline.timeScale(0.1);
			ScrollTrigger.config({ ignoreMobileResize: true });
		}

		// Performance monitoring
		let frameCount = 0;
		let lastTime = performance.now();

		const checkPerformance = () => {
			const currentTime = performance.now();
			const deltaTime = currentTime - lastTime;

			if (deltaTime > 16.67) {
				// Less than 60fps
				frameCount++;
				if (frameCount > 10) {
					// Reduce animation quality for better performance
					gsap.globalTimeline.timeScale(0.5);
					ScrollTrigger.batch(null, { interval: 0.2 }); // Batch updates
				}
			} else {
				frameCount = Math.max(0, frameCount - 1);
			}

			lastTime = currentTime;
			requestAnimationFrame(checkPerformance);
		};

		requestAnimationFrame(checkPerformance);
	}, []);
}

// Hook for intersection-based animations (fallback for older browsers)
export function useIntersectionAnimation() {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const elementsRef = useRef<Set<Element>>(new Set());

	const observe = useCallback((element: Element, callback: () => void) => {
		if (!observerRef.current) {
			observerRef.current = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							callback();
							observerRef.current?.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1, rootMargin: '-20px' }
			);
		}

		observerRef.current.observe(element);
		elementsRef.current.add(element);
	}, []);

	useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
			elementsRef.current.clear();
		};
	}, []);

	return { observe };
}
