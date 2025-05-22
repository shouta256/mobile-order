// lib/settings.ts
import { prisma } from "@/lib/db";

export type SiteSetting = NonNullable<
	Awaited<ReturnType<typeof getSiteSetting>>
>;

export async function getSiteSetting() {
	return prisma.siteSetting.findFirst();
}

export async function upsertSiteSetting(data: Partial<SiteSetting>) {
	const existing = await getSiteSetting();
	if (existing) {
		await prisma.siteSetting.update({ where: { id: existing.id }, data });
	} else {
		await prisma.siteSetting.create({ data });
	}
}
