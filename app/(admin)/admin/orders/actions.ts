// app/(admin)/admin/orders/actions.ts
"use server";

import Decimal from "decimal.js";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { requireStaff } from "@/lib/auth";

/** OrderEditForm.tsx から呼ばれている関数名に合わせる */
export async function updateOrderDetail(formData: FormData) {
  // 権限チェック（STAFF/ADMIN）
  await requireStaff();

  const orderId = formData.get("id")?.toString();
  const statusRaw = formData.get("status")?.toString();
  const tableNumber = formData.get("tableNumber")?.toString();

  if (!orderId || !statusRaw || !tableNumber) {
    throw new Error("必要なフィールドがありません");
  }
  const status = statusRaw as OrderStatus;

  // itemIds は複数回の同名キーで送られてくる
  const itemIds = formData.getAll("itemIds").map((v) => v.toString());

  // 数量のマップを作成（0 は削除対象とみなす）
  const quantityMap: Record<string, number> = {};
  for (let i = 0; i < itemIds.length; i++) {
    const id = itemIds[i];
    const raw = formData.get(`quantity-${id}`)?.toString();
    const qty = raw ? Number.parseInt(raw, 10) : NaN;
    if (!Number.isFinite(qty) || qty < 0) {
      throw new Error("数量が不正です");
    }
    quantityMap[id] = qty;
  }

  // 価格取得（合計再計算用）
  const itemsForPricing = await prisma.orderItem.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, price: true },
  });

  // 合計を Decimal で再計算
  let total = new Decimal(0);
  for (let i = 0; i < itemsForPricing.length; i++) {
    const it = itemsForPricing[i];
    const qty = quantityMap[it.id] ?? 0;
    if (qty > 0) {
      total = total.add(new Decimal(it.price.toString()).mul(qty));
    }
  }
  const totalDecimal = total.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // 一括トランザクション：数量更新/削除 + 注文の基本情報更新 + 合計更新
  await prisma.$transaction(async (tx) => {
    // 更新と削除を並列実行
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

    // 注文のステータス/テーブル番号/合計更新
    await tx.order.update({
      where: { id: orderId },
      data: { tableNumber, status, total: totalDecimal.toFixed(2) },
    });
  });

  revalidatePath("/admin/orders");
}

/** page.tsx から呼ばれている名前に合わせる */
export async function deleteOrder(formData: FormData) {
  // 権限チェック（STAFF/ADMIN）
  await requireStaff();
  const orderId = formData.get("id")?.toString();
  if (!orderId) throw new Error("ID がありません");

  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}
