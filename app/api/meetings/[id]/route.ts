// Build JSON responses, including explicit client-error status codes.
import { NextResponse } from "next/server";

// Fetch the requested record through the same helper used by the page routes.
import { getMeetingById } from "@/lib/meetings-db";

// GET /api/meetings/[id]
// Returns the matching meeting, or a clear HTTP error when the input is invalid.
// Handle GET /api/meetings/[id] for one meeting record.
export async function GET(

  _request: Request,

  { params }: { params: Promise<{ id: string }> }

) {

  // Await the dynamic segment before parsing its string representation.
  const { id } = await params;

  // The route parameter must be a real numeric ID.
  const meetingId = Number(id);

  // Reject empty, nonnumeric, fractional, zero, and negative route IDs.
  if (!id || Number.isNaN(meetingId) || !Number.isInteger(meetingId) || meetingId <= 0) {

    return NextResponse.json(

      { error: "The meeting id must be a valid positive number." },

      { status: 400 }

    );

  }

  // Query only after the route key has passed numeric validation.
  const meeting = await getMeetingById(meetingId);

  // Distinguish an absent record from malformed client input.
  if (!meeting) {

    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });

  }

  // Return the found meeting with the default success status.
  return NextResponse.json(meeting);

}
