import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import type { User } from "@prisma/client";

/**
 * Create a credentials user for NextAuth via Prisma.
 * Always assigns CUSTOMER role and omits password in the response.
 */
export async function signUpUser(
  email: string,
  password: string,
  name: string,
): Promise<Omit<User, "password">> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: "CUSTOMER",
    },
  });

  const { password: _pw, ...rest } = user;
  return rest;
}
