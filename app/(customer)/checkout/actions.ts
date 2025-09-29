"use server";

import Decimal from "decimal.js";
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

	if (!Array.isArray(items) || items.length === 0) {
		throw new Error("カートが空です");
	}

	const uniqueItemIds = Array.from(new Set(items.map((item) => item.id)));

	// 3) DB から最新の価格を取得
	const menuItems = await prisma.menuItem.findMany({
		where: { id: { in: uniqueItemIds } },
	});

	if (menuItems.length !== uniqueItemIds.length) {
		throw new Error("存在しないメニューが含まれています");
	}

	const menuItemMap = new Map(menuItems.map((menuItem) => [menuItem.id, menuItem]));
	let recalculatedTotal = new Decimal(0);

	const orderItemsData = items.map((item) => {
		const menuItem = menuItemMap.get(item.id);
		if (!menuItem) {
			throw new Error(`Item not found: ${item.id}`);
		}

		if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
			throw new Error("数量が不正です");
		}

		if (menuItem.available === false) {
			throw new Error("販売停止中の商品が含まれています");
		}

		const unitPrice = new Decimal(menuItem.price.toString());
		recalculatedTotal = recalculatedTotal.add(unitPrice.mul(item.quantity));

		return {
			menuItemId: item.id,
			quantity: item.quantity,
			price: menuItem.price,
			note: item.note,
		};
	});

	const totalDecimal = recalculatedTotal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

	// 4) 注文を作成
	await prisma.order.create({
		data: {
			userId: user.id,
			total: totalDecimal.toFixed(2),
			status: "PENDING",
			paymentStatus: "PENDING",
			paymentMethod: "CARD",
			tableNumber,
			note,
			orderItems: {
				create: orderItemsData,
			},
		},
	});

	// キャッシュ再検証 & リダイレクト
	revalidatePath("/orders");
	redirect("/orders");
}
