// app/(admin)/admin/orders/actions.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";

/** OrderEditForm.tsx から呼ばれている関数名に合わせる */
export async function updateOrderDetail(formData: FormData) {
	const orderId = formData.get("id")?.toString();
	const statusRaw = formData.get("status")?.toString();
	const tableNumber = formData.get("tableNumber")?.toString();

	if (!orderId || !statusRaw || !tableNumber) {
		throw new Error("必要なフィールドがありません");
	}
	const status = statusRaw as OrderStatus;

	await prisma.order.update({
		where: { id: orderId },
		data: { tableNumber, status },
	});

	revalidatePath("/admin/orders");
}

/** page.tsx から呼ばれている名前に合わせる */
export async function deleteOrder(formData: FormData) {
	const orderId = formData.get("id")?.toString();
	if (!orderId) throw new Error("ID がありません");

	await prisma.order.delete({ where: { id: orderId } });
	revalidatePath("/admin/orders");
}
