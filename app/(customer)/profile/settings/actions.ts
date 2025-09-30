// app/(customer)/profile/settings/actions.ts
"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
	const user = await getCurrentUser();
	if (!user) throw new Error("Sign in is required");

	const name = formData.get("name");
	if (typeof name !== "string" || name.trim() === "") {
		throw new Error("Please enter your name");
	}

	await prisma.user.update({
		where: { id: user.id },
		data: { name: name.trim() },
	});

	// Revalidate this page
	revalidatePath("/profile/settings");
}
