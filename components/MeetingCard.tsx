// Summary view: the full meeting object is passed in one typed prop.

// Navigate to the selected meeting without a full page reload.
import Link from "next/link";

// Submit deletions directly to the server action.
import { deleteMeeting } from "@/lib/actions";
// Reuse the domain type so a card always receives a complete meeting record.
import type { SacramentMeeting } from "@/lib/types";

// Keep the card's prop contract explicit for its list and home-page callers.
interface MeetingCardProps {

    meeting: SacramentMeeting;

}

// Present a meeting summary and its edit/delete controls.
export default function MeetingCard({ meeting }: MeetingCardProps) {

    // Link the summary to its detail route and keep mutations outside that link.
    return (
        <article className="rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
            <Link href={`/meetings/${meeting.id}`} className="block">
                {/* Convert the stored lowercase meeting type into a display label. */}
                <h2 className="mb-2 text-xl font-semibold text-black">
                    {meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} Sacrament Meeting
                </h2>
                {/* Format the ISO date for the visitor's locale. */}
                <p className="mb-1 text-black">Date: {new Date(meeting.date).toLocaleDateString()}</p>
                <p className="text-black">Presiding: {meeting.presiding}</p>
            </Link>
            {/* Keep edit navigation and the independent delete form side by side. */}
            <div className="mt-4 flex gap-3">
                <Link href={`/meetings/${meeting.id}/edit`} className="rounded border px-3 py-1 text-sm font-semibold text-black">Edit</Link>
                {/* Include only this card's ID so the action targets the correct record. */}
                <form action={deleteMeeting}>
                    <input type="hidden" name="id" value={meeting.id} />
                    <button type="submit" className="rounded border border-red-700 px-3 py-1 text-sm font-semibold text-red-700">Delete</button>
                </form>
            </div>
        </article>

    );

}