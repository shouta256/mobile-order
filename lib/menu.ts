// lib/menu.ts
import { prisma } from "./db";

export type MenuItem = {
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
	// Only take featured items and check availability
	const raw = await prisma.menuItem.findMany({
		where: { featured: true, available: true },
		orderBy: { createdAt: "desc" },
		take: 6, // Limit how many we show
		include: { category: true }, // Include category name when needed
	});

	// Convert Decimal to number
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
		include: { category: true }, // Include category
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
		include: { category: true }, // Include category
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
