// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type OrderItem = {
	id: string;
	quantity: number;
	price: number;
	note?: string;
};

export async function POST(req: Request) {
	// リクエストボディからテーブル番号（または配送先）と注文アイテム、備考を受け取る
	const { items, note, tableNumber } = (await req.json()) as {
		items: OrderItem[];
		note?: string;
		tableNumber: string;
	};

	// 認証ユーザー取得
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
	}

	// 合計金額を計算
	const total = items.reduce(
		(sum: number, item: { price: number; quantity: number }) =>
			sum + item.price * item.quantity,
		0,
	);

	// Prisma の Decimal 型に変換
	const { Decimal } = await import("decimal.js");
	const totalDecimal = new Decimal(total);

	// 注文を作成
	const order = await prisma.order.create({
		data: {
			userId: user.id,
			total: totalDecimal,
			status: "PENDING",
			paymentStatus: "PENDING",
			paymentMethod: "CARD", // 固定値か、フロントから渡す場合は外部化
			tableNumber: tableNumber, // ここを deliveryAddress → tableNumber に変更
			note: note ?? "",
			orderItems: {
				create: items.map((item: OrderItem) => ({
					menuItemId: item.id,
					quantity: item.quantity,
					price: new Decimal(item.price),
					note: item.note ?? "",
				})),
			},
		},
	});

	return NextResponse.json({ order });
}
