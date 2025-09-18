// src/hooks/use-scroll-animations.ts - TypeScript-safe version
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
							invalidateOnRefresh: true,
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
			elements: string,
			options?: {
				delay?: number;
				stagger?: number;
				start?: string;
			}
		) => {
			if (typeof window === 'undefined') return null;

			// Only accept string selectors to avoid TypeScript issues
			const elementArray = Array.from(
				document.querySelectorAll<Element>(elements)
			);

			// Only proceed if elements exist
			if (elementArray.length === 0) {
				console.warn(`No elements found for selector: ${elements}`);
				return null;
			}

			const tween = gsap.fromTo(
				elementArray,
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
						trigger: elementArray[0],
						start: options?.start || 'top 85%',
						toggleActions: 'play none none reverse',
						invalidateOnRefresh: true,
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

			const el =
				typeof element === 'string' ? document.querySelector(element) : element;
			if (!el) {
				console.warn(`Element not found for parallax animation: ${element}`);
				return null;
			}

			const speed = options?.speed || 0.5;
			const direction = options?.direction || 'up';
			const yPercent = direction === 'up' ? -50 * speed : 50 * speed;

			const tween = gsap.to(el, {
				yPercent,
				ease: 'none',
				scrollTrigger: {
					trigger: el,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
					invalidateOnRefresh: true,
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
		if (typeof window !== 'undefined') {
			ScrollTrigger.refresh();
		}
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
		if (typeof window === 'undefined') return;

		// Check for reduced motion preference
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		const handleReducedMotion = (e: MediaQueryListEvent) => {
			if (e.matches) {
				// Disable complex animations for users who prefer reduced motion
				gsap.globalTimeline.timeScale(0.1);
				ScrollTrigger.config({
					ignoreMobileResize: true,
					autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
				});
			} else {
				gsap.globalTimeline.timeScale(1);
			}
		};

		// Check initial state
		if (mediaQuery.matches) {
			gsap.globalTimeline.timeScale(0.1);
			ScrollTrigger.config({
				ignoreMobileResize: true,
				autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
			});
		}

		// Listen for changes
		mediaQuery.addEventListener('change', handleReducedMotion);

		// Performance monitoring
		let frameCount = 0;
		let lastTime = performance.now();
		let rafId: number;

		const checkPerformance = () => {
			const currentTime = performance.now();
			const deltaTime = currentTime - lastTime;

			if (deltaTime > 16.67) {
				// Less than 60fps
				frameCount++;
				if (frameCount > 10) {
					// Reduce animation quality for better performance
					gsap.globalTimeline.timeScale(0.5);
					ScrollTrigger.config({
						autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
					});
				}
			} else {
				frameCount = Math.max(0, frameCount - 1);
				if (frameCount === 0) {
					gsap.globalTimeline.timeScale(1);
				}
			}

			lastTime = currentTime;
			rafId = requestAnimationFrame(checkPerformance);
		};

		rafId = requestAnimationFrame(checkPerformance);

		return () => {
			cancelAnimationFrame(rafId);
			mediaQuery.removeEventListener('change', handleReducedMotion);
		};
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
				{
					threshold: 0.1,
					rootMargin: '-20px',
				}
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
