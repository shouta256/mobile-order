"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPending, start] = useTransition();
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		start(async () => {
			// Call API to create user
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			const data = await res.json();

			if (!res.ok) {
				toast({
					title: "登録失敗",
					description: data.error || "再度お試しください",
					variant: "destructive",
				});
				return;
			}

			// Auto sign in
			const signInResult = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});
			if (signInResult?.error) {
				toast({
					title: "自動ログイン失敗",
					description: signInResult.error,
					variant: "destructive",
				});
				return;
			}

			// Go to home
			toast({ title: "登録＆ログイン完了！", variant: "success" });
			window.location.href = "/";
		});
	};

	return (
		<div className="max-w-md mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold text-center">新規登録</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					placeholder="お名前"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className="w-full p-2 border rounded"
				/>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full p-2 border rounded"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full p-2 border rounded"
				/>
				<button
					type="submit"
					disabled={isPending}
					className="w-full py-2 bg-green-600 text-white rounded disabled:opacity-50"
				>
					{isPending ? "作成中…" : "アカウントを作成する"}
				</button>
			</form>
			<p className="text-center text-sm text-gray-600">
				既にアカウントをお持ちの方は{" "}
				<Link href="/auth/signin" className="text-blue-600 hover:underline">
					こちらからサインイン
				</Link>
			</p>
		</div>
	);
}
