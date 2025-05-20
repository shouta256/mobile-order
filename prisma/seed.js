import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	// ────────────────────────────────
	// 1) 管理者（STAFF）ユーザーをシード
	// ────────────────────────────────
	const adminEmail = "admin@example.com";
	const adminPlainPassword = "AdminPass123"; // 好きなパスワードに変更してください
	const adminHash = await bcrypt.hash(adminPlainPassword, 10);

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {}, // 既に存在する場合は何もしない
		create: {
			email: adminEmail,
			name: "店舗スタッフ（管理者）",
			password: adminHash,
			role: "ADMIN", // Prisma スキーマで @default("CUSTOMER") としている想定
			// 必要に応じて他フィールドも追加 (image, emailVerified など)
		},
	});
	console.log(`✅ Admin user seeded: ${adminEmail} / ${adminPlainPassword}`);

	// ────────────────────────────────
	// 2) カテゴリデータ
	// ────────────────────────────────
	const categoriesData = [
		{ name: "Burgers", description: "Juicy burgers made to order", order: 1 },
		{ name: "Pizzas", description: "Authentic Italian pizzas", order: 2 },
		{ name: "Drinks", description: "Cold and refreshing beverages", order: 3 },
	];

	for (const data of categoriesData) {
		const exists = await prisma.category.findFirst({
			where: { name: data.name },
		});
		if (!exists) {
			await prisma.category.create({ data });
		}
	}

	const burgerCat = await prisma.category.findFirst({
		where: { name: "Burgers" },
	});
	const pizzaCat = await prisma.category.findFirst({
		where: { name: "Pizzas" },
	});
	const drinksCat = await prisma.category.findFirst({
		where: { name: "Drinks" },
	});

	if (!burgerCat || !pizzaCat || !drinksCat) {
		throw new Error("カテゴリの取得に失敗しました");
	}

	// ────────────────────────────────
	// 3) メニューアイテムデータ
	// ────────────────────────────────
	const menuItemsData = [
		{
			name: "Classic Cheeseburger",
			description: "Beef patty with cheddar, lettuce, tomato & pickles",
			price: 8.99,
			categoryId: burgerCat.id,
			available: true,
			featured: true,
		},
		{
			name: "Veggie Burger",
			description: "Grilled veggie patty with avocado spread",
			price: 9.49,
			categoryId: burgerCat.id,
			available: true,
			featured: false,
		},
		{
			name: "Margherita Pizza",
			description: "Tomato, mozzarella, fresh basil",
			price: 12.99,
			categoryId: pizzaCat.id,
			available: true,
			featured: true,
		},
		{
			name: "Pepperoni Pizza",
			description: "Classic pepperoni & cheese",
			price: 14.49,
			categoryId: pizzaCat.id,
			available: true,
			featured: false,
		},
		{
			name: "Cola",
			description: "Sparkling soft drink",
			price: 1.99,
			categoryId: drinksCat.id,
			available: true,
			featured: false,
		},
		{
			name: "Orange Juice",
			description: "Freshly squeezed orange juice",
			price: 2.99,
			categoryId: drinksCat.id,
			available: true,
			featured: false,
		},
	];

	for (const item of menuItemsData) {
		const exists = await prisma.menuItem.findFirst({
			where: { name: item.name },
		});
		if (!exists) {
			await prisma.menuItem.create({ data: item });
		}
	}

	console.log("✅ シードデータの投入が完了しました");
}

main()
	.catch((e) => {
		console.error("❌ シード中にエラーが発生しました:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
