import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	// ────────────────────────────────
	// 1) 管理者（ADMIN）ユーザーをシード
	// ────────────────────────────────
	const adminEmail = "admin@example.com";
	const adminPlainPassword = "AdminPass123"; // 好きなパスワードに変更してください
	const adminHash = await bcrypt.hash(adminPlainPassword, 10);

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {},
		create: {
			email: adminEmail,
			name: "店舗スタッフ（管理者）",
			password: adminHash,
			role: "ADMIN",
		},
	});
	console.log(`✅ Admin user seeded: ${adminEmail} / ${adminPlainPassword}`);

	// ────────────────────────────────
	// 2) デモ用カスタマーをシード
	// ────────────────────────────────
	const customerEmail = "customer@example.com";
	const customerPlainPassword = "Customer123";
	const customerHash = await bcrypt.hash(customerPlainPassword, 10);

	const customer = await prisma.user.upsert({
		where: { email: customerEmail },
		update: {},
		create: {
			email: customerEmail,
			name: "デモカスタマー",
			password: customerHash,
			role: "CUSTOMER",
		},
	});
	console.log(
		`✅ Customer user seeded: ${customerEmail} / ${customerPlainPassword}`,
	);

	// ────────────────────────────────
	// 3) カテゴリデータ
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

	const allMenuItems = await prisma.menuItem.findMany();
	if (allMenuItems.length === 0) {
		throw new Error(
			"メニューアイテムが見つかりません。先にメニューシードを実行してください。",
		);
	}

	// ────────────────────────────────
	// 4) 過去7日間のデモ売上データを生成
	// ────────────────────────────────
	const today = new Date();
	for (let i = 1; i <= 7; i++) {
		const orderDate = new Date(today);
		orderDate.setDate(today.getDate() - i);

		// ランダムに2～4アイテムを選択
		const shuffled = allMenuItems.sort(() => 0.5 - Math.random());
		const orderItemsData = shuffled
			.slice(0, Math.floor(Math.random() * 3) + 2)
			.map((item) => {
				const qty = Math.floor(Math.random() * 3) + 1;
				return {
					menuItemId: item.id,
					quantity: qty,
					price: item.price,
					note: null,
				};
			});
		const totalAmount = orderItemsData.reduce(
			(sum, oi) => sum + Number(oi.price) * oi.quantity,
			0,
		);

		await prisma.order.create({
			data: {
				userId: customer.id,
				tableNumber: `T${i}`,
				status: "COMPLETED",
				paymentStatus: "PAID",
				paymentMethod: "CARD",
				note: null,
				total: totalAmount,
				createdAt: orderDate,
				orderItems: {
					create: orderItemsData,
				},
			},
		});
	}

	// ────────────────────────────────
	// 5) デフォルトのデザインを生成
	// ────────────────────────────────
	const exists = await prisma.siteSetting.findFirst();
	if (!exists) {
		await prisma.siteSetting.create({
			data: {
				storeName: "My Restaurant",
				heroText1: "ハンバーガーで、",
				heroText2: "今日をもっとおいしく。",
				heroText3: "産地直送の食材で毎日手づくり。ぜひお試しください！",
				primaryColor: "#ff7a00",
				heroImage:
					"https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg",
			},
		});
	}
	console.log("✅ 過去7日間のデモ売上データを生成しました");
}

main()
	.catch((e) => {
		console.error("❌ シード中にエラーが発生しました:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
