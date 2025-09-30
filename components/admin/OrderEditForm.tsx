// components/admin/OrderEditForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { updateOrderDetail } from "@/app/(admin)/admin/orders/actions";

interface OrderItem {
	id: string;
	name: string;
	quantity: number;
}

interface Order {
	id: string;
	tableNumber: string;
	status: string;
	items: OrderItem[];
}

export default function OrderEditForm({ order }: { order: Order }) {
	const [tableNumber, setTableNumber] = useState(order.tableNumber);
	const [status, setStatus] = useState(order.status);
	const [quantities, setQuantities] = useState<Record<string, number>>(() =>
		order.items.reduce(
			(acc, it) => {
				acc[it.id] = it.quantity;
				return acc;
			},
			{} as Record<string, number>,
		),
	);
	const [isPending, start] = useTransition();
	const router = useRouter();
	const { toast } = useToast();

	const handleChangeQty = (id: string, value: number) => {
		setQuantities((q) => ({ ...q, [id]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		start(async () => {
			try {
				// Build FormData payload
				const formData = new FormData();
				formData.append("id", order.id);
				formData.append("tableNumber", tableNumber);
				formData.append("status", status);

				for (const it of order.items) {
					formData.append("itemIds", it.id);
					formData.append(`quantity-${it.id}`, String(quantities[it.id]));
				}

				await updateOrderDetail(formData);
				toast({ title: "Order updated", variant: "success" });
				router.push("/admin/orders");
			} catch (err: unknown) {
				toast({
					title: "Update failed",
					description:
						err instanceof Error ? err.message : "An unknown error happened",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<h1 className="text-xl font-bold">Edit order</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="tableNumber" className="block mb-1 font-medium">
						Table number
					</label>
					<input
						id="tableNumber"
						name="tableNumber"
						value={tableNumber}
						onChange={(e) => setTableNumber(e.target.value)}
						className="w-full p-2 border rounded"
					/>
				</div>

				<div>
					<label htmlFor="status" className="block mb-1 font-medium">
						Status
					</label>
					<select
						id="status"
						name="status"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="w-full p-2 border rounded"
					>
						<option value="PENDING">PENDING</option>
						<option value="COMPLETED">COMPLETED</option>
						<option value="CANCELLED">CANCELLED</option>
					</select>
				</div>

				<div className="space-y-2">
					<p className="font-medium mb-1">Order items</p>
					{order.items.map((it) => (
						<div key={it.id} className="flex items-center gap-2">
							<span className="flex-1">{it.name}</span>
							<input
								type="number"
								min={0}
								value={quantities[it.id]}
								onChange={(e) => handleChangeQty(it.id, Number(e.target.value))}
								className="w-20 p-1 border rounded"
							/>
						</div>
					))}
				</div>

				<button
					type="submit"
					disabled={isPending}
					className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
				>
					{isPending ? "Saving…" : "Save"}
				</button>
			</form>
		</div>
	);
}
