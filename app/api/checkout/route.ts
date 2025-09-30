// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Decimal from "decimal.js";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type OrderItem = {
    id: string;
    quantity: number;
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

    // Validate
    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "カートが空です" }, { status: 400 });
    }

    // Fetch latest prices by IDs from DB
    const uniqueIds = Array.from(new Set(items.map((i) => i.id)));
    const dbItems = await prisma.menuItem.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true, price: true, available: true },
    });
    if (dbItems.length !== uniqueIds.length) {
        return NextResponse.json(
            { error: "存在しないメニューが含まれています" },
            { status: 400 },
        );
    }
    const map = new Map(dbItems.map((m) => [m.id, m]));

    // Build order items from DB prices and recalc total with Decimal
    let total = new Decimal(0);
    const orderItemsData = items.map((it) => {
        const mi = map.get(it.id);
        if (!mi) throw new Error("メニューが見つかりません");
        if (mi.available === false)
            throw new Error("販売停止中の商品が含まれています");
        if (!Number.isInteger(it.quantity) || it.quantity <= 0)
            throw new Error("数量が不正です");

        total = total.add(new Decimal(mi.price.toString()).mul(it.quantity));
        return {
            menuItemId: it.id,
            quantity: it.quantity,
            price: mi.price,
            note: it.note ?? "",
        };
    });
    const totalDecimal = total.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    // Create order with trusted values
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            total: totalDecimal.toFixed(2),
            status: "PENDING",
            paymentStatus: "PENDING",
            paymentMethod: "CARD",
            tableNumber,
            note: note ?? "",
            orderItems: { create: orderItemsData },
        },
    });

    return NextResponse.json({ order });
}
