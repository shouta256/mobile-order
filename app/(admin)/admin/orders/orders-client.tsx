// app/(admin)/admin/orders/orders-client.tsx
"use client";

import React from "react";

export interface OrderItem {
	id: string;
	quantity: number;
	price: number;
	note: string | null;
	menuItem: {
		id: string;
		name: string;
		thumbnail: string | null;
		price: number;
	};
}

export interface Order {
	id: string;
	total: number;
	status: string;
	paymentStatus: string;
	tableNumber: string;
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	orderItems: OrderItem[];
}

interface Props {
	orders: Order[];
}

export default function AdminOrdersClient({ orders }: Props) {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Orders</h1>
			<table className="w-full table-auto border-collapse">
				<thead>
					<tr className="bg-gray-100">
						<th className="p-2">ID</th>
						<th className="p-2">Total</th>
						<th className="p-2">Status</th>
						<th className="p-2">Payment</th>
						<th className="p-2">Table</th>
						<th className="p-2">Date / Time</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((o) => (
						<tr key={o.id} className="border-t">
							<td className="p-2">{o.id}</td>
							<td className="p-2">¥{o.total.toFixed(0)}</td>
							<td className="p-2">{o.status}</td>
							<td className="p-2">{o.paymentStatus}</td>
							<td className="p-2">{o.tableNumber}</td>
							<td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
