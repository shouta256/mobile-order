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
	// Read table number, items, and note from request
	const { items, note, tableNumber } = (await req.json()) as {
		items: OrderItem[];
		note?: string;
		tableNumber: string;
	};

	// Get current user
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
	}

	// Calculate total price
	const total = items.reduce(
		(sum: number, item: { price: number; quantity: number }) =>
			sum + item.price * item.quantity,
		0,
	);

	// Convert to Prisma Decimal
	const { Decimal } = await import("decimal.js");
	const totalDecimal = new Decimal(total);

	// Create order
	const order = await prisma.order.create({
		data: {
			userId: user.id,
			total: totalDecimal,
			status: "PENDING",
			paymentStatus: "PENDING",
			paymentMethod: "CARD", // Use fixed value, change if front sends data
			tableNumber: tableNumber, // Was deliveryAddress, now tableNumber
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
