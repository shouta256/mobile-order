"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	image?: string | null;
	quantity: number;
}

interface CartContextType {
	items: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: string) => void;
	clear: () => void;
	totalCount: number;
	totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const { data: session } = useSession();
	const userId = session?.user?.id ?? "guest";
	const storageKey = `cart_${userId}`;

	const [items, setItems] = useState<CartItem[]>([]);

	// First load from storage
	useEffect(() => {
		const raw = localStorage.getItem(storageKey);
		if (raw) {
			try {
				setItems(JSON.parse(raw));
			} catch {
				localStorage.removeItem(storageKey);
			}
		} else {
			setItems([]); // Reset if user changes
		}
	}, [storageKey]); // Run again when user id changes

	// Save when items change
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(items));
	}, [items, storageKey]);

	// Action helpers
	const addToCart = useCallback((item: CartItem) => {
		setItems((prev) => {
			const ex = prev.find((i) => i.id === item.id);
			if (ex) {
				return prev.map((i) =>
					i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
				);
			}
			return [...prev, item];
		});
	}, []);

	const removeFromCart = useCallback((id: string) => {
		setItems((prev) => {
			const existing = prev.find((i) => i.id === id);
			if (!existing) {
				// Item not found, do nothing
				return prev;
			}
			if (existing.quantity <= 1) {
				// Remove when quantity is 1 or less
				return prev.filter((i) => i.id !== id);
			}
			// Else reduce quantity by one
			return prev.map((i) =>
				i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
			);
		});
	}, []);

	const clear = useCallback(() => {
		setItems([]);
	}, []);

	const totalCount = items.reduce((s, i) => s + i.quantity, 0);
	const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

	return (
		<CartContext.Provider
			value={{
				items,
				addToCart,
				removeFromCart,
				clear,
				totalCount,
				totalPrice,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
	return ctx;
};
