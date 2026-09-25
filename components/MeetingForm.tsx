"use client";

// Use React's action-state hook to connect server validation results to this form.
import { useActionState } from "react";

// Share the exact state shape returned by the meeting Server Actions.
import type { State } from "@/lib/actions";
// Use the meeting domain type for default values and edit mode.
import type { SacramentMeeting } from "@/lib/types";

// Both create and update actions receive form state first, then native form data.
type MeetingAction = (state: State, formData: FormData) => Promise<State>;

// Supply a complete, valid-shaped object when the form is creating a new record.
const emptyMeeting: Omit<SacramentMeeting, "id"> = {
    // The create view replaces this blank date with today's date at render time.
    date: "",
    // Regular is the most common choice and serves as the initial selection.
    meetingType: "regular",
    // Start name fields empty so the user supplies the meeting's leaders.
    presiding: "",
    conducting: "",
    // JSON-array fields start empty but retain their expected data shape.
    announcements: [],
    // Use placeholder hymn objects so the JSON textareas remain editable.
    openingHymn: { number: 1, title: "" },
    openingPrayer: "",
    wardBusiness: [],
    // The optional stake agenda is disabled unless the user checks it.
    stakeBusiness: false,
    sacramentHymn: { number: 1, title: "" },
    speakers: [],
    closingHymn: { number: 1, title: "" },
    closingPrayer: "",
};

// Match the Server Action's return shape before any submission has occurred.
const initialState: State = { errors: {}, message: null };

// Render one paragraph for every validation message associated with a field.
function errorMessages(state: State, field: keyof NonNullable<State["errors"]>) {
    // Keys keep repeated messages stable while the action state changes.
    return state.errors?.[field]?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-700">{error}</p>
    ));
}

// Keep a persistent description target so every control can reference its errors.
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
    return <div id={id} aria-live="polite" aria-atomic="true">{children}</div>;
}

// Format structured values for readable editing in the JSON textareas.
function jsonValue(value: unknown) {
    return JSON.stringify(value, null, 2);
}

// Reuse one accessible form for both create and update workflows.
export default function MeetingForm({ meeting, action }: { meeting?: SacramentMeeting; action: MeetingAction }) {
    // Track server validation output, the submission action, and pending state together.
    const [state, formAction, isPending] = useActionState(action, initialState);
    // Existing records supply edit values; create mode uses defaults and today's date.
    const values = meeting ?? { ...emptyMeeting, date: new Date().toISOString().split("T")[0] };

    // The action attached here receives the browser's native FormData on submit.
    return (
        <form action={formAction} className="mx-auto max-w-3xl space-y-6 rounded-lg bg-white p-6 text-black shadow-md">
            {/* Keep date, type, and leadership/prayer fields in the first grid. */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="date" className="mb-1 block font-semibold">Date</label>
                    <input id="date" name="date" type="date" defaultValue={values.date} aria-describedby="date-error" required className="w-full rounded border p-2" />
                    <FieldError id="date-error">{errorMessages(state, "date")}</FieldError>
                </div>
                <div>
                    <label htmlFor="meetingType" className="mb-1 block font-semibold">Meeting type</label>
                    <select id="meetingType" name="meetingType" defaultValue={values.meetingType} aria-describedby="meetingType-error" className="w-full rounded border p-2">
                        <option value="regular">Regular</option>
                        <option value="testimony">Testimony</option>
                        <option value="stake">Stake</option>
                        <option value="general">General</option>
                    </select>
                    <FieldError id="meetingType-error">{errorMessages(state, "meetingType")}</FieldError>
                </div>
                {/* Generate repeated text controls while preserving field-specific IDs. */}
                {(["presiding", "conducting", "openingPrayer", "closingPrayer"] as const).map((field) => (
                    <div key={field}>
                        <label htmlFor={field} className="mb-1 block font-semibold">{field.replace(/([A-Z])/g, " $1")}</label>
                        <input id={field} name={field} type="text" defaultValue={values[field]} aria-describedby={`${field}-error`} required className="w-full rounded border p-2" />
                        <FieldError id={`${field}-error`}>{errorMessages(state, field)}</FieldError>
                    </div>
                ))}
            </div>

            {/* Keep the three hymn JSON controls aligned as a separate group. */}
            <div className="grid gap-5 sm:grid-cols-3">
                {/* The shared loop gives each hymn its matching label and inline error region. */}
                {(["openingHymn", "sacramentHymn", "closingHymn"] as const).map((field) => (
                    <div key={field}>
                        <label htmlFor={field} className="mb-1 block font-semibold">{field.replace(/([A-Z])/g, " $1")} (JSON)</label>
                        <textarea id={field} name={field} defaultValue={jsonValue(values[field])} aria-describedby={`${field}-error`} rows={4} required className="w-full rounded border p-2 font-mono text-sm" />
                        <FieldError id={`${field}-error`}>{errorMessages(state, field)}</FieldError>
                    </div>
                ))}
            </div>

            {/* Keep variable-length agenda lists editable as JSON arrays. */}
            {(["announcements", "wardBusiness", "speakers"] as const).map((field) => (
                <div key={field}>
                    <label htmlFor={field} className="mb-1 block font-semibold">{field.replace(/([A-Z])/g, " $1")} (JSON array)</label>
                    <textarea id={field} name={field} defaultValue={jsonValue(values[field])} aria-describedby={`${field}-error`} rows={4} required className="w-full rounded border p-2 font-mono text-sm" />
                    <FieldError id={`${field}-error`}>{errorMessages(state, field)}</FieldError>
                </div>
            ))}

            {/* Use a labeled checkbox for the optional stake-business flag. */}
            <div>
                <label htmlFor="stakeBusiness" className="flex items-center gap-2 font-semibold">
                    <input id="stakeBusiness" name="stakeBusiness" type="checkbox" defaultChecked={values.stakeBusiness} aria-describedby="stakeBusiness-error" />
                    Stake business included
                </label>
                <FieldError id="stakeBusiness-error">{errorMessages(state, "stakeBusiness")}</FieldError>
            </div>

            {/* Announce form-level validation feedback in addition to field-specific errors. */}
            {state.message ? <p role="alert" className="text-sm text-red-700">{state.message}</p> : null}
            {/* Prevent duplicate submissions while the server action is running. */}
            <button type="submit" disabled={isPending} className="rounded bg-black px-5 py-2 font-semibold text-white disabled:opacity-50">
                {isPending ? "Saving..." : meeting ? "Update meeting" : "Create meeting"}
            </button>
        </form>
    );
}