// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { signUp } from "@/lib/auth-server";

export async function POST(request: Request) {
	const { email, password, name } = await request.json();
	try {
		const user = await signUp(email, password, name);
		return NextResponse.json({ user });
	} catch (err: unknown) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "登録に失敗しました" },
			{ status: 400 },
		);
	}
}
