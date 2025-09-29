// app/(admin)/admin/layout.tsx
import type React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Header from "@/components/layout/Header";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Redirect to sign-in if not STAFF or ADMIN
	const user = await getCurrentUser();
	if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
		redirect("/auth/signin");
	}
	// STAFF and ADMIN can continue
	return (
		<>
			{/* Reuse main header */}
			<Header />

			{/* Container for admin pages */}
			<div className=" bg-gray-50 min-h-screen">
				<main className="container mx-auto p-3">{children}</main>
			</div>
		</>
	);
}
