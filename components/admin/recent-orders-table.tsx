// components/admin/recent-orders-table.tsx
"use client";

import React from "react";
import type { FC } from "react";

interface RecentOrdersTableProps {
	orders: Array<{
		id: string;
		user: {
			name?: string | null;
			email: string;
		};
		tableNumber?: string;
		total: number;
		status: string;
		paymentStatus: string;
		createdAt: Date | string;
		orderItems: Array<{
			id: string;
			menuItem: {
				name: string;
			};
			quantity: number;
			price: number;
		}>;
	}>;
}

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ orders }) => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
							注文ID
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
							顧客
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
							テーブル番号
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
							合計
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
							ステータス
						</th>
						<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
							日時
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{orders.map((order) => (
						<tr key={order.id}>
							<td className="px-4 py-2 text-sm text-gray-700">{order.id}</td>
							<td className="px-4 py-2 text-sm text-gray-700">
								{order.user.name ?? order.user.email}
							</td>
							<td className="px-4 py-2 text-sm text-gray-700">
								{order.tableNumber ?? "-"}
							</td>
							<td className="px-4 py-2 text-sm text-gray-700">
								${order.total.toFixed(2)}
							</td>
							<td className="px-4 py-2 text-sm text-gray-700">
								{order.status}
							</td>
							<td className="px-4 py-2 text-sm text-gray-700">
								{new Date(order.createdAt).toLocaleString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default RecentOrdersTable;
