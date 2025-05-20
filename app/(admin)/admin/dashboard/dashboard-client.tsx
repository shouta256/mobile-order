// app/(admin)/admin/dashboard/dashboard-client.tsx
"use client";

import React from "react";
import AnalyticsCards from "@/components/admin/analytics-cards";
import RecentOrdersTable from "@/components/admin/recent-orders-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell,
} from "recharts";

interface SalesDataPoint {
	date: string;
	sales: number;
	orders: number;
}

interface PieDataPoint {
	name: string;
	value: number;
}

interface Props {
	totalOrders: number;
	pendingOrders: number;
	totalRevenue: number;
	totalCustomers: number;
	salesData: SalesDataPoint[];
	pieChartData: PieDataPoint[];
	recentOrders: any[]; // 必要に応じて型定義を強化
}

const COLORS = ["#FF8C42", "#4ECDC4", "#FF3366", "#2C699A", "#F9C74F"];

export default function AdminDashboardClient({
	totalOrders,
	pendingOrders,
	totalRevenue,
	totalCustomers,
	salesData,
	pieChartData,
	recentOrders,
}: Props) {
	return (
		<div className="px-4 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Admin Dashboard</h1>
			</div>

			<AnalyticsCards
				totalOrders={totalOrders}
				pendingOrders={pendingOrders}
				totalRevenue={totalRevenue}
				totalCustomers={totalCustomers}
			/>

			<Tabs defaultValue="sales">
				<TabsList className="mb-4">
					<TabsTrigger value="sales">Sales Analytics</TabsTrigger>
					<TabsTrigger value="popular">Popular Items</TabsTrigger>
				</TabsList>

				<TabsContent value="sales">
					<Card>
						<CardHeader>
							<CardTitle>Daily Sales (Last 7 Days)</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-[400px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={salesData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis yAxisId="left" orientation="left" stroke="#FF8C42" />
										<YAxis
											yAxisId="right"
											orientation="right"
											stroke="#4ECDC4"
										/>
										<Tooltip />
										<Legend />
										<Bar
											yAxisId="left"
											dataKey="sales"
											name="Sales ($)"
											fill="hsl(var(--chart-1))"
											radius={[4, 4, 0, 0]}
										/>
										<Bar
											yAxisId="right"
											dataKey="orders"
											name="Orders"
											fill="hsl(var(--chart-2))"
											radius={[4, 4, 0, 0]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="popular">
					<Card>
						<CardHeader>
							<CardTitle>Most Popular Items</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-[400px] flex items-center justify-center">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={pieChartData}
											cx="50%"
											cy="50%"
											labelLine
											outerRadius={150}
											dataKey="value"
											nameKey="name"
											label={(entry) => entry.name}
										>
											{pieChartData.map((entry, idx) => (
												<Cell
													key={`cell-${idx}`}
													fill={COLORS[idx % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Card>
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
				</CardHeader>
				<CardContent>
					<RecentOrdersTable orders={recentOrders} />
				</CardContent>
			</Card>
		</div>
	);
}
