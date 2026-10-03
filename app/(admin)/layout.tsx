// Type the children slot supplied by every route in this route group.
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { isAuthorizedAdmin } from "@/lib/admin-auth";


// Require a signed-in owner before rendering any management route.
export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	if (!(await isAuthorizedAdmin())) {
		redirect("/login");
	}

	return (
		<>
			<div className="mx-auto flex max-w-4xl justify-end px-4 pt-4">
				<form action={async () => {
					"use server";
					await signOut({ redirectTo: "/" });
				}}>
					<button type="submit" className="rounded border border-gray-500 px-3 py-1 text-sm hover:bg-gray-100">
						Sign Out
					</button>
				</form>
			</div>
			{children}
		</>
	);
}
