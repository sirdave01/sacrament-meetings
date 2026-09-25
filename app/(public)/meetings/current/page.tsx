// Send the user to the detail route selected below.
import { redirect } from "next/navigation";

// Read meeting records through the shared database layer.
import { getAllMeetings } from "@/lib/meetings-db";

// Find the scheduled meeting whose date is closest to today, then open its detail page.
export default async function CurrentMeetingPage() {

  // Load all available dates because the closest meeting may be in the past or future.
  const meetings = await getAllMeetings();

  // Use the current instant as the reference for comparing meeting dates.
  const today = new Date();

  // Start with the first meeting as the provisional closest result.
  let targetMeeting = meetings[0];

  // Any real date difference will be smaller than this initial bound.
  let closestDifference = Number.POSITIVE_INFINITY;

  // Compare every meeting date and keep the record with the smallest absolute distance.
  meetings.forEach((meeting) => {

    // Convert the stored ISO date into a timestamp for arithmetic.
    const meetingDate = new Date(meeting.date);

    // Absolute distance treats a past date and a future date symmetrically.
    const difference = Math.abs(meetingDate.getTime() - today.getTime());

    // Replace the current selection only when this meeting is closer.
    if (difference < closestDifference) {

      closestDifference = difference;

      targetMeeting = meeting;

    }

  });

  // Navigate directly to the selected record's canonical detail URL.
  redirect(`/meetings/${targetMeeting.id}`);

}