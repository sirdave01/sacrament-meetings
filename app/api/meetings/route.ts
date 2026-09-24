import { NextResponse } from "next/server";

import { getMeetings } from "@/lib/meetings-db";

// GET /api/meetings
// GET /api/meetings?date=2026-05-03
// Read the optional query string, then pass the value to the reusable data helper.

export async function GET(request: Request) {

  const date = new URL(request.url).searchParams.get("date");

  const meetings = await getMeetings(date);

  return NextResponse.json(meetings);

}
