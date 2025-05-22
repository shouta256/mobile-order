// app/(admin)/admin/menu/MenuManagerClient.tsx
"use client";

import type React from "react";
import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createMenuItem, updateMenuItem, deleteMenuItem } from "./actions";
import { useToast } from "@/hooks/useToast";

interface MenuItem {
	id: string;
	name: string;
	description: string | null;
	price: number;
	categoryId: string;
	available: boolean;
	featured: boolean;
	image: string | null;
	thumbnail: string | null;
}

interface Category {
	id: string;
	name: string;
}

interface Props {
	items: MenuItem[];
	categories: Category[];
}

export default function MenuManagerClient({ items, categories }: Props) {
	const { toast } = useToast();
	const router = useRouter();
	const [isPending, start] = useTransition();

	/** 新規作成ハンドラ */
	function onCreate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		start(async () => {
			try {
				await createMenuItem(fd);
				toast({ title: "メニューを作成しました", variant: "success" });
				e.currentTarget.reset();
				router.refresh();
			} catch (err: unknown) {
				toast({
					title: err instanceof Error ? err.message : "作成に失敗しました",
					variant: "destructive",
				});
			}
		});
	}

	/** 更新・削除共通ハンドラ */
	function onSubmit(
		e: React.FormEvent<HTMLFormElement>,
		action: (fd: FormData) => Promise<void>,
		successMsg: string,
	) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		start(async () => {
			try {
				await action(fd);
				toast({ title: successMsg, variant: "success" });
				router.refresh();
			} catch (err: unknown) {
				toast({
					title: err instanceof Error ? err.message : "操作に失敗しました",
					variant: "destructive",
				});
			}
		});
	}

	return (
		<div className="space-y-8">
			{/* ── 新規メニュー登録フォーム ── */}
			<section className="p-4 border rounded shadow-sm max-w-md">
				<h3 className="mb-2 font-medium">新規メニュー登録</h3>
				<form
					onSubmit={onCreate}
					encType="multipart/form-data"
					className="space-y-2"
				>
					<input
						name="name"
						placeholder="名前"
						required
						className="w-full p-2 border rounded"
					/>
					<textarea
						name="description"
						placeholder="説明"
						className="w-full p-2 border rounded resize-none"
						rows={3}
					/>
					<input
						name="price"
						type="number"
						step="0.01"
						placeholder="価格"
						required
						className="w-full p-2 border rounded"
					/>
					<select
						name="categoryId"
						required
						className="w-full p-2 border rounded"
						defaultValue=""
					>
						<option value="" disabled>
							カテゴリを選択
						</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
					<div className="flex items-center space-x-4">
						<label className="flex items-center">
							<input
								type="checkbox"
								name="available"
								value="true"
								defaultChecked
								className="mr-1"
							/>
							Available
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								name="featured"
								value="true"
								className="mr-1"
							/>
							Featured
						</label>
					</div>
					<div>
						<label htmlFor="new-image" className="block mb-1">
							画像アップロード
						</label>
						<input id="new-image" type="file" name="image" accept="image/*" />
					</div>
					<button
						type="submit"
						disabled={isPending}
						className="w-full py-2 bg-green-600 text-white rounded disabled:opacity-50"
					>
						{isPending ? "送信中…" : "作成"}
					</button>
				</form>
			</section>

			{/* ── 既存メニュー一覧 ── */}
			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{items.map((item) => (
					<div
						key={item.id}
						className="bg-white border rounded-lg shadow hover:shadow-md transition flex flex-col"
					>
						{/* 画像：object-contain で元比率を保持 */}
						<div className="w-full h-32 relative">
							{item.thumbnail ? (
								<Image
									src={item.thumbnail}
									fill
									alt={item.name}
									style={{ objectFit: "contain" }}
									className="rounded-t-lg bg-gray-50"
								/>
							) : (
								<div className="w-full h-full bg-gray-100 rounded-t-lg" />
							)}
						</div>

						<div className="p-4 flex-1 flex flex-col">
							{/* 編集フォーム */}
							<form
								onSubmit={(e) =>
									onSubmit(e, updateMenuItem, "メニューを更新しました")
								}
								encType="multipart/form-data"
								className="flex-1 flex flex-col space-y-2"
							>
								<input type="hidden" name="id" value={item.id} />

								{/* 説明フィールド */}
								<textarea
									name="description"
									defaultValue={item.description || ""}
									placeholder="説明"
									className="p-1 border rounded resize-none"
									rows={3}
								/>

								<input
									name="name"
									defaultValue={item.name}
									className="p-1 border rounded"
									required
								/>
								<input
									name="price"
									type="number"
									step="0.01"
									defaultValue={item.price.toString()}
									className="p-1 border rounded"
									required
								/>
								<select
									name="categoryId"
									defaultValue={item.categoryId}
									className="p-1 border rounded"
									required
								>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</select>
								<div className="flex items-center space-x-4">
									<label className="flex items-center">
										<input
											type="checkbox"
											name="available"
											value="true"
											defaultChecked={item.available}
											className="mr-1"
										/>
										Available
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											name="featured"
											value="true"
											defaultChecked={item.featured}
											className="mr-1"
										/>
										Featured
									</label>
								</div>
								<input type="file" name="image" accept="image/*" />
								<button
									type="submit"
									disabled={isPending}
									className="py-1 bg-blue-600 text-white rounded disabled:opacity-50"
								>
									修正
								</button>
							</form>

							{/* 削除フォーム */}
							<form
								onSubmit={(e) =>
									onSubmit(e, deleteMenuItem, "メニューを削除しました")
								}
								className="mt-2"
							>
								<input type="hidden" name="id" value={item.id} />
								<button
									type="button"
									className="w-full py-1 bg-red-600 text-white rounded"
								>
									削除
								</button>
							</form>
						</div>
					</div>
				))}
			</section>
		</div>
	);
}
