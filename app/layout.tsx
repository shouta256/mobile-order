// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Providers from "./Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MyRestaurant",
	description: "Order your favorite meals for delivery",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// サーバーサイドでセッションを取得して、クライアント側の SessionProvider に渡す
	const session = await getServerSession(authOptions);

	return (
		<html lang="ja">
			<body className={inter.className}>
				<Providers session={session}>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="flex-grow pt-[96px]">{children}</main>
						<Footer />
					</div>
				</Providers>
			</body>
		</html>
	);
}
