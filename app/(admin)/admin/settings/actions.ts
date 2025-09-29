// app/(admin)/admin/settings/actions.ts
"use server";

import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { upsertSiteSetting } from "@/lib/settings";
import { uploadImage } from "@/lib/cloudinary"; // We already have Cloudinary helper

/**
 * Save site setting (create or update)
 *
 * - Upload image only when file is sent
 * - Keep hidden heroImageExisting value when no new file
 *   (SettingClient already sets the hidden input)
 */
export async function saveSiteSetting(formData: FormData) {
	// Step 1: check role
	await requireAdmin();

	/* Image upload */
	let heroImageUrl = formData.get("heroImageExisting") as string | null;

	// <input type="file" name="heroImageFile" />
	const file = formData.get("heroImageFile") as File | null;

	if (file && file.size > 0) {
		// Convert buffer to base64 data URL and send to Cloudinary
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

		// cloudinary.ts uploadImage returns { image, thumbnail }
		const { image } = await uploadImage(base64);
		heroImageUrl = image;
	}

	/* Save to database */
	await upsertSiteSetting({
		storeName: (formData.get("storeName") as string) ?? "",
		heroText1: (formData.get("heroText1") as string) ?? "",
		heroText2: (formData.get("heroText2") as string) ?? "",
		heroText3: (formData.get("heroText3") as string) ?? "",
		primaryColor: (formData.get("primaryColor") as string) ?? "#ff7a00",
		heroImage: heroImageUrl ?? "",
	});

	revalidatePath("/");
	revalidatePath("/admin");
}
