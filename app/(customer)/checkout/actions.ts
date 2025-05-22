"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function placeOrder(formData: FormData) {
	// 1) ユーザー取得
	const user = await getCurrentUser();
	if (!user) throw new Error("ログインが必要です");

	// 2) FormData から値を取り出し
	const itemsJson = formData.get("items");
	const totalPrice = formData.get("totalPrice");
	const tableNumber = formData.get("tableNumber");
	const note = formData.get("note");

	if (
		typeof itemsJson !== "string" ||
		typeof totalPrice !== "string" ||
		typeof tableNumber !== "string" ||
		typeof note !== "string"
	) {
		throw new Error("不正なリクエストです");
	}

	const items = JSON.parse(itemsJson) as {
		id: string;
		quantity: number;
		note?: string;
	}[];
	const total = Number.parseFloat(totalPrice);

	// 3) DB から最新の価格を取得
	const menuItems = await prisma.menuItem.findMany({
		where: { id: { in: items.map((i) => i.id) } },
	});

	// 4) 注文を作成
	await prisma.order.create({
		data: {
			userId: user.id,
			total,
			status: "PENDING",
			paymentStatus: "PENDING",
			paymentMethod: "CARD",
			tableNumber,
			note,
			orderItems: {
				create: items.map((item) => {
					const mi = menuItems.find((m) => m.id === item.id);
					if (!mi) throw new Error(`Item not found: ${item.id}`);
					return {
						menuItemId: item.id,
						quantity: item.quantity,
						price: mi.price,
						note: item.note,
					};
				}),
			},
		},
	});

	// キャッシュ再検証 & リダイレクト
	revalidatePath("/orders");
	redirect("/orders");
}
