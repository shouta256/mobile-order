// app/(admin)/admin/dashboard/dashboard-client.tsx
"use client";

import SalesChart from "@/components/admin/SalesChart";
import React, { useMemo } from "react";
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

export default function DashboardClient(props: Props) {
	/** ▼ memo 化して再レンダー時の計算を回避 */
	const memoSales = useMemo(
		() => props.salesData.map(({ date, sales }) => ({ date, sales })),
		[props.salesData],
	);

	const memoPie = useMemo(() => props.pieChartData, [props.pieChartData]);

	return (
		<div className="p-8 space-y-12">
			{/* ─ 概要カード ─ */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{[
					{ l: "総注文数", v: props.totalOrders },
					{ l: "未完了注文", v: props.pendingOrders },
					{ l: "現在の客数", v: props.currentCustomers },
					{
						l: "総売上",
						v: `$${props.totalRevenue.toFixed(2)}`,
					},
				].map(({ l, v }) => (
					<div key={l} className="p-6 bg-white rounded shadow">
						<h3 className="text-sm text-gray-500">{l}</h3>
						<p className="text-3xl font-bold">{v}</p>
					</div>
				))}
			</div>

			{/* ─ 売上グラフ ─ */}
			<SalesChart salesData={memoSales} />

			{/* ─ 人気メニュー ─ */}
			<div className="p-6 bg-white rounded shadow">
				<h3 className="mb-4 font-medium">人気メニュー上位5</h3>
				<ResponsiveContainer width="100%" height={200}>
					<PieChart>
						<Pie
							data={memoPie}
							dataKey="value"
							nameKey="name"
							outerRadius={80}
							label
						>
							{memoPie.map((entry, i) => (
								<Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</div>

			{/* ─ 最近の注文 (軽量化のため 5 件だけ) ─ */}
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
						{props.recentOrders.map((o) => (
							<tr key={o.id} className="border-t">
								<td className="py-2">
									{new Date(o.createdAt).toLocaleString()}
								</td>
								<td className="py-2">{o.tableNumber}</td>
								<td className="py-2">¥{o.total.toFixed(0)}</td>
								<td className="py-2">{o.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
