// src/components/home/content.tsx - Updated with video support
'use client';

import { FIXED_SECTIONS, hasSubsections } from '@/lib/content-manager';
import { VideoSection } from '@/components/ui/video-section';

export default function ContentSections() {
	// Filter out 'contact' section since it's a static page, not a content display section
	const sections = Object.entries(FIXED_SECTIONS)
		.filter(([id]) => id !== 'contact')
		.map(([id, section], index) => {
			// Map section IDs to video files
			let videoSrc = '';
			if (id === 'about-general') videoSrc = '/assets/about-general.mp4';
			else if (id === 'organization') videoSrc = '/assets/organization.mp4';
			else if (id === 'library') videoSrc = '/assets/library.mp4';

			return {
				id,
				name: section.name,
				description: section.description,
				image: `/assets/home-${index + 1}.jpg`, // Keep as decorative thumbnail
				videoSrc, // Add video source
				url: `/${id}`,
				subsections: hasSubsections(section) ? section.subsections : undefined,
			};
		});

	return (
		<div className='bg-gray-50'>
			{sections.map((section, index) => (
				<VideoSection
					key={section.id}
					{...section}
					index={index}
					isReversed={index % 2 === 1}
				/>
			))}
		</div>
	);
}
