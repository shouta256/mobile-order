"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	image?: string | null;
	thumbnail?: string | null;
}

interface Props {
	item: {
		id: string;
		name: string;
		price: number;
		image?: string | null;
		thumbnail?: string | null;
	};
}

export default function AddToCartButton({ item }: Props) {
	const { addToCart } = useCart();

	const handleClick = () => {
		addToCart({
			id: item.id,
			name: item.name,
			price: item.price,
			image: item.thumbnail ?? item.image,
			quantity: 1,
		});
	};

	return (
		<Button onClick={handleClick}>
			<Plus className="mr-2 h-4 w-4" />
			カートに追加
		</Button>
	);
}
