"use client";

import { useCart } from "@/hooks/use-cart";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/hooks/use-cart";

interface Props {
	placeOrder: (formData: FormData) => Promise<void>;
}

export default function CheckoutForm({ placeOrder }: Props) {
	// ✨ ここを統一
	const { items, totalPrice, clear } = useCart();
	const [isPending, start] = useTransition();
	const router = useRouter();

	/* ----------------------------- 送信処理 ----------------------------- */
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("items", JSON.stringify(items as CartItem[]));
		formData.append("totalPrice", totalPrice.toFixed(2));

		/* テーブル番号を追加 */
		const tableNumber = (
			e.currentTarget.elements.namedItem("tableNumber") as HTMLInputElement
		).value;
		formData.append("tableNumber", tableNumber);

		/* 備考欄（現状空） */
		formData.append("note", "");

		start(async () => {
			await placeOrder(formData);
			clear(); // ← カートを空に
			router.push("/orders"); // 履歴ページへ遷移
		});
	};

	/* ------------------------------  JSX  ------------------------------ */
	return (
		<div className="max-w-lg mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">チェックアウト</h1>

			{items.length === 0 ? (
				<p>カートに商品がありません。</p>
			) : (
				<form onSubmit={onSubmit} className="space-y-6">
					{/* ─ カート内アイテム ─ */}
					<ul className="space-y-4">
						{items.map((item) => (
							<li key={item.id} className="flex justify-between">
								<span>
									{item.name} × {item.quantity}
								</span>
								<span>${(item.price * item.quantity).toFixed(2)}</span>
							</li>
						))}
					</ul>

					{/* ─ 合計金額 ─ */}
					<div className="flex justify-between text-lg font-semibold">
						<span>合計</span>
						<span>${totalPrice.toFixed(2)}</span>
					</div>

					{/* ─ テーブル番号入力 ─ */}
					<div>
						<label htmlFor="tableNumber" className="block mb-1">
							テーブル番号
						</label>
						<input
							id="tableNumber"
							name="tableNumber"
							type="text"
							required
							className="w-full p-2 border rounded"
							placeholder="例: A12"
						/>
					</div>

					{/* ─ 注文ボタン ─ */}
					<button
						type="submit"
						disabled={isPending}
						className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
					>
						{isPending ? "送信中…" : "注文する"}
					</button>
				</form>
			)}
		</div>
	);
}
