"use client";

import { useActionState } from "react";

import { authenticate } from "@/lib/actions";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
	const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

	return (
		<form action={formAction} className="space-y-5">
			<input type="hidden" name="callbackUrl" value={callbackUrl} />
			<div>
				<label htmlFor="email" className="mb-1 block font-medium">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="username"
					required
					className="w-full rounded border border-gray-400 px-3 py-2 text-gray-950"
				/>
			</div>
			<div>
				<label htmlFor="password" className="mb-1 block font-medium">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					minLength={8}
					required
					className="w-full rounded border border-gray-400 px-3 py-2 text-gray-950"
				/>
			</div>
			<button
				type="submit"
				disabled={isPending}
				className="w-full rounded bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
			>
				{isPending ? "Signing in..." : "Sign In"}
			</button>
			{errorMessage && <p role="alert" className="text-red-700">{errorMessage}</p>}
		</form>
	);
}