"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { signOut } from "next-auth/react";

interface ProfileMenuProps {
	user: {
		name?: string;
		email?: string;
		image?: string;
	};
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// メニュー外クリックで閉じる
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, []);

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="focus:outline-none"
			>
				{user.image ? (
					<Image
						src={user.image}
						alt={user.name || "avatar"}
						width={32}
						height={32}
						className="rounded-full"
					/>
				) : (
					<User size={32} className="text-gray-700 hover:text-gray-900" />
				)}
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
					<Link
						href="/profile/settings"
						className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
					>
						設定
					</Link>
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: "/" })}
						className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
					>
						ログアウト
					</button>
				</div>
			)}
		</div>
	);
}
