// src/components/home/content.tsx
'use client';

import { FIXED_SECTIONS, hasSubsections } from '@/lib/content-manager';
import { MobileOptimizedSection } from '@/components/ui/mobile-optimized-section';

export default function ContentSections() {
	// Filter out 'contact' section since it's a static page, not a content display section
	const sections = Object.entries(FIXED_SECTIONS)
		.filter(([id]) => id !== 'contact') // Exclude contact from home page sections
		.map(([id, section], index) => ({
			id,
			name: section.name,
			description: section.description,
			image: `/assets/home-${index + 1}.jpg`,
			url: `/${id}`,
			subsections: hasSubsections(section) ? section.subsections : undefined,
		}));

	return (
		<div className='bg-gray-50'>
			{sections.map((section, index) => (
				<MobileOptimizedSection
					key={section.id}
					{...section}
					index={index}
					isReversed={index % 2 === 1}
				/>
			))}
		</div>
	);
}
