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

/** Allow only STAFF or ADMIN */
export async function requireStaff() {
	const user = await getCurrentUser();
	if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
		// No right, act like 404
		notFound();
	}
	return user;
}

/** Use when page is only for ADMIN */
export async function requireAdmin() {
	const user = await getCurrentUser();
	if (!user || user.role !== "ADMIN") {
		notFound();
	}
	return user;
}

/**
 * Hash a plain password
 */
export async function hashPassword(password: string): Promise<string> {
	const SALT_ROUNDS = 12;
	return await hash(password, SALT_ROUNDS);
}

/**
 * Check plain password with hash
 */
export async function verifyPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return await compare(password, hashedPassword);
}
