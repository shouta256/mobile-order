// lib/authOptions.ts
import NextAuth, { type AuthOptions, type User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";
import { compare } from "bcrypt";

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),

	// Use JWT session
	session: { strategy: "jwt" },

	providers: [
		// Email/Password
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Invalid credentials");
				}
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) throw new Error("User not found");
				const isValid = await compare(credentials.password, user.password);
				if (!isValid) throw new Error("Invalid password");
				return user;
			},
		}),

		// Google OAuth
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
			// Google profile has no role, so set CUSTOMER
			profile(profile): User {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					role: "CUSTOMER",
				};
			},
		}),
	],

	callbacks: {
		// Add id, role, picture to JWT
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = (user as User).role;
				token.picture = (user as User).image;
			}
			return token;
		},
		// Copy from token to session
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.image = token.picture as string;
			}
			return session;
		},
	},

	events: {
		// Set default role for new users
		createUser: async ({ user }) => {
			await prisma.user.update({
				where: { id: user.id },
				data: { role: "CUSTOMER" },
			});
		},
	},
};

export default NextAuth(authOptions);
