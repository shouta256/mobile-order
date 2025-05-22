// app/(customer)/orders/page.tsx
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Decimal } from "@prisma/client/runtime/library";

/** 「xx 分前 / xx 時間前」を Intl で生成（日本語）*/
const rtf = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });
function formatRelative(date: Date) {
	const diffSec = Math.round((Date.now() - date.getTime()) / 1_000);
	const minutes = Math.floor(diffSec / 60);
	if (minutes < 60) return rtf.format(-minutes, "minute");
	const hours = Math.floor(minutes / 60);
	return rtf.format(-hours, "hour");
}

/** 本日 00:00 (Asia/Tokyo) */
function getTodayStart(): Date {
	const nowJst = new Date(
		new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
	);
	nowJst.setHours(0, 0, 0, 0);
	return nowJst;
}

function normalizeOrders<
	T extends {
		id: string;
		total: Decimal;
		createdAt: Date;
		tableNumber: string;
		orderItems: {
			id: string;
			quantity: number;
			price: Decimal;
			menuItem: { name: string; thumbnail: string | null };
		}[];
	}[],
>(raw: T) {
	return raw.map((o) => ({
		...o,
		total: o.total.toNumber(),
		orderItems: o.orderItems.map((oi) => ({
			...oi,
			price: oi.price.toNumber(),
		})),
	})) as unknown as {
		id: string;
		total: number;
		createdAt: Date;
		tableNumber: string;
		orderItems: {
			id: string;
			quantity: number;
			price: number;
			menuItem: { name: string; thumbnail: string | null };
		}[];
	}[];
}

export default async function OrdersPage() {
	const user = await getCurrentUser();
	if (!user) throw new Error("ログインが必要です");

	const todayStart = getTodayStart();
	const [todayRaw, pastRaw] = await Promise.all([
		prisma.order.findMany({
			where: { userId: user.id, createdAt: { gte: todayStart } },
			orderBy: { createdAt: "desc" },
			include: { orderItems: { include: { menuItem: true } } },
		}),
		prisma.order.findMany({
			where: { userId: user.id, createdAt: { lt: todayStart } },
			orderBy: { createdAt: "desc" },
			include: { orderItems: { include: { menuItem: true } } },
		}),
	]);

	const todayOrders = normalizeOrders(todayRaw);
	const pastOrders = normalizeOrders(pastRaw);

	const Section = ({
		title,
		list,
	}: {
		title: string;
		list: typeof todayOrders;
	}) => (
		<>
			<h2 className="text-xl font-semibold mb-4">{title}</h2>
			{list.length === 0 ? (
				<p className="mb-8 text-gray-500">該当する注文がありません。</p>
			) : (
				<div className="space-y-8 mb-10">
					{list.map((order) => (
						<div key={order.id} className="border p-4 rounded-lg">
							{/* ヘッダー（日時 & 合計） */}
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

							{/* テーブル番号 */}
							<p className="mb-2 text-xs text-gray-500">
								テーブル番号: {order.tableNumber}
							</p>

							{/* アイテム一覧 */}
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
												sizes="40px"
											/>
										) : (
											<div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
												–
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
