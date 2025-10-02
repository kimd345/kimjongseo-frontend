/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#fefbf0',
					100: '#fef6d9',
					200: '#fdedb3',
					300: '#f5dc7d',
					400: '#e8c954',
					500: '#d3af37',
					600: '#b8922a',
					700: '#947422',
					800: '#6b5318',
					900: '#4a3910',
				},
				korean: {
					red: '#cd2e3a',
					blue: '#0e4a84',
				},
			},
			fontFamily: {
				korean: [
					'Apple SD Gothic Neo',
					'Noto Sans KR',
					'Malgun Gothic',
					'sans-serif',
				],
				chosun: ['Chosun', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.3s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
		},
	},
	plugins: [],
	// plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
