// app/(admin)/admin/settings/SettingClient.tsx
"use client";

import { useState, useTransition } from "react";
import { saveSiteSetting } from "./actions";
import { useToast } from "@/hooks/useToast";
import type { SiteSetting } from "@/lib/settings";

export default function SettingClient({
	setting,
}: {
	setting: SiteSetting | null;
}) {
	const [isPending, start] = useTransition();
	const { toast } = useToast();

	/* Local color preview */
	const [color, setColor] = useState<string>(
		setting?.primaryColor ?? "#ff7a00",
	);

	/* Local image preview */
	const [preview, setPreview] = useState<string | null>(
		setting?.heroImage ?? null,
	);

	/* Handle submit */
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		start(async () => {
			await saveSiteSetting(fd);
			toast({ title: "保存しました", variant: "success" });
		});
	}

	return (
		<form
			onSubmit={onSubmit}
			className="space-y-4 max-w-lg"
			encType="multipart/form-data"
		>
			{/* Basic text fields */}
			<input
				name="storeName"
				defaultValue={setting?.storeName ?? ""}
				placeholder="店舗名"
				className="w-full p-2 border rounded"
			/>
			<input
				name="heroText1"
				defaultValue={setting?.heroText1 ?? ""}
				placeholder="ヒーロー文章①（白文字）"
				className="w-full p-2 border rounded"
			/>
			<input
				name="heroText2"
				defaultValue={setting?.heroText2 ?? ""}
				placeholder="ヒーロー文章②（メインカラー）"
				className="w-full p-2 border rounded"
			/>
			<textarea
				name="heroText3"
				defaultValue={setting?.heroText3 ?? ""}
				placeholder="ヒーロー文章③（任意・小さめ白文字）"
				className="w-full p-2 border rounded resize-none"
				rows={3}
			/>

			{/* Primary Color */}
			<div className="flex items-center space-x-4">
				<label htmlFor="primaryColor" className="whitespace-nowrap font-medium">
					メインカラー:
				</label>
				<input
					id="primaryColor"
					type="color"
					name="primaryColor"
					value={color}
					onChange={(e) => setColor(e.target.value)}
					className="h-10 w-20 border rounded"
				/>
				<span className="text-sm text-gray-600">{color.toUpperCase()}</span>
			</div>

			{/*Hero Image */}
			<div className="space-y-2">
				<label htmlFor="heroImage" className="block font-medium">
					ヒーロー画像
				</label>
				<input
					id="heroImage"
					type="file"
					name="heroImageFile"
					accept="image/*"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) setPreview(URL.createObjectURL(file));
					}}
				/>
				{/* Image preview */}
				{preview && (
					<img
						src={preview}
						alt="preview"
						className="mt-2 h-40 w-full object-cover rounded"
					/>
				)}

				{setting?.heroImage && (
					<input
						type="hidden"
						name="heroImageExisting"
						value={setting.heroImage}
					/>
				)}
			</div>

			<button
				type="submit"
				disabled={isPending}
				className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
			>
				{isPending ? "保存中…" : "保存"}
			</button>
		</form>
	);
}
