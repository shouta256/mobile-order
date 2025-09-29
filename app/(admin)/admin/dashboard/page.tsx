import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
	await requireAdmin();

	const [
		totalOrders,
		pendingOrders,
		currentCustomers,
		revenueAgg,
		totalCustomers,
	] = await Promise.all([
		prisma.order.count(),
		prisma.order.count({ where: { status: "PENDING" } }),
		prisma.order
			.groupBy({ by: ["tableNumber"], where: { status: "PENDING" } })
			.then((g) => g.length),
		prisma.order.aggregate({
			_sum: { total: true },
			where: { paymentStatus: "PAID" },
		}),
		prisma.user.count({ where: { role: "CUSTOMER" } }),
	]);

	const popularItemsRaw = await prisma.orderItem.groupBy({
		by: ["menuItemId"],
		_sum: { quantity: true },
		orderBy: { _sum: { quantity: "desc" } },
		take: 5,
	});

	type PopularItem = (typeof popularItemsRaw)[number];
	const popularItems: PopularItem[] = popularItemsRaw;

	const menuItems = await prisma.menuItem.findMany({
		where: { id: { in: popularItems.map((p) => p.menuItemId) } },
		select: { id: true, name: true },
	});

	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const [paidOrders, recentOrdersRaw] = await Promise.all([
		prisma.order.findMany({
			where: { createdAt: { gte: sevenDaysAgo }, paymentStatus: "PAID" },
			select: { createdAt: true, total: true },
			orderBy: { createdAt: "asc" },
		}),
		prisma.order.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			include: { user: true, orderItems: { include: { menuItem: true } } },
		}),
	]);

	const salesByDate = new Map<string, { sales: number; orders: number }>();
	for (const order of paidOrders) {
		const dateKey = order.createdAt
			.toISOString()
			.slice(0, 10); // yyyy-mm-dd
		const existing = salesByDate.get(dateKey) ?? { sales: 0, orders: 0 };
		salesByDate.set(dateKey, {
			sales: existing.sales + order.total.toNumber(),
			orders: existing.orders + 1,
		});
	}

	const salesData = Array.from(salesByDate.entries())
		.sort(([a], [b]) => (a < b ? -1 : 1))
		.map(([date, stats]) => ({
			date: new Date(date).toLocaleDateString(),
			sales: stats.sales,
			orders: stats.orders,
		}));

	const pieChartData = popularItems.map((p) => ({
		name: menuItems.find((m) => m.id === p.menuItemId)?.name ?? "Unknown",
		value: p._sum.quantity ?? 0,
	}));

	const recentOrders = recentOrdersRaw.map((order) => ({
		id: order.id,
		total: order.total.toNumber(),
		status: order.status,
		paymentStatus: order.paymentStatus,
		tableNumber: order.tableNumber ?? "-",
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
		<DashboardClient
			totalOrders={totalOrders}
			pendingOrders={pendingOrders}
			currentCustomers={currentCustomers}
			totalRevenue={revenueAgg._sum.total?.toNumber() ?? 0}
			totalCustomers={totalCustomers}
			salesData={salesData}
			pieChartData={pieChartData}
			recentOrders={recentOrders}
		/>
	);
}
