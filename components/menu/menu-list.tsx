"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { MenuItem } from "@/lib/menu";

interface MenuListProps {
	items: (MenuItem & { category: { name: string } })[];
}

export default function MenuList({ items }: MenuListProps) {
	const { addToCart, removeFromCart, cart } = useCart();
	const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
		Object.fromEntries(
			items.map((item) => [
				item.id,
				cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0,
			]),
		),
	);

	const handleAddToCart = (item: MenuItem) => {
		addToCart({
			id: item.id,
			name: item.name,
			price: Number(item.price),
			image: item.thumbnail || item.image,
			quantity: 1,
		});

		setItemQuantities((prev) => ({
			...prev,
			[item.id]: (prev[item.id] || 0) + 1,
		}));
	};

	const handleRemoveFromCart = (itemId: string) => {
		removeFromCart(itemId);

		setItemQuantities((prev) => ({
			...prev,
			[itemId]: Math.max(0, (prev[itemId] || 0) - 1),
		}));
	};

	if (items.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 text-lg">No menu items found.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
			{items.map(
				(
					item, //各メニュー
				) => (
					<div
						key={item.id}
						className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
					>
						<Link
							href={`/menu/${item.id}`}
							className="block relative h-48 group"
						>
							<Image
								src={
									item.image ||
									"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
										className="hover:text-orange-500 transition-colors"
									>
										{item.name}
									</Link>
								</h3>
								<span className="font-bold text-orange-500">
									${Number(item.price).toFixed(2)}
								</span>
							</div>

							<p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-1">
								{item.description || "Delicious menu item ready to order."}
							</p>

							<div className="mt-4">
								{itemQuantities[item.id] > 0 ? (
									<div className="flex items-center justify-between">
										<button
											onClick={() => handleRemoveFromCart(item.id)}
											className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 transition-colors"
										>
											<Minus size={16} />
										</button>

										<span className="font-medium">
											{itemQuantities[item.id]}
										</span>

										<button
											onClick={() => handleAddToCart(item)}
											className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
										>
											<Plus size={16} />
										</button>
									</div>
								) : (
									<button
										onClick={() => handleAddToCart(item)}
										className="w-full py-2 bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg text-white font-medium flex items-center justify-center gap-2"
									>
										<Plus size={16} /> Add to Cart
									</button>
								)}
							</div>
						</div>
					</div>
				),
			)}
		</div>
	);
}
