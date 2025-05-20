// app/(admin)/admin/orders/actions.ts
"use server";

import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/** オーダー詳細の更新（テーブル番号・ステータス・数量・合計金額の再計算） */
export async function updateOrderDetail(formData: FormData) {
	// 権限チェック：STAFF 以上
	await requireStaff();

	// 1) 基本フィールド取得
	const orderId = formData.get("id") as string;
	if (!orderId) throw new Error("注文IDがありません");

	const tableNumber = formData.get("tableNumber") as string;
	const status = formData.get("status") as string;

	// 2) itemIds と対応数量を取得
	const itemIds = formData.getAll("itemIds") as string[];
	const items = itemIds.map((itemId) => {
		const q = formData.get(`quantity-${itemId}`);
		const quantity = typeof q === "string" ? parseInt(q, 10) : 0;
		return { id: itemId, quantity };
	});

	// 3) トランザクション処理
	await prisma.$transaction(async (tx) => {
		// ・テーブル番号／ステータスの更新
		await tx.order.update({
			where: { id: orderId },
			data: { tableNumber, status },
		});

		// ・各 orderItem の数量更新
		for (const it of items) {
			await tx.orderItem.update({
				where: { id: it.id },
				data: { quantity: it.quantity },
			});
		}

		// ・更新後の orderItem を取得して合計金額を再計算
		const updatedItems = await tx.orderItem.findMany({
			where: { orderId },
			select: { price: true, quantity: true },
		});
		const newTotal = updatedItems.reduce((sum, oi) => {
			// price は Decimal なので toNumber()
			const priceNum =
				typeof oi.price === "object" && "toNumber" in oi.price
					? oi.price.toNumber()
					: (oi.price as number);
			return sum + priceNum * oi.quantity;
		}, 0);

		// ・order.total を更新
		await tx.order.update({
			where: { id: orderId },
			data: { total: newTotal },
		});
	});

	// 4) キャッシュ再検証
	revalidatePath("/admin/orders");
	revalidatePath(`/admin/orders/${orderId}`);
}

/** オーダー削除（未完了のみ） */
export async function deleteOrder(formData: FormData) {
	await requireStaff();
	const id = formData.get("id") as string;
	if (!id) throw new Error("注文IDがありません");

	await prisma.order.delete({ where: { id } });
	revalidatePath("/admin/orders");
}
