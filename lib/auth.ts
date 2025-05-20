// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import { prisma } from "./db";
import { notFound } from "next/navigation";
import { hash, compare } from "bcrypt";

export async function getCurrentUser() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return null;
	return prisma.user.findUnique({ where: { id: session.user.id } });
}

/** 「STAFF か ADMIN」なら通す */
export async function requireStaff() {
	const user = await getCurrentUser();
	if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
		// 権限無し → 404 と同じ挙動
		notFound();
	}
	return user;
}

/** もし本当に ADMIN 専用が欲しい時だけ使う */
export async function requireAdmin() {
	const user = await getCurrentUser();
	if (!user || user.role !== "ADMIN") {
		notFound();
	}
	return user;
}

/**
 * 平文パスワードをハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
	const SALT_ROUNDS = 12;
	return await hash(password, SALT_ROUNDS);
}

/**
 * 平文パスワードとハッシュを比較
 */
export async function verifyPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return await compare(password, hashedPassword);
}
