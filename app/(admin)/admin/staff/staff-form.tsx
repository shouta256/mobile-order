// app/(admin)/admin/staff/staff-form.tsx
"use client";

import { useTransition, useState } from "react";
import { createStaff } from "./actions";
import { useToast } from "@/hooks/useToast";

export default function StaffForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPending, start] = useTransition();
	const { toast } = useToast();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append("name", name);
		fd.append("email", email);
		fd.append("password", password);

		start(async () => {
			try {
				await createStaff(fd);
				toast({ title: "Staff created", variant: "success" });
				setName("");
				setEmail("");
				setPassword("");
			} catch (err: unknown) {
				const error = err as Error;
				toast({
					title: "Failed to register",
					description: error.message,
					variant: "destructive",
				});
			}
		});
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			{/* Name */}
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Name"
				className="w-full p-2 border rounded"
				required
			/>
			{/* Email */}
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				className="w-full p-2 border rounded"
				required
			/>
			{/* Password */}
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				className="w-full p-2 border rounded"
				required
			/>
			<button
				type="submit"
				disabled={isPending}
				className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
			>
				{isPending ? "Submitting…" : "Register"}
			</button>
		</form>
	);
}
