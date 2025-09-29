/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	reactStrictMode: true,
	swcMinify: true,

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
};

export default nextConfig;
