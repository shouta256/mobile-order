// components/layout/NavMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import CartLink from "./CartLink";

interface NavMenuProps {
	user: {
		id?: string;
		role?: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
	} | null;
}

export default function NavMenu({ user }: NavMenuProps) {
	const [open, setOpen] = useState(false);

	// デスクトップ用リンク
	const desktopLinks = user ? (
		<>
			{user.role === "CUSTOMER" && (
				<>
					<Link href="/menu" className="text-gray-700 hover:text-gray-900">
						メニュー
					</Link>
					<CartLink />
					<Link href="/orders" className="text-gray-700 hover:text-gray-900">
						注文履歴
					</Link>
				</>
			)}
			{user.role === "STAFF" && (
				<Link
					href="/admin/orders"
					className="text-gray-700 hover:text-gray-900"
				>
					オーダー一覧
				</Link>
			)}
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
			{/* プロフィール／ログアウト */}
			{/* ここは既存の ProfileMenu を動的に import してもOK */}
			<button
				onClick={() => signOut({ callbackUrl: "/" })}
				className="text-gray-700 hover:text-gray-900"
			>
				ログアウト
			</button>
		</>
	) : (
		<Link
			href="/auth/signin"
			className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
		>
			サインイン
		</Link>
	);

	return (
		<>
			{/* Desktop: md 以上で表示 */}
			<nav className="hidden md:flex items-center space-x-4">
				{desktopLinks}
			</nav>

			{/* Mobile: md 以下でハンバーガー */}
			<button
				className="md:hidden p-2"
				onClick={() => setOpen((o) => !o)}
				aria-label="Toggle Menu"
			>
				{open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
			</button>

			{/* Mobile メニュー折り畳み */}
			{open && (
				<div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
					<div className="flex flex-col p-4 space-y-2">{desktopLinks}</div>
				</div>
			)}
		</>
	);
}
