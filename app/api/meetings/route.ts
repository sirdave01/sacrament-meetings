import { NextResponse } from "next/server";

import { getAllMeetings } from "@/lib/meetings-db";

// This route exposes the meeting collection as JSON for API consumers.
export async function GET() {

  const meetings = getAllMeetings();

  return NextResponse.json(meetings);

}
