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
