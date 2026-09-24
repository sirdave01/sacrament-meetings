import { notFound } from "next/navigation";
import { Suspense } from "react";

import MeetingDetailSkeleton from "@/components/MeetingDetailSkeleton";
import MeetingDetail from "@/components/MeetingDetail";

import { getMeetingById } from "@/lib/meetings-db";

async function MeetingDetailContent({ id }: { id: string }) {
  const meetingId = Number(id);

  // The route data should be loaded from the shared app logic instead of fetching the same app
  // API endpoint from inside the server-rendered page, which can leave the page suspended.
  const meeting = await getMeetingById(meetingId);

  if (!meeting) {

    notFound();

  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <MeetingDetail meeting={meeting} />
    </main>
  );
}

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<MeetingDetailSkeleton />}>
      <MeetingDetailContent id={id} />
    </Suspense>
  );

}