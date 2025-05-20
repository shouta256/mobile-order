// next-auth.d.ts
import NextAuth, {
	type DefaultSession,
	type DefaultUser,
	JWT,
} from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: string;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		id: string;
		role: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
	}
}
