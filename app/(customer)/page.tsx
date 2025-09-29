// app/(customer)/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Utensils } from "lucide-react";
import { getFeaturedMenuItems } from "@/lib/menu";
import { getCurrentUser } from "@/lib/auth";
import { getSiteSetting } from "@/lib/settings";

// export const dynamic = "force-dynamic";

const FALLBACK_URL =
	"https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";

export default async function HomePage() {
	// Get login status on server
	const [user, featuredItems, setting] = await Promise.all([
		getCurrentUser(),
		getFeaturedMenuItems(),
		getSiteSetting(),
	]);

	const heroImage =
		setting?.heroImage && setting.heroImage.trim() !== ""
			? setting.heroImage
			: FALLBACK_URL;

	/* 設定が無い場合のフォールバック */
	const heroText1 = setting?.heroText1 ?? "ハンバーガーで、";
	const heroText2 = setting?.heroText2 ?? "今日をもっとおいしく。";
	const heroText3 = setting?.heroText3 ?? "";
	const primaryColor = setting?.primaryColor ?? "#ff7a00";

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="relative h-[70vh] flex items-center">
				{/* 背景画像 */}
				<div className="absolute inset-0 z-0 overflow-hidden">
					<Image
						src={heroImage} /* ← ここが string 型に */
						alt="Hero"
						fill
						priority
						className="object-cover brightness-[0.6]"
					/>
				</div>

				{/* キャッチコピー */}
				<div className="container mx-auto px-6 relative z-10">
					<div className="w-full sm:max-w-xl">
						<h1 className="font-bold leading-tight text-4xl md:text-6xl tracking-tight">
							<span className="block text-white">{heroText1}</span>
							<span
								className="block whitespace-nowrap"
								style={{ color: primaryColor }}
							>
								{heroText2}
							</span>
						</h1>

						{heroText3 && (
							<p className="mt-4 text-sm sm:text-base text-white/80 max-w-md">
								{heroText3}
							</p>
						)}

						{/* CTA */}
						<div className="mt-8 flex flex-col sm:flex-row gap-4">
							<Link
								href="/menu"
								style={{ backgroundColor: primaryColor }}
								className="px-6 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
							>
								View Menu <ArrowRight size={18} />
							</Link>

							{!user && (
								<Link
									href="/auth/signin"
									className="px-6 py-3 bg-white rounded-full text-gray-900 font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
								>
									Sign In
								</Link>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Featured Menu Items */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-6">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-3xl font-bold flex items-center gap-2">
							<Utensils style={{ color: primaryColor }} /> Featured Items
						</h2>
						<Link
							href="/menu"
							className=" font-medium hover:text-orange-600 flex items-center gap-1"
							style={{ color: primaryColor }}
						>
							View All <ArrowRight size={16} />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{featuredItems.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
							>
								<div className="relative h-48">
									<Image
										src={
											item.image ||
											"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
										}
										alt={item.name}
										fill
										style={{ objectFit: "cover" }}
										className="transition-transform duration-300 hover:scale-105"
									/>
								</div>
								<div className="p-4">
									<div className="flex justify-between items-start">
										<h3 className="font-semibold text-lg">{item.name}</h3>
										<span className="font-bold" style={{ color: primaryColor }}>
											${item.price.toFixed(2)}
										</span>
									</div>
									<p className="text-gray-600 text-sm mt-2 line-clamp-2">
										{item.description}
									</p>
									<div className="mt-4">
										<Link
											href={`/menu/${item.id}`}
											className="w-full py-2 flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-gray-900 font-medium"
										>
											View Details
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Challenges Section */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-6">
					<div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl overflow-hidden shadow-xl">
						<div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
							<div className="md:w-1/2 mb-8 md:mb-0">
								<h2 className="text-3xl md:text-4xl font-bold text-white">
									Complete Challenges,
									<br />
									Earn Rewards
								</h2>
								<p className="mt-4 text-white/90">
									Join our challenges and get exclusive discounts on your
									favorite meals. Order 5 times this week and enjoy 10% off your
									next purchase!
								</p>
								<Link
									href="/challenges"
									className="mt-6 inline-block px-6 py-3 bg-white hover:bg-gray-100 transition-colors rounded-full text-cyan-600 font-medium"
								>
									View Challenges
								</Link>
							</div>
							<div className="md:w-1/2 flex justify-center">
								<div className="relative w-64 h-64">
									<Image
										src="https://images.pexels.com/photos/6205791/pexels-photo-6205791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
										alt="Food challenge"
										fill
										style={{ objectFit: "cover" }}
										className="rounded-xl"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-6">
					<h2 className="text-3xl font-bold text-center mb-12">ご利用の流れ</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: "メニュー",
								icon: "🍔",
								description:
									"豊富なメニューからお好みの料理をお選びいただけます。",
							},
							{
								title: "注文",
								icon: "🛒",
								description:
									"アイテムをカートに追加し、簡単な手続きでご注文を完了できます。",
							},
							{
								title: "簡単",
								icon: "😋",
								description:
									"ご注文の料理がすぐに届き、そのまま美味しくお楽しみいただけます。",
							},
						].map((step) => (
							<div
								key={step.title}
								className="flex flex-col items-center text-center"
							>
								<div className="w-16 h-16 flex items-center justify-center text-3xl bg-orange-100 rounded-full mb-4">
									{step.icon}
								</div>
								<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
								<p className="text-gray-600">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
