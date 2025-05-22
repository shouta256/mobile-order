// app/(admin)/admin/settings/actions.ts
"use server";

import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { upsertSiteSetting } from "@/lib/settings";
import { uploadImage } from "@/lib/cloudinary"; // 既に Cloudinary ヘルパーがある前提

/**
 * サイト設定を保存（新規 / 更新）
 *
 * - 画像は「ファイルが送られて来たときのみ」Cloudinary にアップロード
 * - ファイル未選択の場合は hidden フィールド heroImageExisting の値をそのまま維持
 *   （SettingClient 側で hidden input を追加済みとする）
 */
export async function saveSiteSetting(formData: FormData) {
	// 1) 認可
	await requireAdmin();

	/* ───────── 画像アップロード ───────── */
	let heroImageUrl = formData.get("heroImageExisting") as string | null;

	// <input type="file" name="heroImageFile" />
	const file = formData.get("heroImageFile") as File | null;

	if (file && file.size > 0) {
		// バッファ → base64 DataURL にして Cloudinary へ
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

		// cloudinary.ts の uploadImage は { image, thumbnail } を返す想定
		const { image } = await uploadImage(base64);
		heroImageUrl = image;
	}

	/* ───────── DB へ upsert ───────── */
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
