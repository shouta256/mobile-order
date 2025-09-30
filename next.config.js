/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: '2mb',
			allowedOrigins: ['localhost:3000'],
		},
	},
	reactStrictMode: true,

  // Use standalone because static export cannot run dynamic API
	output: "standalone",

	eslint: {
		ignoreDuringBuilds: true,
	},

	images: {
		unoptimized: true,
		domains: [
			"images.pexels.com",
			"res.cloudinary.com",
        // Add more domains when needed
		],
	},

	// Silence workspace root inference warning by explicitly setting the tracing root
	outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
