// lib/auth-server.ts

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { hashPassword, verifyPassword } from "./auth";
import type { User } from "@prisma/client";

/**
 * 新規ユーザー登録を行い、
 * セッション用の cookie (userId) をセットします。
 */
export async function signUp(email: string, password: string, name: string) {
	// 既に同一メールアドレスのユーザーがいないかチェック
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		throw new Error("User already exists");
	}

	// パスワードをハッシュ化
	const hashed = await hashPassword(password);

	// ユーザーを作成
	const user = await prisma.user.create({
		data: {
			email,
			password: hashed,
			name,
		},
	});

	// クッキーに userId をセット（HTTP Only, 1 週間有効）
	const cookieStore = cookies();
	cookieStore.set("userId", user.id, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7,
		path: "/",
	});

	// パスワードは返さない
	const { password: _, ...rest } = user;
	return rest as Omit<User, "password">;
}

/**
 * メール／パスワードでのサインイン。
 * 成功すれば cookie をセットします。
 */
export async function signIn(email: string, password: string) {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error("User not found");
	}

	const isValid = await verifyPassword(password, user.password);
	if (!isValid) {
		throw new Error("Invalid password");
	}

	// cookie に userId をセット
	const cookieStore = cookies();
	cookieStore.set("userId", user.id, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7,
		path: "/",
	});

	const { password: _, ...rest } = user;
	return rest as Omit<User, "password">;
}

/**
 * サインアウト。cookie を削除してトップへリダイレクト。
 */
export async function signOut() {
	const cookieStore = cookies();
	cookieStore.delete("userId");
	redirect("/");
}

/**
 * 現在のユーザー情報を取得（パスワードは除く）。
 * ログインしていなければ null を返します。
 */
export async function getCurrentUser(): Promise<Omit<User, "password"> | null> {
	const cookieStore = cookies();
	const userId = cookieStore.get("userId")?.value;
	if (!userId) return null;

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) return null;
	const { password: _, ...rest } = user;
	return rest as Omit<User, "password">;
}

/**
 * サーバー側のページ／API で「認証済みでなければサインインページへ」。
 */
export async function requireAuth() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/auth/signin");
	}
	return user;
}

/**
 * 「ADMIN ロール限定ページ」で使うガード
 */
export async function requireAdmin() {
	const user = await getCurrentUser();
	if (!user || user.role !== "ADMIN") {
		redirect("/auth/signin");
	}
	return user;
}
