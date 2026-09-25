"use client";

// Provide a safe destination after a route-level rendering failure.
import Link from "next/link";
// Observe boundary errors without exposing their internals in the page.
import { useEffect } from "react";

// Share one error UI between public and admin meeting route groups.
export default function MeetingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    // Log the caught error for diagnostics when the boundary receives a new failure.
    useEffect(() => {
        console.error("Meetings route error:", error);
    }, [error]);

    // Offer a retry and a dependable link back to the meeting index.
    return (
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
            <h1 className="text-3xl font-bold">Something went wrong</h1>
            <p className="mt-3">We could not load the meetings. Please try again.</p>
            <div className="mt-6 flex justify-center gap-3">
                {/* Ask Next to retry rendering the failed route segment. */}
                <button type="button" onClick={reset} className="rounded bg-black px-4 py-2 font-semibold text-white">Try Again</button>
                {/* Let the visitor leave the failed route entirely. */}
                <Link href="/meetings" className="rounded border px-4 py-2 font-semibold">Back to meetings</Link>
            </div>
        </main>
    );
}