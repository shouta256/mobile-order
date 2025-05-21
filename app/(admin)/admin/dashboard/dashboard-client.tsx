// app/(admin)/admin/dashboard/dashboard-client.tsx
"use client";

import SalesChart from "@/components/admin/SalesChart";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface SalesDataPoint {
	date: string;
	sales: number;
	orders: number;
}

interface PieDataPoint {
	name: string;
	value: number;
}

interface RecentOrderItem {
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

interface RecentOrder {
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
	orderItems: RecentOrderItem[];
}

interface Props {
	totalOrders: number;
	pendingOrders: number;
	currentCustomers: number;
	totalRevenue: number;
	totalCustomers: number;
	salesData: SalesDataPoint[];
	pieChartData: PieDataPoint[];
	recentOrders: RecentOrder[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

export default function AdminDashboardClient({
	totalOrders,
	pendingOrders,
	currentCustomers,
	totalRevenue,
	totalCustomers,
	salesData,
	pieChartData,
	recentOrders,
}: Props) {
	return (
		<div className="p-8 space-y-12">
			{/* 概要 */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="p-6 bg-white rounded shadow">
					<h3 className="text-sm text-gray-500">総注文数</h3>
					<p className="text-3xl font-bold">{totalOrders}</p>
				</div>
				<div className="p-6 bg-white rounded shadow">
					<h3 className="text-sm text-gray-500">未完了注文</h3>
					<p className="text-3xl font-bold">{pendingOrders}</p>
				</div>
				<div className="p-6 bg-white rounded shadow">
					<h3 className="text-sm text-gray-500">現在の客数</h3>
					<p className="text-3xl font-bold">{currentCustomers}</p>
				</div>
				<div className="p-6 bg-white rounded shadow">
					<h3 className="text-sm text-gray-500">総売上</h3>
					<p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
				</div>
			</div>

			{/* 売上グラフ */}
			<SalesChart
				salesData={salesData.map(({ date, sales }) => ({ date, sales }))}
			/>

			{/* 人気メニュー */}
			<div className="p-6 bg-white rounded shadow">
				<h3 className="mb-4 font-medium">人気メニュー上位5</h3>
				<ResponsiveContainer width="100%" height={200}>
					<PieChart>
						<Pie
							data={pieChartData}
							dataKey="value"
							nameKey="name"
							outerRadius={80}
							label
						>
							{pieChartData.map((_, idx) => (
								<Cell key={idx} fill={COLORS[idx % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</div>

			{/* 最近の注文 */}
			<div className="p-6 bg-white rounded shadow">
				<h3 className="mb-4 font-medium">最近の注文</h3>
				<table className="w-full text-left">
					<thead>
						<tr>
							<th className="py-2">日時</th>
							<th className="py-2">テーブル</th>
							<th className="py-2">合計</th>
							<th className="py-2">ステータス</th>
						</tr>
					</thead>
					<tbody>
						{recentOrders.map((order) => (
							<tr key={order.id} className="border-t">
								<td className="py-2">
									{new Date(order.createdAt).toLocaleString()}
								</td>
								<td className="py-2">{order.tableNumber}</td>
								<td className="py-2">${order.total.toFixed(2)}</td>
								<td className="py-2">{order.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
