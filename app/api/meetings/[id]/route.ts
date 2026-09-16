import { NextResponse } from "next/server";

import { getMeetingById } from "@/lib/meetings-db";

// This route returns one meeting by its numeric id from the URL segment.
export async function GET(

  _request: Request,

  { params }: { params: Promise<{ id: string }> }

) {

  const { id } = await params;

  const meeting = getMeetingById(Number(id));

  if (!meeting) {

    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });

  }

  return NextResponse.json(meeting);

}
