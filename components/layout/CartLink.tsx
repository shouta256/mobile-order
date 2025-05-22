// components/layout/CartLink.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function CartLink() {
	const { items } = useCart();

	/* 合計個数を算出 */
	const count = items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<Link href="/checkout" className="relative">
			{/* アイコン&テキスト。商品が入っていれば薄いオレンジ背景 */}
			<div
				className={`p-2 flex items-center rounded-full ${
					count > 0 ? "bg-orange-100" : ""
				}`}
			>
				<p className="mr-1">カート</p>
				<ShoppingCart size={18} className="text-gray-700 hover:text-gray-900" />
			</div>

			{/* 個数バッジ */}
			{count > 0 && (
				<span
					className="absolute -top-1 -right-1 bg-orange-500 text-white 
                     rounded-full w-5 h-5 flex items-center justify-center text-xs"
				>
					{count}
				</span>
			)}
		</Link>
	);
}
