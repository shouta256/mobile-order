// app/(admin)/admin/staff/actions.ts
"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/** Create new staff */
export async function createStaff(formData: FormData) {
	await requireAdmin();
	const email = formData.get("email") as string;
	const name = formData.get("name") as string;
	const pass = formData.get("password") as string;

	if (!email || !name || !pass) throw new Error("Missing required fields");
	if (await prisma.user.findUnique({ where: { email } })) {
		throw new Error("This email is already registered");
	}

	const hash = await bcrypt.hash(pass, 10);
	await prisma.user.create({
		data: { email, name, password: hash, role: "STAFF" },
	});
	revalidatePath("/admin/staff");
}

/** Update staff info (name only) */
export async function updateStaff(formData: FormData) {
	await requireAdmin();
	const id = formData.get("id") as string;
	const name = formData.get("name") as string;
	if (!id || !name) throw new Error("Missing required fields");

	await prisma.user.update({ where: { id }, data: { name } });
	revalidatePath("/admin/staff");
}

/** Delete staff */
export async function deleteStaff(formData: FormData) {
	await requireAdmin();
	const id = formData.get("id") as string;
	if (!id) throw new Error("Invalid ID");
	await prisma.user.delete({ where: { id } });
	revalidatePath("/admin/staff");
}
