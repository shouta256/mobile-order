// app/(customer)/profile/settings/actions.ts
"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
	const user = await getCurrentUser();
	if (!user) throw new Error("ログインが必要です");

	const name = formData.get("name");
	if (typeof name !== "string" || name.trim() === "") {
		throw new Error("名前を入力してください");
	}

	await prisma.user.update({
		where: { id: user.id },
		data: { name: name.trim() },
	});

	// このページを再検証
	revalidatePath("/profile/settings");
}
