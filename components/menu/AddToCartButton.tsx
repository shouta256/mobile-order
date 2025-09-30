"use client";
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({
	id,
	name,
	price,
	image,
}: { id: string; name: string; price: number; image?: string | null }) {
	const { addToCart } = useCart();
	return (
		<Button onClick={() => addToCart({ id, name, price, image, quantity: 1 })}>
			<Plus className="mr-2 h-4 w-4" />
			Add to cart
		</Button>
	);
}
