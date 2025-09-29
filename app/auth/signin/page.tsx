"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPending, start] = useTransition();
	const { toast } = useToast();

	const handleCreds = (e: React.FormEvent) => {
		e.preventDefault();
		start(async () => {
			const res = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (res?.error) {
				toast({
					title: "ログイン失敗",
					description: "メールアドレスかパスワードが間違っています",
					variant: "destructive",
				});
			} else {
				toast({ title: "ログイン成功", variant: "success" });
				// Redirect user
				window.location.href = "/";
			}
		});
	};

	const handleGoogle = () => {
		signIn("google", { callbackUrl: "/" });
	};

	return (
		<div className="max-w-md mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-bold text-center">サインイン</h1>

			<form onSubmit={handleCreds} className="space-y-4">
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
					className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
				>
					{isPending ? "送信中…" : "ログイン"}
				</button>
			</form>

			<div className="h-px bg-gray-300 my-4" />

			<button
				type="button"
				onClick={handleGoogle}
				className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
			>
				Google アカウントでログイン
			</button>

			<p className="text-center text-sm text-gray-600">
				アカウントをお持ちでない方は{" "}
				<Link href="/auth/signup" className="text-blue-600 hover:underline">
					こちらから新規登録
				</Link>
			</p>
		</div>
	);
}
