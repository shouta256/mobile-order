// app/(customer)/orders/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Image from "next/image";

// 「何分前 / 何時間前」を計算
function formatRelative(date: Date) {
	const diffMs = Date.now() - date.getTime();
	const diffMin = Math.floor(diffMs / 1000 / 60);
	if (diffMin < 60) return `${diffMin} 分前`;
	const diffHr = Math.floor(diffMin / 60);
	return `${diffHr} 時間前`;
}

// 今日の 0:00（America/Chicago）を計算
function getTodayStart(): Date {
	const now = new Date();
	// オフセット -5 または -6（夏時間で変動）を考慮するために locale-string 経由
	const chicagoNow = new Date(
		now.toLocaleString("en-US", { timeZone: "America/Chicago" }),
	);
	chicagoNow.setHours(0, 0, 0, 0);
	return chicagoNow;
}

export default async function OrdersPage() {
	const user = await getCurrentUser();
	if (!user) throw new Error("ログインが必要です");

	const ordersRaw = await prisma.order.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: "desc" },
		include: { orderItems: { include: { menuItem: true } } },
	});

	// Decimal → number 変換
	const orders = ordersRaw.map((o) => ({
		...o,
		total: o.total.toNumber(),
		orderItems: o.orderItems.map((oi) => ({
			...oi,
			price: oi.price.toNumber(),
		})),
	}));

	const todayStart = getTodayStart();
	const todayOrders = orders.filter((o) => o.createdAt >= todayStart);
	const pastOrders = orders.filter((o) => o.createdAt < todayStart);

	const Section = ({
		title,
		list,
	}: {
		title: string;
		list: typeof orders;
	}) => (
		<>
			<h2 className="text-xl font-semibold mb-4">{title}</h2>
			{list.length === 0 ? (
				<p className="mb-8 text-gray-500">該当する注文がありません。</p>
			) : (
				<div className="space-y-8 mb-10">
					{list.map((order) => (
						<div key={order.id} className="border p-4 rounded-lg">
							<div className="flex justify-between mb-2 text-sm text-gray-600">
								{title === "今日の注文" ? (
									<span>{formatRelative(order.createdAt)}</span>
								) : (
									<span>
										{order.createdAt.toLocaleDateString()}{" "}
										{order.createdAt.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								)}
								<span className="font-semibold">
									合計: ¥{order.total.toFixed(2)}
								</span>
							</div>
							<p className="mb-2 text-xs text-gray-500">
								テーブル番号: {order.tableNumber}
							</p>
							<ul className="space-y-2">
								{order.orderItems.map((item) => (
									<li
										key={item.id}
										className="flex items-center space-x-4 text-sm"
									>
										{item.menuItem.thumbnail ? (
											<Image
												src={item.menuItem.thumbnail}
												alt={item.menuItem.name}
												width={40}
												height={40}
												className="rounded"
											/>
										) : (
											<div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
												−
											</div>
										)}
										<span className="flex-1">
											{item.menuItem.name} × {item.quantity}
										</span>
										<span>¥{(item.price * item.quantity).toFixed(2)}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			)}
		</>
	);

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">注文履歴</h1>
			<Section title="今日の注文" list={todayOrders} />
			<Section title="過去の注文" list={pastOrders} />
		</div>
	);
}
