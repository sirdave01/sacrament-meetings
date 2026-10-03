import type { Metadata } from "next";

import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
	title: "Admin Sign In",
	description: "Sign in to manage the Osigwe Ward sacrament meeting planner.",
};

type LoginPageProps = {
	searchParams: Promise<{ callbackUrl?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const params = await searchParams;
	const requestedCallback = Array.isArray(params.callbackUrl) ? params.callbackUrl[0] : params.callbackUrl;
	const callbackUrl = requestedCallback?.startsWith("/") && !requestedCallback.startsWith("//")
		? requestedCallback
		: "/meetings/new";

	return (
		<main className="mx-auto max-w-md px-4 py-16">
			<h1 className="mb-2 text-3xl font-bold">Admin Sign In</h1>
			<p className="mb-8 text-gray-700">Sign in to manage meeting schedules.</p>
			<LoginForm callbackUrl={callbackUrl} />
		</main>
	);
}