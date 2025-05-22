// components/menu/MenuList.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { MenuItem } from "@/lib/menu";

interface MenuListProps {
	items: (MenuItem & { category: { name: string } })[];
	primaryColor: string;
}

export default function MenuList({ items, primaryColor }: MenuListProps) {
	const { items: cartItems, addToCart, removeFromCart } = useCart();
	const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
		{},
	);

	// cartItems が変わるたびに数量マップを再計算
	useEffect(() => {
		const qtyMap: Record<string, number> = {};
		for (const ci of cartItems) {
			qtyMap[ci.id] = ci.quantity;
		}
		setItemQuantities(qtyMap);
	}, [cartItems]);

	const handleAdd = (item: MenuItem) =>
		addToCart({
			id: item.id,
			name: item.name,
			price: Number(item.price),
			image: item.thumbnail ?? item.image,
			quantity: 1,
		});

	const handleRemove = (itemId: string) => removeFromCart(itemId);

	if (items.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 text-lg">No menu items found.</p>
			</div>
		);
	}

	return (
		<div
			// --primary カスタムプロパティに渡された色をセット
			style={{ "--primary": primaryColor } as React.CSSProperties}
			className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 sm:gap-6 mt-6"
		>
			{items.map((item) => (
				<div
					key={item.id}
					className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
				>
					<Link href={`/menu/${item.id}`} className="block relative h-48 group">
						<Image
							src={
								item.image ||
								"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
							}
							alt={item.name}
							fill
							style={{ objectFit: "cover" }}
							className="transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
						<div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
							{item.category.name}
						</div>
					</Link>

					<div className="p-4 flex-1 flex flex-col">
						<div className="flex justify-between items-start">
							<h3 className="font-semibold text-lg">
								<Link
									href={`/menu/${item.id}`}
									// 商品名リンクの hover 色も --primary を参照
									className="transition-colors hover:text-[var(--primary)]"
								>
									{item.name}
								</Link>
							</h3>
							<span className="font-bold text-[var(--primary)]">
								${Number(item.price).toFixed(2)}
							</span>
						</div>

						<p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-1">
							{item.description || "Delicious menu item ready to order."}
						</p>

						<div className="mt-4">
							{itemQuantities[item.id] > 0 ? (
								<div className="flex items-center justify-between">
									{/* マイナスボタン */}
									<button
										type="button"
										onClick={() => handleRemove(item.id)}
										className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center hover:bg-[var(--primary)]/20 transition-colors"
									>
										<Minus size={16} />
									</button>

									<span className="font-medium">{itemQuantities[item.id]}</span>

									{/* プラスボタン */}
									<button
										type="button"
										onClick={() => handleAdd(item)}
										className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
									>
										<Plus size={16} />
									</button>
								</div>
							) : (
								<button
									type="button"
									onClick={() => handleAdd(item)}
									className="w-full py-2 bg-[var(--primary)] text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
								>
									<Plus size={16} /> Add to Cart
								</button>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
