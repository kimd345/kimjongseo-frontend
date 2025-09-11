/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ['localhost', 'kimjongseo.org'],
		formats: ['image/webp', 'image/avif'],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:3001/api/:path*',
			},
		];
	},
	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
	},
};

module.exports = nextConfig;
