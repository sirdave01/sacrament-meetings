// Build a JSON HTTP response with Next's route-handler utilities.
import { NextResponse } from "next/server";

// Reuse the same date-aware query used by server-rendered meeting pages.
import { getMeetings } from "@/lib/meetings-db";

// GET /api/meetings
// GET /api/meetings?date=2026-05-03
// Read the optional query string, then pass the value to the reusable data helper.

// Handle GET /api/meetings and the optional ?date=YYYY-MM-DD filter.
export async function GET(request: Request) {

  // Parse the query string without assuming the parameter exists.
  const date = new URL(request.url).searchParams.get("date");

  // Pass null through so the data helper can return every meeting by default.
  const meetings = await getMeetings(date);

  // Serialize the selected meeting records as a JSON response.
  return NextResponse.json(meetings);

}
