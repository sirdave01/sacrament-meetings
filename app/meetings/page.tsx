import MeetingCard from "@/components/MeetingCard";

import { getAllMeetings } from "@/lib/meetings-db";

export default function MeetingsPage() {

  // Pull all stored meetings so the list page can render each one as a card.
  const meetings = getAllMeetings();

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