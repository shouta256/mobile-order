// app/(admin)/admin/menu/actions.ts
"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createMenuItem(formData: FormData) {
	// Check admin role
	await requireAdmin();

	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const price = parseFloat(formData.get("price") as string);
	const categoryId = formData.get("categoryId") as string;
	const available = formData.get("available") === "true";
	const featured = formData.get("featured") === "true";

	// Upload image
	let imageUrl: string | null = null;
	let thumbnailUrl: string | null = null;
	const file = formData.get("image") as File;
	if (file && file.size > 0) {
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
		const result = await uploadImage(base64);
		imageUrl = result.image;
		thumbnailUrl = result.thumbnail;
	}

	// Create item
	await prisma.menuItem.create({
		data: {
			name,
			description,
			price,
			categoryId,
			available,
			featured,
			image: imageUrl,
			thumbnail: thumbnailUrl,
		},
	});

	// Revalidate cache
	revalidatePath("/admin/menu");
}

export async function updateMenuItem(formData: FormData) {
	await requireAdmin();

	const id = formData.get("id") as string;
	const name = formData.get("name") as string;
	const description = formData.get("description") as string;
	const price = parseFloat(formData.get("price") as string);
	const categoryId = formData.get("categoryId") as string;
	const available = formData.get("available") === "true";
	const featured = formData.get("featured") === "true";

	// Get existing item
	const existing = await prisma.menuItem.findUnique({ where: { id } });
	if (!existing) throw new Error("メニューが見つかりません");

	let imageUrl = existing.image;
	let thumbnailUrl = existing.thumbnail;

	// If new image, delete old and upload new
	const file = formData.get("image") as File;
	if (file && file.size > 0) {
		if (existing.image) {
			// Remove Cloudinary asset by publicId
			const parts = existing.image.split("/");
			const publicId = parts.slice(-2).join("/").split(".")[0];
			await deleteImage(publicId);
		}
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
		const result = await uploadImage(base64);
		imageUrl = result.image;
		thumbnailUrl = result.thumbnail;
	}

	await prisma.menuItem.update({
		where: { id },
		data: {
			name,
			description,
			price,
			categoryId,
			available,
			featured,
			image: imageUrl,
			thumbnail: thumbnailUrl,
		},
	});

	revalidatePath("/admin/menu");
}

export async function deleteMenuItem(formData: FormData) {
	await requireAdmin();

	const id = formData.get("id") as string;

	const existing = await prisma.menuItem.findUnique({ where: { id } });
	if (!existing) throw new Error("メニューが見つかりません");

	// Remove image when exists
	if (existing.image) {
		const parts = existing.image.split("/");
		const publicId = parts.slice(-2).join("/").split(".")[0];
		await deleteImage(publicId);
	}

	await prisma.menuItem.delete({ where: { id } });
	revalidatePath("/admin/menu");
}
