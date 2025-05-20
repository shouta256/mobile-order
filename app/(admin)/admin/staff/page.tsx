// app/(admin)/admin/staff/page.tsx
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { updateStaff, deleteStaff } from "./actions";
import StaffForm from "./staff-form";

export default async function StaffManagementPage() {
	// 認可チェック
	await requireAdmin();

	// STAFF ロールのユーザー一覧を email 昇順で取得
	const staff = await prisma.user.findMany({
		where: { role: "STAFF" },
		orderBy: { email: "asc" },
	});

	return (
		<div className="container mx-auto px-4 py-8 space-y-10">
			<h1 className="text-2xl font-bold">スタッフ管理</h1>

			{/* 新規登録フォーム */}
			<section className="max-w-md">
				<h2 className="font-semibold mb-2">新規スタッフ登録</h2>
				<StaffForm />
			</section>

			{/* 一覧・編集・削除 */}
			<section>
				<h2 className="font-semibold mb-2">
					登録済みスタッフ ({staff.length})
				</h2>
				{staff.length === 0 ? (
					<p>まだスタッフが登録されていません。</p>
				) : (
					<table className="w-full text-sm border">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-2 py-1">Email</th>
								<th className="px-2 py-1">名前</th>
								<th className="px-2 py-1">操作</th>
							</tr>
						</thead>
						<tbody>
							{staff.map((s) => (
								<tr key={s.id} className="border-t">
									<td className="px-2 py-1">{s.email}</td>
									<td className="px-2 py-1">
										<form action={updateStaff} className="flex space-x-2">
											<input type="hidden" name="id" value={s.id} />
											<input
												name="name"
												defaultValue={s.name ?? ""}
												className="p-1 border rounded"
												required
											/>
											<button
												type="submit"
												className="px-2 py-1 bg-blue-600 text-white rounded"
											>
												更新
											</button>
										</form>
									</td>
									<td className="px-2 py-1">
										<form action={deleteStaff}>
											<input type="hidden" name="id" value={s.id} />
											<button
												type="submit"
												className="px-2 py-1 bg-red-600 text-white rounded"
											>
												削除
											</button>
										</form>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</section>
		</div>
	);
}
