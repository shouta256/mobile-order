// components/layout/NavMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

interface NavLink {
	href: string;
	label: string;
	roles: Array<"CUSTOMER" | "STAFF" | "ADMIN">;
}

/** サーバーコンポーネントから user を渡して使います */
interface NavMenuProps {
	user: { role?: "CUSTOMER" | "STAFF" | "ADMIN" } | null;
}

export default function NavMenu({ user }: NavMenuProps) {
	const [open, setOpen] = useState(false);

	const links: NavLink[] = [
		{ href: "/menu", label: "メニュー", roles: ["CUSTOMER"] },
		{ href: "/checkout", label: "カート", roles: ["CUSTOMER"] },
		{ href: "/orders", label: "注文履歴", roles: ["CUSTOMER"] },
		{ href: "/admin/orders", label: "オーダー一覧", roles: ["STAFF", "ADMIN"] },
		{ href: "/admin/menu", label: "メニュー管理", roles: ["ADMIN"] },
		{ href: "/admin/dashboard", label: "管理画面", roles: ["ADMIN"] },
		{ href: "/admin/staff", label: "スタッフ管理", roles: ["ADMIN"] },
	];

	// user.role に応じたリンクだけを表示
	const filtered = user
		? links.filter((l) => l.roles.includes(user.role!))
		: [];

	return (
		<>
			{/* デスクトップ版メニュー */}
			<nav className="hidden md:flex items-center space-x-4 flex-nowrap">
				{filtered.map((l) => (
					<Link
						key={l.href}
						href={l.href}
						className="inline-block whitespace-nowrap text-gray-700 hover:text-gray-900"
					>
						{l.label}
					</Link>
				))}
			</nav>

			{/* モバイル版ハンバーガーアイコン */}
			<button
				className="md:hidden p-2"
				onClick={() => setOpen((o) => !o)}
				aria-label="Toggle Menu"
			>
				{open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
			</button>

			{/* モバイル版ドロワーメニュー */}
			{open && (
				<div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
					<div className="flex flex-col p-4 space-y-2">
						{filtered.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								className="block whitespace-nowrap text-gray-700 hover:text-gray-900"
							>
								{l.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</>
	);
}
