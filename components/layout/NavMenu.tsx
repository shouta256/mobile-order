// components/layout/NavMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

type Role = "CUSTOMER" | "STAFF" | "ADMIN";

interface NavLink {
	href: string;
	label: string;
	roles: Role[];
}

interface NavMenuProps {
	user: { role: string } | null;
}

export default function NavMenu({ user }: NavMenuProps) {
	const [open, setOpen] = useState(false);

	const links: NavLink[] = [
		{ href: "/menu", label: "Menu", roles: ["CUSTOMER"] },
		{ href: "/checkout", label: "Cart", roles: ["CUSTOMER"] },
		{ href: "/orders", label: "Order History", roles: ["CUSTOMER"] },
		{ href: "/admin/orders", label: "Orders", roles: ["STAFF", "ADMIN"] },
		{ href: "/admin/menu", label: "Menu Manager", roles: ["ADMIN"] },
		{ href: "/admin/dashboard", label: "Dashboard", roles: ["ADMIN"] },
		{ href: "/admin/staff", label: "Staff Management", roles: ["ADMIN"] },
		{ href: "/admin/settings", label: "Site Settings", roles: ["ADMIN"] },
	];

	// Cast user.role to Role and filter
	const filtered = user
		? links.filter((l) => l.roles.includes(user.role as Role))
		: [];

	return (
		<>
			{/* Desktop menu */}
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

			{/* Mobile hamburger */}
			<button
				type="button"
				className="md:hidden p-2"
				onClick={() => setOpen((o) => !o)}
				aria-label="Toggle Menu"
			>
				{open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
			</button>

			{/* Mobile drawer */}
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
