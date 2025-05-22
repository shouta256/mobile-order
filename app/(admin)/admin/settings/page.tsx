// app/(admin)/admin/settings/page.tsx
import { requireAdmin } from "@/lib/auth";
import { getSiteSetting } from "@/lib/settings";
import SettingClient from "./SettingsForm";

export default async function SiteSettingPage() {
	await requireAdmin();
	const setting = await getSiteSetting();
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">サイト設定</h1>
			<SettingClient setting={setting} />
		</div>
	);
}
