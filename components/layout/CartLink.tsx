// components/layout/CartLink.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function CartLink() {
	const { items } = useCart();
	const count = items.reduce((sum, i) => sum + i.quantity, 0);

	return (
		<Link href="/checkout" className="relative">
			<div
				className={`p-2 flex items-center rounded-full ${
					count > 0 ? "bg-primary/10" : ""
				} transition`}
			>
				<p className="mr-1 text-primary">Cart</p>
				<ShoppingCart
					size={18}
					className={`transition ${
						count > 0 ? "text-primary" : "text-gray-700 hover:text-gray-900"
					}`}
				/>
			</div>
			{count > 0 && (
				<span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
					{count}
				</span>
			)}
		</Link>
	);
}
