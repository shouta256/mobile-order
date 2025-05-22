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

	// ────────── 初回読み込み ──────────
	useEffect(() => {
		const raw = localStorage.getItem(storageKey);
		if (raw) {
			try {
				setItems(JSON.parse(raw));
			} catch {
				localStorage.removeItem(storageKey);
			}
		} else {
			setItems([]); // ユーザーが切り替わった場合に初期化
		}
	}, [storageKey]); // userId が変わったら再実行

	// ────────── 保存 ──────────
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(items));
	}, [items, storageKey]);

	// ────────── 操作関数 ──────────
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
				// カートにないなら何もしない
				return prev;
			}
			if (existing.quantity <= 1) {
				// 1 以下になったら配列から除外
				return prev.filter((i) => i.id !== id);
			}
			// それ以外は quantity を 1 減らす
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
