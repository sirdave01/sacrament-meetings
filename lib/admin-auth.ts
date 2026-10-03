import { auth } from "@/auth";

export async function isAuthorizedAdmin() {
	const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
	if (!adminEmail) {
		return false;
	}

	const userEmail = (await auth())?.user?.email?.trim().toLowerCase();
	return userEmail === adminEmail;
}

export async function requireAdminSession() {
	if (!(await isAuthorizedAdmin())) {
		throw new Error("Not authorized.");
	}
}