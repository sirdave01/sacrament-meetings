import MeetingCard from "@/components/MeetingCard";

import { getMeetings } from "@/lib/meetings-db";

export default function MeetingsPage() {

  // Use the shared in-memory data layer directly here.
  // Calling the app route from a server component can suspend while the same app tries
  // to resolve its own API endpoint, so this keeps the page render predictable.
  const meetings = getMeetings();

  return (

    <main className="mx-auto max-w-4xl px-4 py-12">

      <header className="mb-8">

        <h1 className="text-4xl font-bold">All Meetings</h1>

        <p className="mt-2 text-white">Browse the latest sacrament meeting schedule.</p>

      </header>

      <section aria-label="Meeting list" className="grid gap-4 md:grid-cols-2">

        {meetings.map((meeting) => (

          <MeetingCard key={meeting.id} meeting={meeting} />

        ))}

      </section>

    </main>

  );

}