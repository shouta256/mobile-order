// app/(admin)/admin/menu/page.tsx
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MenuManagerClient from "./MenuManagerClient";

export default async function AdminMenuPage() {
	// Check admin role
	await requireAdmin();

	// Get menu items
	const rawItems = await prisma.menuItem.findMany({
		orderBy: { createdAt: "desc" },
	});
	// Convert Decimal to number
	const items = rawItems.map((item) => ({
		...item,
		price:
			typeof item.price.toNumber === "function"
				? item.price.toNumber()
				: Number(item.price),
	}));

	// Get category list
	const rawCategories = await prisma.category.findMany({
		orderBy: { order: "asc" },
	});
	const categories = rawCategories.map((c) => ({
		id: c.id,
		name: c.name,
	}));

	return <MenuManagerClient items={items} categories={categories} />;
}
