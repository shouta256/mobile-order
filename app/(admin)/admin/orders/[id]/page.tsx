// app/(admin)/admin/orders/[id]/page.tsx
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { notFound } from "next/navigation";
import OrderEditForm from "@/components/admin/OrderEditForm";

interface Params {
	id: string;
}

export default async function OrderEditPage({ params }: { params: Promise<Params> }) {
	// Only STAFF or ADMIN can see this page
	await requireStaff();

	// Load order data
	const { id } = await params;
	const orderRaw = await prisma.order.findUnique({
		where: { id },
		include: { orderItems: { include: { menuItem: true } } },
	});
	if (!orderRaw) return notFound();

	// Convert Decimal to number
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

	// Pass to client component
	return <OrderEditForm order={order} />;
}
