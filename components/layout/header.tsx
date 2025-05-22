// components/layout/header.tsx
import Link from "next/link";
import dynamic from "next/dynamic";
import { getCurrentUser } from "@/lib/auth";
import NavMenu from "./NavMenu";
import { getSiteSetting } from "@/lib/settings";

const ProfileMenu = dynamic(() => import("./ProfileMenu"), {
	ssr: false,
});

export default async function Header() {
	// サーバー側でセッションからユーザー取得
	const [user, setting] = await Promise.all([
		getCurrentUser(),
		getSiteSetting(),
	]);

	return (
		<header className="fixed top-0 w-full bg-white shadow z-20">
			<div className="container mx-auto flex items-center justify-between h-16 px-4">
				{/* ロゴ */}
				<Link href="/">
					<span className="text-xl font-bold" style={{ color: "var(--pc)" }}>
						{setting?.storeName ?? "MyRestaurant"}
					</span>
				</Link>

				{/* ナビゲーション／ハンバーガー */}
				<div className="flex items-center space-x-4">
					<NavMenu user={user} />

					{user ? (
						<ProfileMenu
							user={{
								name: user.name || undefined,
								email: user.email || undefined,
								image: user.image || undefined,
							}}
						/>
					) : (
						<Link
							href="/auth/signin"
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						>
							サインイン
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
