// components/menu/AddToCartButton.tsx
"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/menu";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	image?: string | null;
	thumbnail?: string | null;
}

interface Props {
	item: CartItem;
}

export function AddToCartButton({ item }: Props) {
	const { addToCart } = useCart();

	return (
		<Button
			onClick={() =>
				addToCart({
					id: item.id,
					name: item.name,
					price: Number(item.price),
					image: item.thumbnail || item.image,
					quantity: 1,
				})
			}
		>
			<Plus className="mr-2 h-4 w-4" /> カートに追加
		</Button>
	);
}
