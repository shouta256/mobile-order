/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	reactStrictMode: true,
	swcMinify: true,

	// ★ static export では動的 API が動かないので standalone へ
	output: "standalone",

	eslint: {
		ignoreDuringBuilds: true,
	},

	images: {
		unoptimized: true,
		domains: [
			"images.pexels.com",
			"res.cloudinary.com",
			// 必要に応じて他ドメインを追加
		],
	},
};

export default nextConfig;
