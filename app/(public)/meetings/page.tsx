// Reuse the shared meeting summary view for every result.
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";

// Query records and page counts through the shared database helpers.
import { fetchFilteredMeetings, fetchMeetingsPages } from "@/lib/meetings-db";

// Next supplies search parameters asynchronously, and repeated query keys may form arrays.
interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>;
}

// Resolve URL state on the server, then render the matching page of meetings.
export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  // Await the route's search parameters before deriving the filter and page.
  const params = await searchParams;
  // Normalize repeated query parameters by selecting their first value.
  const query = Array.isArray(params.query) ? params.query[0] ?? "" : params.query ?? "";
  // Read the requested page, likewise accepting repeated page keys.
  const requestedPage = Array.isArray(params.page) ? params.page[0] : params.page;
  // Convert only a positive integer page number; malformed values start at page one.
  const parsedPage = Number(requestedPage);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  // Count matching records first so the requested page can be clamped to the available range.
  const totalPages = await fetchMeetingsPages(query);
  const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  // Fetch just the matching results for the normalized page.
  const meetings = await fetchFilteredMeetings(query, currentPage);

  return (
    // Constrain the page width while leaving the list as a primary page region.
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* Keep the page title, search control, and results context together. */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold">All Meetings</h1>
        <p className="mt-2 text-white">Browse the latest sacrament meeting schedule.</p>
        <div className="mt-6">
          {/* Reset the input when the server-rendered query changes. */}
          <MeetingSearch key={query} initialQuery={query} />
        </div>
      </header>

      {/* Render each result with its stable database ID as the React key. */}
      <section aria-label="Meeting list" className="grid gap-4 md:grid-cols-2">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </section>

      {/* Keep pagination synchronized with the filtered result count. */}
      <Pagination totalPages={totalPages} />
    </main>
  );
}