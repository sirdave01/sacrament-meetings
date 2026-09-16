import { notFound } from "next/navigation";

import MeetingDetail from "@/components/MeetingDetail";

import { getMeetingById } from "@/lib/meetings-db";

export default async function MeetingDetailPage({

  params,

}: {

  params: Promise<{ id: string }>;

}) {

  // Next.js provides the dynamic route parameter as a Promise in this app setup.
  const { id } = await params;

  const meetingId = Number(id);

  // Match the URL id to the in-memory meeting record, or show a 404 page.
  const meeting = getMeetingById(meetingId);

  if (!meeting) {

    notFound();

  }

  return (

    <main className="mx-auto max-w-4xl px-4 py-12">

      <MeetingDetail meeting={meeting} />

    </main>

  );

}