/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['localhost', 'kimjongseo.org'],
		formats: ['image/webp', 'image/avif'],
	},
	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL || '/api',
	},
};

module.exports = nextConfig;
