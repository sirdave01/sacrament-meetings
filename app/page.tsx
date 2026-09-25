// Use Next.js image handling for the small brand mark shown on the home page.
import Image from "next/image";

// Reuse the same compact summary card used by the meetings index.
import MeetingCard from "@/components/MeetingCard";

// Load meeting records through the shared database layer.
import { getAllMeetings } from "@/lib/meetings-db";

// Render the site landing page as a server component so records are fetched on the server.
export default async function Home() {

    // Read the latest meetings from the database before building the summary list.
    const meetings = await getAllMeetings();

    return (
        /* Keep the home page content centered and aligned with the rest of the app. */
        <main className="mx-auto max-w-4xl px-4 py-12">
            {/* Introduce the planner and its main landing-page action. */}
            <section className="mb-8">
                {/* Place the site mark beside the main page heading. */}
                <div className="flex items-center gap-4">
                    <Image
                      src="/window.svg"
                      alt="Meeting schedule icon"
                      width={64}
                      height={64}
                    />
                    <h1 className="text-4xl font-bold">Sacrament Meetings</h1>
                </div>
                {/* Briefly describe what selecting a card does. */}
                <p className="mt-2 text-white text-lg">
                    Select a meeting to view its complete agenda.
                </p>
            </section>

            {/* Give the collection a screen-reader heading and list each meeting. */}
            <section aria-labelledby="meetings-heading">
                <h2 id="meetings-heading" className="sr-only">Available meetings</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Stable IDs let React keep each card associated with its meeting. */}
                    {meetings.map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                </div>
            </section>
        </main>
    );
}