// app/(admin)/admin/menu/page.tsx
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MenuManagerClient from "./MenuManagerClient";

export default async function AdminMenuPage() {
	// 管理者チェック
	await requireAdmin();

	// メニューアイテム取得
	const rawItems = await prisma.menuItem.findMany({
		orderBy: { createdAt: "desc" },
	});
	// Decimal → number
	const items = rawItems.map((item) => ({
		...item,
		price:
			typeof item.price.toNumber === "function"
				? item.price.toNumber()
				: Number(item.price),
	}));

	// カテゴリ一覧取得
	const rawCategories = await prisma.category.findMany({
		orderBy: { order: "asc" },
	});
	const categories = rawCategories.map((c) => ({
		id: c.id,
		name: c.name,
	}));

	return <MenuManagerClient items={items} categories={categories} />;
}
