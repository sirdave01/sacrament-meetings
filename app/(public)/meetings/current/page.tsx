import { redirect } from "next/navigation";

import { getAllMeetings } from "@/lib/meetings-db";

export default async function CurrentMeetingPage() {

  // Use the meeting date closest to today as the current Sunday meeting.
  const meetings = await getAllMeetings();

  const today = new Date();

  let targetMeeting = meetings[0];

  let closestDifference = Number.POSITIVE_INFINITY;

  meetings.forEach((meeting) => {

    const meetingDate = new Date(meeting.date);

    const difference = Math.abs(meetingDate.getTime() - today.getTime());

    if (difference < closestDifference) {

      closestDifference = difference;

      targetMeeting = meeting;

    }

  });

  redirect(`/meetings/${targetMeeting.id}`);

}