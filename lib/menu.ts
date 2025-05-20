// lib/menu.ts
import { prisma } from "./db";

type MenuItem = {
	id: string;
	name: string;
	description: string | null;
	price: number;
	image: string | null;
	thumbnail: string | null;
	available: boolean;
	featured: boolean;
	category: { id: string; name: string };
	createdAt: Date;
	updatedAt: Date;
};

export async function getFeaturedMenuItems() {
	// 「featured: true」を追加。available も念のため絞っておく
	const raw = await prisma.menuItem.findMany({
		where: { featured: true, available: true },
		orderBy: { createdAt: "desc" },
		take: 6, // 最大何件見せたいか
		include: { category: true }, // カテゴリ名も欲しいなら
	});

	// Decimal → number に変換
	return raw.map((item) => ({
		...item,
		price:
			typeof item.price.toNumber === "function"
				? item.price.toNumber()
				: Number(item.price),
	}));
}

export async function getMenuItems(): Promise<MenuItem[]> {
	const items = await prisma.menuItem.findMany({
		where: { available: true },
		include: { category: true }, // ← カテゴリを含める
		orderBy: { name: "asc" },
	});

	return items.map((item) => ({
		id: item.id,
		name: item.name,
		description: item.description,
		price: item.price.toNumber(),
		image: item.image,
		thumbnail: item.thumbnail,
		available: item.available,
		featured: item.featured,
		category: {
			id: item.category.id,
			name: item.category.name,
		},
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	}));
}

export async function getMenuItem(id: string): Promise<MenuItem | null> {
	const item = await prisma.menuItem.findUnique({
		where: { id },
		include: { category: true }, // ← カテゴリを含める
	});
	if (!item) return null;

	return {
		id: item.id,
		name: item.name,
		description: item.description,
		price: item.price.toNumber(),
		image: item.image,
		thumbnail: item.thumbnail,
		available: item.available,
		featured: item.featured,
		category: {
			id: item.category.id,
			name: item.category.name,
		},
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	};
}
