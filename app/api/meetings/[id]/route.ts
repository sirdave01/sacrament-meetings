import { NextResponse } from "next/server";

import { getMeetingById } from "@/lib/meetings-db";

// GET /api/meetings/[id]
// Returns the matching meeting, or a clear HTTP error when the input is invalid.
export async function GET(

  _request: Request,

  { params }: { params: Promise<{ id: string }> }

) {

  const { id } = await params;

  // The route parameter must be a real numeric ID.
  const meetingId = Number(id);

  if (!id || Number.isNaN(meetingId) || !Number.isInteger(meetingId) || meetingId <= 0) {

    return NextResponse.json(

      { error: "The meeting id must be a valid positive number." },

      { status: 400 }

    );

  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {

    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });

  }

  return NextResponse.json(meeting);

}
