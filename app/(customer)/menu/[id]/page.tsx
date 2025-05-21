import { notFound } from "next/navigation";
import Image from "next/image";
import { getMenuItem, getMenuItems } from "@/lib/menu";
import AddToCartButton from "@/components/menu/AddToCartButton";
interface Params {
	id: string;
}

// 静的生成用パス
export async function generateStaticParams(): Promise<Params[]> {
	const items = await getMenuItems();
	return items.map((item) => ({ id: item.id }));
}

export default async function MenuItemPage({ params }: { params: Params }) {
	const item = await getMenuItem(params.id);
	if (!item) return notFound();

	return (
		<div className="bg-gradient-to-b from-white to-gray-50 min-h-screen pb-12">
			{/* ヒーロー画像セクション */}
			<div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[30rem] mb-8">
				{item.image ? (
					<Image
						src={item.image}
						alt={item.name}
						fill
						priority
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full bg-gray-200 flex items-center justify-center">
						<span className="text-gray-500 font-medium">画像がありません</span>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
			</div>

			{/* コンテンツエリア */}
			<div className="container mx-auto px-4 -mt-24 relative z-10">
				<div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
					{/* 基本情報 */}
					{/* 商品名と説明文を連続して配置 */}
					<div className="mb-6">
						<h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
							{item.name}
						</h1>
						<div className="h-1 w-16 bg-amber-500 mb-4 rounded-full"></div>
						<p className="text-gray-600 max-w-3xl md:text-lg leading-relaxed">
							{item.description}
						</p>
					</div>

					{/* 価格と追加ボタン */}
					<div className="flex flex-wrap items-center justify-between mb-8">
						<div className="bg-amber-50 px-5 py-3 rounded-full mb-4 mr-4">
							<span className="text-2xl font-bold text-amber-600">
								${item.price.toFixed(2)}
							</span>
						</div>
						<div className="w-full sm:w-auto">
							<AddToCartButton item={item} />
						</div>
					</div>

					{/* 追加情報やレコメンドなどはこちらに */}
					<div className="border-t border-gray-100 pt-6 mt-6">
						<div className="flex items-center space-x-2 text-gray-500 text-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>準備時間: 約10〜15分</span>
						</div>

						{/* その他の情報を表示する場合はここに追加 */}
					</div>
				</div>
			</div>
		</div>
	);
}
