// app/(admin)/admin/orders/actions.ts
"use server";

import Decimal from "decimal.js";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { requireStaff } from "@/lib/auth";

/** OrderEditForm.tsx から呼ばれている関数名に合わせる */
export async function updateOrderDetail(formData: FormData) {
  // Check STAFF or ADMIN role
  await requireStaff();

  const orderId = formData.get("id")?.toString();
  const statusRaw = formData.get("status")?.toString();
  const tableNumber = formData.get("tableNumber")?.toString();

  if (!orderId || !statusRaw || !tableNumber) {
    throw new Error("必要なフィールドがありません");
  }
  const status = statusRaw as OrderStatus;

  // itemIds comes multiple times with same key
  const itemIds = formData.getAll("itemIds").map((v) => v.toString());

  // Build quantity map (0 means delete)
  const quantityMap: Record<string, number> = {};
  for (let i = 0; i < itemIds.length; i++) {
    const id = itemIds[i];
    const raw = formData.get(`quantity-${id}`)?.toString();
    const qty = raw ? Number.parseInt(raw, 10) : Number.NaN;
    if (!Number.isFinite(qty) || qty < 0) {
      throw new Error("数量が不正です");
    }
    quantityMap[id] = qty;
  }

  // Load prices to recalc total
  const itemsForPricing = await prisma.orderItem.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, price: true },
  });

  // Recalculate total with Decimal
  let total = new Decimal(0);
  for (let i = 0; i < itemsForPricing.length; i++) {
    const it = itemsForPricing[i];
    const qty = quantityMap[it.id] ?? 0;
    if (qty > 0) {
      total = total.add(new Decimal(it.price.toString()).mul(qty));
    }
  }
  const totalDecimal = total.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // Transaction: update or delete items and refresh order
  await prisma.$transaction(async (tx) => {
    // Handle updates and deletes
    const updatePromises: Promise<unknown>[] = [];
    const toDelete: string[] = [];

    for (const id in quantityMap) {
      const qty = quantityMap[id];
      if (qty > 0) {
        updatePromises.push(
          tx.orderItem.update({ where: { id }, data: { quantity: qty } }),
        );
      } else if (qty === 0) {
        toDelete.push(id);
      }
    }

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    if (toDelete.length > 0) {
      await tx.orderItem.deleteMany({ where: { id: { in: toDelete } } });
    }

    // Update order status, table, total
    await tx.order.update({
      where: { id: orderId },
      data: { tableNumber, status, total: totalDecimal.toFixed(2) },
    });
  });

  revalidatePath("/admin/orders");
}

/** page.tsx から呼ばれている名前に合わせる */
export async function deleteOrder(formData: FormData) {
  // Check STAFF or ADMIN role
  await requireStaff();
  const orderId = formData.get("id")?.toString();
  if (!orderId) throw new Error("ID がありません");

  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}
