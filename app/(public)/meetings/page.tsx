import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";

import { fetchFilteredMeetings, fetchMeetingsPages } from "@/lib/meetings-db";

interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>;
}

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.query) ? params.query[0] ?? "" : params.query ?? "";
  const requestedPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = Number(requestedPage);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const totalPages = await fetchMeetingsPages(query);
  const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const meetings = await fetchFilteredMeetings(query, currentPage);


  return (

    <main className="mx-auto max-w-4xl px-4 py-12">

      <header className="mb-8">

        <h1 className="text-4xl font-bold">All Meetings</h1>

        <p className="mt-2 text-white">Browse the latest sacrament meeting schedule.</p>

        <div className="mt-6">
          <MeetingSearch key={query} initialQuery={query} />
        </div>

      </header>

      <section aria-label="Meeting list" className="grid gap-4 md:grid-cols-2">

        {meetings.map((meeting) => (

          <MeetingCard key={meeting.id} meeting={meeting} />

        ))}

      </section>

      <Pagination totalPages={totalPages} />

    </main>

  );

}