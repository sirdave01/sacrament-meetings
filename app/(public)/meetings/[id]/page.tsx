// Render the framework's not-found response when the requested record is absent.
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Reuse the detail view and its loading placeholder.
import MeetingDetailSkeleton from "@/components/MeetingDetailSkeleton";
import MeetingDetail from "@/components/MeetingDetail";

// Query the record directly rather than making an HTTP request from this server page.
import { getMeetingById } from "@/lib/meetings-db";

// Fetch and render the record inside Suspense so the shell can show a loading state.
async function MeetingDetailContent({ id }: { id: string }) {
  // Convert the dynamic route string to the numeric database key.
  const meetingId = Number(id);

  // The route data should be loaded from the shared app logic instead of fetching the same app
  // API endpoint from inside the server-rendered page, which can leave the page suspended.
  const meeting = await getMeetingById(meetingId);

  // Delegate missing records to the route's dedicated not-found UI.
  if (!meeting) {

    notFound();

  }

  // Supply the complete meeting record to the presentation component.
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <MeetingDetail meeting={meeting} />
    </main>
  );
}

// Await the dynamic segment and provide a skeleton while its data is loading.
export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Dynamic route params are asynchronous in this Next.js version.
  const { id } = await params;

  // Suspend only the data-dependent content, keeping the fallback explicit.
  return (
    <Suspense fallback={<MeetingDetailSkeleton />}>
      <MeetingDetailContent id={id} />
    </Suspense>
  );

}