// Render the dedicated 404 UI when the ID is invalid or has no matching record.
import { notFound } from "next/navigation";

// Reuse the accessible form for editing an existing meeting.
import MeetingForm from "@/components/MeetingForm";
// Bind the record key before the form submits its previous state and form data.
import { updateMeeting } from "@/lib/actions";
// Load the record directly through the shared database layer.
import { getMeetingById } from "@/lib/meetings-db";

// Resolve the dynamic URL key and prepare the existing record for the edit form.
export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
	// Dynamic route params are promises in this Next.js version.
	const { id } = await params;
	// Convert the URL segment to the numeric primary key used by the database.
	const meetingId = Number(id);

	// Reject malformed, fractional, zero, and negative IDs before querying SQL.
	if (!Number.isInteger(meetingId) || meetingId < 1) {
		notFound();
	}

	// Fetch the exact record requested by the dynamic route.
	const meeting = await getMeetingById(meetingId);

	// Treat a valid-looking but missing ID as a not-found route.
	if (!meeting) {
		notFound();
	}

	// Render the existing values and bind updates to this meeting's ID.
	return (
		<main className="mx-auto max-w-4xl px-4 py-12">
			<h1 className="mb-6 text-3xl font-bold">Edit Meeting</h1>
			{/* Bind the key so the shared form can call updateMeeting for this record. */}
			<MeetingForm meeting={meeting} action={updateMeeting.bind(null, meetingId)} />
		</main>
	);
}
