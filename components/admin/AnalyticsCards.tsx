// components/admin/analytics-cards.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart, Clock, DollarSign, Users } from "lucide-react";

interface Props {
	totalOrders: number;
	pendingOrders: number;
	totalRevenue: number;
	totalCustomers: number;
}

export default function AnalyticsCards({
	totalOrders,
	pendingOrders,
	totalRevenue,
	totalCustomers,
}: Props) {
	const cards = [
		{
			title: "Total Orders",
			value: totalOrders,
			icon: <ShoppingCart size={20} className="text-gray-500" />,
		},
		{
			title: "Pending Orders",
			value: pendingOrders,
			icon: <Clock size={20} className="text-gray-500" />,
		},
		{
			title: "Total Revenue",
			value: totalRevenue.toFixed(2),
			icon: <DollarSign size={20} className="text-gray-500" />,
		},
		{
			title: "Total Customers",
			value: totalCustomers,
			icon: <Users size={20} className="text-gray-500" />,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{cards.map(({ title, value, icon }) => (
				<Card key={title} className="p-4">
					<CardHeader className="flex items-center justify-between">
						<CardTitle>{title}</CardTitle>
						{icon}
					</CardHeader>
					<CardContent>
						<div className="mt-2 text-3xl font-bold">
							{title === "Total Revenue" ? `$${value}` : value}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
