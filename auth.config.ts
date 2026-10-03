import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	pages: {
		signIn: "/login",
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const pathname = nextUrl.pathname;
			const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
			const userEmail = auth?.user?.email?.trim().toLowerCase();
			const isAuthorizedAdmin = Boolean(adminEmail && userEmail === adminEmail);
			const isManagementRoute =
				pathname === "/meetings/new" ||
				pathname.startsWith("/meetings/new/") ||
				/^\/meetings\/[^/]+\/edit(?:\/|$)/.test(pathname);

			if (isManagementRoute && !isAuthorizedAdmin) {
				return false;
			}

			if (pathname === "/login" && isAuthorizedAdmin) {
				return Response.redirect(new URL("/meetings/new", nextUrl));
			}

			return true;
		},
	},
	providers: [],
} satisfies NextAuthConfig;