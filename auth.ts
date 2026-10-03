import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { z } from "zod";

import { authConfig } from "@/auth.config";

const credentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const parsed = credentialsSchema.safeParse(credentials);
				const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
				const passwordHash = process.env.AUTH_ADMIN_PASSWORD_HASH;

				if (!parsed.success || !adminEmail || !passwordHash) {
					return null;
				}

				const email = parsed.data.email.trim().toLowerCase();
				if (email !== adminEmail || !(await bcrypt.compare(parsed.data.password, passwordHash))) {
					return null;
				}

				return { id: adminEmail, name: "Meeting Planner Admin", email: adminEmail };
			},
		}),
	],
});