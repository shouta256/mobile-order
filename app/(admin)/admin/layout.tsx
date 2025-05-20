// app/(admin)/admin/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser, requireStaff } from "@/lib/auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// STAFF or ADMIN 以外は signin へ
	const user = await getCurrentUser();
	if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
		redirect("/auth/signin");
	}
	// STAFF でも ADMIN でもアクセス OK
	return (
		<>
			{/* ルートの Header を再利用 */}
			<Header />

			{/* admin ページ固有のコンテナ */}
			<div className=" bg-gray-50 min-h-screen">
				<main className="container mx-auto p-3">{children}</main>
			</div>
		</>
	);
}
