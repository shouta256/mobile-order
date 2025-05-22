// app/(customer)/profile/settings/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
	// サーバー側でログイン状態を取得
	const user = await getCurrentUser();
	if (!user) {
		redirect("/auth/signin");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>
			<SettingsForm
				user={{
					name: user.name ?? "",
					email: user.email ?? "",
				}}
			/>
		</div>
	);
}
