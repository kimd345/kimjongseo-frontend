/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			'localhost',
			'kimjongseo.org',
			'raw.githubusercontent.com', // ✅ Add this for GitHub files
		],
		formats: ['image/webp', 'image/avif'],
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
	},
};

module.exports = nextConfig;
