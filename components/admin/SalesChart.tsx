// components/admin/SalesChart.tsx
"use client";

import {
	ResponsiveContainer,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Line,
} from "recharts";

interface SalesChartProps {
	salesData: { date: string; sales: number }[];
}

export default function SalesChart({ salesData }: SalesChartProps) {
	if (!salesData || salesData.length === 0) {
		return <p className="text-center text-gray-500">データがありません</p>;
	}

	return (
		<div className="p-6 bg-white rounded shadow">
			<h3 className="mb-4 font-medium">過去7日間の売上推移</h3>
			<ResponsiveContainer width="100%" height={200}>
				<LineChart data={salesData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Line
						type="monotone"
						dataKey="sales"
						stroke="#8884d8"
						animationDuration={300}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
