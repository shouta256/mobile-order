import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { deleteOrder } from "./actions";

export default async function AdminOrdersPage() {
	await requireStaff();

	const ordersRaw = await prisma.order.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			user: true,
			orderItems: { include: { menuItem: true } },
		},
	});

	// Decimal → number 変換
	const orders = ordersRaw.map((o) => ({
		...o,
		total: o.total.toNumber?.() ?? (o.total as number),
		orderItems: o.orderItems.map((oi) => ({
			...oi,
			price: oi.price.toNumber?.() ?? (oi.price as number),
		})),
	}));

	// 注文ステータスに応じた色とラベルのマッピング
	const statusConfig = {
		PENDING: { color: "bg-yellow-100 text-yellow-800", label: "未処理" },
		PREPARING: { color: "bg-blue-100 text-blue-800", label: "準備中" },
		READY: { color: "bg-purple-100 text-purple-800", label: "準備完了" },
		DELIVERED: { color: "bg-indigo-100 text-indigo-800", label: "配達済み" },
		COMPLETED: { color: "bg-green-100 text-green-800", label: "完了" },
		CANCELLED: { color: "bg-red-100 text-red-800", label: "キャンセル" },
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-800">オーダー一覧</h1>
				<div className="text-sm text-gray-500">{orders.length} 件の注文</div>
			</div>

			{orders.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-12 w-12 mx-auto text-gray-400 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
					<p className="text-lg text-gray-600">まだ注文がありません。</p>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<div
							key={order.id}
							className="bg-white rounded-lg shadow overflow-hidden"
						>
							{/* ヘッダー部分 */}
							<div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b">
								<div className="flex items-center space-x-4">
									{/* テーブル番号を目立たせる */}
									<div className="flex-shrink-0">
										<div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
											<span className="text-xl font-bold text-indigo-700">
												{order.tableNumber || "-"}
											</span>
										</div>
										<div className="text-xs text-center mt-1 font-medium text-gray-500">
											テーブル
										</div>
									</div>

									<div>
										<div className="text-gray-700 font-medium">
											{order.user?.email ? (
												<>
													<span className="text-gray-900">
														{order.user.email}
													</span>
												</>
											) : (
												<span className="text-gray-500">顧客情報なし</span>
											)}
										</div>
										<div className="text-sm text-gray-500">
											{order.createdAt.toLocaleDateString()}{" "}
											{order.createdAt.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-3">
									{/* ステータスバッジ */}
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color || "bg-gray-100 text-gray-800"}`}
									>
										{statusConfig[order.status]?.label || order.status}
									</span>

									{/* 合計金額 */}
									<div className="text-lg font-bold text-gray-800">
										¥{order.total.toFixed(2)}
									</div>
								</div>
							</div>

							{/* 注文アイテム一覧 */}
							<div className="px-6 py-4">
								<h3 className="text-sm font-medium text-gray-500 mb-3">
									注文内容
								</h3>
								<ul className="divide-y divide-gray-100">
									{order.orderItems.map((item) => (
										<li key={item.id} className="py-2 flex justify-between">
											<div className="flex items-center">
												<span className="text-gray-800">
													{item.menuItem.name}
												</span>
												<span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
													×{item.quantity}
												</span>
											</div>
											<span className="text-gray-700 font-medium">
												¥{(item.price * item.quantity).toFixed(2)}
											</span>
										</li>
									))}
								</ul>
							</div>

							{/* アクションエリア */}
							{order.status === "COMPLETED" ? (
								<div className="bg-green-50 px-6 py-3 border-t border-green-100">
									<p className="text-sm text-green-600 font-medium flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 mr-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										完了済み
									</p>
								</div>
							) : (
								<div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
									<span className="text-sm text-gray-500">
										注文ID: {order.id.substring(0, 8)}...
									</span>

									<div className="flex items-center gap-3">
										{/* 修正ボタン */}
										<a
											href={`/admin/orders/${order.id}`}
											className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
										>
											修正
										</a>

										{/* 削除ボタン */}
										<form action={deleteOrder}>
											<input type="hidden" name="id" value={order.id} />
											<button
												type="submit"
												className="px-4 py-2 bg-white border border-red-600 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
											>
												削除
											</button>
										</form>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
