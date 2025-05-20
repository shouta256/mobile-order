// app/(admin)/admin/orders/[id]/page.tsx
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { notFound } from "next/navigation";
import OrderEditForm from "@/components/admin/OrderEditForm";

interface Params {
	id: string;
}

export default async function OrderEditPage({ params }: { params: Params }) {
	// STAFF または ADMIN でないなら 404
	await requireStaff();

	// 注文データ取得
	const orderRaw = await prisma.order.findUnique({
		where: { id: params.id },
		include: { orderItems: { include: { menuItem: true } } },
	});
	if (!orderRaw) return notFound();

	// Decimal → number
	const order = {
		id: orderRaw.id,
		tableNumber: orderRaw.tableNumber ?? "",
		status: orderRaw.status,
		items: orderRaw.orderItems.map((oi) => ({
			id: oi.id,
			name: oi.menuItem.name,
			quantity: oi.quantity,
		})),
	};

	// Client Component に投げる
	return <OrderEditForm order={order} />;
}
