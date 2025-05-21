// app/(admin)/admin/orders/page.tsx
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import AdminOrdersClient from "./orders-client";

export default async function AdminOrdersPage() {
	// スタッフ・管理者判定
	await requireStaff();

	// 生のデータを取得
	const ordersRaw = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			user: true,
			orderItems: {
				include: { menuItem: true },
			},
		},
	});

	// Decimal → number 変換を必ず toNumber() で行う
	const orders = ordersRaw.map((o) => ({
		id: o.id,
		total: o.total.toNumber(),
		status: o.status,
		paymentStatus: o.paymentStatus,
		tableNumber: o.tableNumber,
		createdAt: o.createdAt.toISOString(),
		user: {
			id: o.user.id,
			name: o.user.name ?? "",
			email: o.user.email ?? "",
		},
		orderItems: o.orderItems.map((oi) => ({
			id: oi.id,
			quantity: oi.quantity,
			price: oi.price.toNumber(),
			note: oi.note,
			menuItem: {
				id: oi.menuItem.id,
				name: oi.menuItem.name,
				thumbnail: oi.menuItem.thumbnail,
				price: oi.menuItem.price.toNumber(),
			},
		})),
	}));

	return <AdminOrdersClient orders={orders} />;
}
