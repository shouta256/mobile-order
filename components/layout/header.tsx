// components/layout/header.tsx
import Link from "next/link";
import dynamic from "next/dynamic";
import { getCurrentUser } from "@/lib/auth";
import CartLink from "./CartLink";

// ProfileMenu はクライアント専用
const ProfileMenu = dynamic(() => import("./profile-menu"), {
	ssr: false,
});

export default async function Header() {
	// サーバーでのみログループを読んでマークアップ出力
	const user = await getCurrentUser();

	return (
		<header className="fixed top-0 w-full bg-white shadow z-20">
			<div className="container mx-auto flex items-center justify-between h-16 px-4">
				{/* ロゴ */}
				<Link href="/">
					<span className="text-xl font-bold">MyRestaurant</span>
				</Link>

				{/* ナビゲーション */}
				<nav className="flex items-center space-x-4">
					{!user ? (
						/* 未ログイン時 */
						<Link
							href="/auth/signin"
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						>
							サインイン
						</Link>
					) : (
						<>
							{/* CUSTOMER 用リンク */}
							{user.role === "CUSTOMER" && (
								<>
									<Link
										href="/menu"
										className="text-gray-700 hover:text-gray-900"
									>
										メニュー
									</Link>
									<CartLink />
									<Link
										href="/orders"
										className="text-gray-700 hover:text-gray-900"
									>
										注文履歴
									</Link>
								</>
							)}

							{/* STAFF 用リンクは無し */}
							{user.role === "STAFF" && (
								<Link
									href="/admin/orders"
									className="text-gray-700 hover:text-gray-900"
								>
									オーダー一覧
								</Link>
							)}
							{/* ADMIN 用リンク */}
							{user.role === "ADMIN" && (
								<>
									<Link
										href="/admin/orders"
										className="text-gray-700 hover:text-gray-900"
									>
										オーダー一覧
									</Link>
									<Link
										href="/admin/menu"
										className="text-gray-700 hover:text-gray-900"
									>
										メニュー管理
									</Link>
									<Link
										href="/admin/dashboard"
										className="text-gray-700 hover:text-gray-900"
									>
										管理画面
									</Link>

									<Link
										href="/admin/staff"
										className="text-gray-700 hover:text-gray-900"
									>
										スタッフ管理
									</Link>
								</>
							)}

							{/* 共通：プロフィールメニュー */}
							<ProfileMenu
								user={{
									name: user.name || undefined,
									email: user.email || undefined,
									image: user.image || undefined,
								}}
							/>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
