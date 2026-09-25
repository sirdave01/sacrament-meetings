// Use client-side navigation to return to the meetings index.
import Link from "next/link";

// Show a route-specific message when an edit target does not exist.
export default function MeetingNotFound() {
	// Keep the message and recovery link centered and easy to locate.
    return (
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
            <h1 className="text-3xl font-bold">Meeting not found</h1>
            {/* Explain why the edit route could not be opened. */}
            <p className="mt-3">The meeting you are looking for does not exist.</p>
            {/* Give the user a direct route back to the available records. */}
            <Link href="/meetings" className="mt-6 inline-block rounded border px-4 py-2 font-semibold">Back to meetings</Link>
        </main>
    );
}