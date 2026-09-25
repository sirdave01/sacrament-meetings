// Reuse the client form for creation and inline validation feedback.
import MeetingForm from "@/components/MeetingForm";
// Pass the server action into the form's useActionState hook.
import { createMeeting } from "@/lib/actions";

// Render the create screen as a server page around the interactive form.
export default function NewMeetingPage() {
	return (
		<main className="mx-auto max-w-4xl px-4 py-12">
			{/* Identify the operation above the shared form fields. */}
			<h1 className="mb-6 text-3xl font-bold">Create Meeting</h1>
			{/* The form binds submissions to the create action. */}
			<MeetingForm action={createMeeting} />
		</main>
	);
}
