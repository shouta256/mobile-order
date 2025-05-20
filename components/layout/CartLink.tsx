// components/layout/CartLink.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function CartLink() {
	const { cart } = useCart();
	const count = cart.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<Link href="/checkout" className="relative">
			{/* アイコンの背景を、count>0 ならオレンジの薄い背景に */}
			<div
				className={`p-2 flex items-center rounded-full ${count > 0 ? "bg-orange-100" : ""}`}
			>
				<p>カート</p>
				<ShoppingCart size={18} className="text-gray-700 hover:text-gray-900" />
			</div>

			{/* count が 1 以上なら、右上に赤バッジ */}
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
