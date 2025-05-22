// app/(customer)/profile/settings/settings-form.tsx
"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "./actions";

interface Props {
	user: { name: string; email: string };
}

export default function SettingsForm({ user }: Props) {
	const [name, setName] = useState(user.name);
	const [isPending, start] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		const formData = new FormData();
		formData.append("name", name);

		start(async () => {
			try {
				await updateProfile(formData);
			} catch (err: unknown) {
				setError(err instanceof Error ? err.message : "エラーが発生しました");
			}
		});
	};

	return (
		<form onSubmit={onSubmit} className="max-w-md mx-auto space-y-6">
			{error && <p className="text-red-500">{error}</p>}

			<div>
				<label htmlFor="name" className="block mb-1 font-medium">
					名前
				</label>
				<input
					id="name"
					name="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className="w-full p-2 border rounded"
				/>
			</div>

			<div>
				<div className="block mb-1 font-medium">メールアドレス</div>
				<p className="p-2 bg-gray-100 rounded">{user.email}</p>
			</div>

			<button
				type="submit"
				disabled={isPending}
				className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
			>
				{isPending ? "更新中…" : "更新する"}
			</button>
		</form>
	);
}
