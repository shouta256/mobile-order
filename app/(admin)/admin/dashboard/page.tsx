// app/(admin)/admin/dashboard/page.tsx
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminDashboardClient from "./dashboard-client";

export default async function AdminDashboardPage() {
	// 管理者チェック
	await requireAdmin();

	// 全注文数
	const totalOrders = await prisma.order.count();

	// 未完了注文数
	const pendingOrders = await prisma.order.count({
		where: { status: "PENDING" },
	});

	// 現在の客数（未完了オーダーのテーブル番号ごとに 1 件とみなす）
	const tableGroups = await prisma.order.groupBy({
		by: ["tableNumber"],
		where: { status: "PENDING" },
	});
	const currentCustomers = tableGroups.length;

	// 総売上（支払い済みの合計金額）
	const revenueAgg = await prisma.order.aggregate({
		_sum: { total: true },
		where: { paymentStatus: "PAID" },
	});
	const totalRevenue = revenueAgg._sum.total?.toNumber() ?? 0;

	// 顧客総数（CUSTOMER ロールのユーザー数）
	const totalCustomers = await prisma.user.count({
		where: { role: "CUSTOMER" },
	});

	// 過去7日間の日次売上データ
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	const dailySales = await prisma.order.groupBy({
		by: ["createdAt"],
		where: {
			createdAt: { gte: sevenDaysAgo },
			paymentStatus: "PAID",
		},
		_sum: { total: true },
		_count: true,
		orderBy: { createdAt: "asc" },
	});
	const salesData = dailySales.map((d) => ({
		date: d.createdAt.toLocaleDateString(),
		sales: d._sum.total?.toNumber() ?? 0,
		orders: d._count,
	}));

	// 人気メニューアイテム上位5
	const popularItems = await prisma.orderItem.groupBy({
		by: ["menuItemId"],
		_sum: { quantity: true },
		orderBy: { _sum: { quantity: "desc" } },
		take: 5,
	});
	const menuItems = await prisma.menuItem.findMany({
		where: { id: { in: popularItems.map((p) => p.menuItemId) } },
	});
	const pieChartData = popularItems.map((p) => {
		const mi = menuItems.find((m) => m.id === p.menuItemId);
		return {
			name: mi?.name ?? "Unknown",
			value: p._sum.quantity ?? 0, // ← ここを修正
		};
	});

	// 最近の注文5件
	const recentOrdersRaw = await prisma.order.findMany({
		take: 5,
		orderBy: { createdAt: "desc" },
		include: {
			user: true,
			orderItems: { include: { menuItem: true } },
		},
	});
	const recentOrders = recentOrdersRaw.map((order) => ({
		id: order.id,
		total: order.total.toNumber(),
		status: order.status,
		paymentStatus: order.paymentStatus,
		tableNumber: order.tableNumber,
		createdAt: order.createdAt.toISOString(),
		user: {
			id: order.user.id,
			name: order.user.name ?? "",
			email: order.user.email ?? "",
		},
		orderItems: order.orderItems.map((oi) => ({
			id: oi.id,
			quantity: oi.quantity,
			price: oi.price.toNumber(),
			note: oi.note,
			menuItem: {
				id: oi.menuItem.id,
				name: oi.menuItem.name,
				thumbnail: oi.menuItem.thumbnail,
				price: oi.menuItem.price.toNumber(),
			},
		})),
	}));

	return (
		<AdminDashboardClient
			totalOrders={totalOrders}
			pendingOrders={pendingOrders}
			currentCustomers={currentCustomers}
			totalRevenue={totalRevenue}
			totalCustomers={totalCustomers}
			salesData={salesData}
			pieChartData={pieChartData}
			recentOrders={recentOrders}
		/>
	);
}
