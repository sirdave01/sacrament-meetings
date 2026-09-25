"use server";

// Refresh server-rendered meeting data after successful mutations.
import { revalidatePath } from "next/cache";
// Return users to the list after each completed write.
import { redirect } from "next/navigation";
// Validate untrusted form data before converting or storing it.
import { z } from "zod";

import {
    createMeeting as insertMeeting,
    deleteMeeting as removeMeeting,
    updateMeeting as saveMeeting,
} from "@/lib/meetings-db";
// Alias database functions to distinguish them from the Server Action exports below.
import type { SacramentMeeting } from "@/lib/types";

// Require a positive hymn number and a nonempty title inside the JSON field.
const hymnSchema = z.object({
    number: z.number().int().positive(),
    title: z.string().trim().min(1),
});

// Parse a JSON textarea and validate its decoded value against the field's schema.
const jsonValue = (schema: z.ZodType, message: string) => z.string().refine((value) => {
    try {
        return schema.safeParse(JSON.parse(value)).success;
    } catch {
        return false;
    }
}, message);

// Validate every raw field before converting it to a database-ready meeting.
const MeetingFormSchema = z.object({
    // Require a real calendar date, not just a string with the right shape.
    date: z.string().refine((value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
        }

        const parsedDate = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
    }, "Enter a valid date."),
    // Restrict meeting type to the categories supported by the domain model.
    meetingType: z.enum(["testimony", "regular", "stake", "general"]),
    presiding: z.string().trim().min(1, "Enter the presiding person's name."),
    conducting: z.string().trim().min(1, "Enter the conductor's name."),
    // Validate each textarea's parsed structure as well as its JSON syntax.
    announcements: jsonValue(z.array(z.string()), "Enter a valid JSON array of announcements."),
    openingHymn: jsonValue(hymnSchema, "Enter a valid hymn with a number and title."),
    openingPrayer: z.string().trim().min(1, "Enter the opening prayer name."),
    wardBusiness: jsonValue(z.array(z.object({ description: z.string().trim().min(1) })), "Enter a valid JSON array of ward business."),
    stakeBusiness: z.enum(["true", "false"]),
    sacramentHymn: jsonValue(hymnSchema, "Enter a valid hymn with a number and title."),
    speakers: jsonValue(z.array(z.object({
        name: z.string().trim().min(1),
        topic: z.string().trim().min(1),
        type: z.enum(["speaker", "musical-number"]),
    })), "Enter a valid JSON array of speakers and musical numbers."),
    closingHymn: jsonValue(hymnSchema, "Enter a valid hymn with a number and title."),
    closingPrayer: z.string().trim().min(1, "Enter the closing prayer name."),
});

// Shape returned by create/update actions for inline errors and form-level messages.
export type State = {
    errors?: Partial<Record<keyof z.infer<typeof MeetingFormSchema>, string[]>>;
    message?: string | null;
};

// Read named controls from FormData and normalize the optional checkbox value.
function getFormValues(formData: FormData) {
    return {
        date: formData.get("date"),
        meetingType: formData.get("meetingType"),
        presiding: formData.get("presiding"),
        conducting: formData.get("conducting"),
        announcements: formData.get("announcements"),
        openingHymn: formData.get("openingHymn"),
        openingPrayer: formData.get("openingPrayer"),
        wardBusiness: formData.get("wardBusiness"),
        // Unchecked checkboxes are absent from FormData, so represent both cases explicitly.
        stakeBusiness: formData.get("stakeBusiness") === "on" ? "true" : "false",
        sacramentHymn: formData.get("sacramentHymn"),
        speakers: formData.get("speakers"),
        closingHymn: formData.get("closingHymn"),
        closingPrayer: formData.get("closingPrayer"),
    };
}

// Convert already-validated form values into the domain shape expected by SQL helpers.
function toMeeting(data: z.infer<typeof MeetingFormSchema>): Omit<SacramentMeeting, "id"> {
    return {
        date: data.date,
        meetingType: data.meetingType,
        presiding: data.presiding,
        conducting: data.conducting,
        // Decode JSON fields only after Zod has confirmed their structures.
        announcements: JSON.parse(data.announcements) as string[],
        openingHymn: JSON.parse(data.openingHymn) as SacramentMeeting["openingHymn"],
        openingPrayer: data.openingPrayer,
        wardBusiness: JSON.parse(data.wardBusiness) as SacramentMeeting["wardBusiness"],
        stakeBusiness: data.stakeBusiness === "true",
        sacramentHymn: JSON.parse(data.sacramentHymn) as SacramentMeeting["sacramentHymn"],
        speakers: JSON.parse(data.speakers) as SacramentMeeting["speakers"],
        closingHymn: JSON.parse(data.closingHymn) as SacramentMeeting["closingHymn"],
        closingPrayer: data.closingPrayer,
    };
}

// Validate and insert a meeting, returning field errors without writing invalid input.
export async function createMeeting(prevState: State, formData: FormData): Promise<State> {
    // The previous state is part of React's useActionState signature but not needed here.
    void prevState;
    // safeParse keeps validation failures in the form state rather than throwing.
    const validatedFields = MeetingFormSchema.safeParse(getFormValues(formData));

    // Return field-specific messages so the client form can announce them inline.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the highlighted fields.",
        };
    }

    // Catch database failures separately from validation and expose a friendly message.
    try {
        await insertMeeting(toMeeting(validatedFields.data));
    } catch (error) {
        console.error("Error creating meeting:", error);
        throw new Error("Failed to create the meeting. Please try again later.");
    }

    // Invalidate the list after the insert, then navigate back to the refreshed list.
    revalidatePath("/meetings");
    redirect("/meetings");
}

// Validate and replace the meeting identified by the ID bound by the edit page.
export async function updateMeeting(id: number, prevState: State, formData: FormData): Promise<State> {
    // Keep React's action-state signature while relying on fresh validation results.
    void prevState;
    // Refuse the write unless every submitted field passes the shared schema.
    const validatedFields = MeetingFormSchema.safeParse(getFormValues(formData));

    // Preserve field-level feedback for invalid edit submissions.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the highlighted fields.",
        };
    }

    // Log the original database error but return only a safe message to the caller.
    try {
        await saveMeeting(id, toMeeting(validatedFields.data));
    } catch (error) {
        console.error("Error updating meeting:", error);
        throw new Error("Failed to update the meeting. Please try again later.");
    }

    // Refresh the list and leave the edit route after a successful update.
    revalidatePath("/meetings");
    redirect("/meetings");
}

// Validate the hidden form ID, delete the matching row, and return to the list.
export async function deleteMeeting(formData: FormData): Promise<void> {
    // Only accept a plain positive integer string from the submitted form.
    const rawId = formData.get("id");
    const id = typeof rawId === "string" && /^\d+$/.test(rawId) ? Number(rawId) : NaN;

    // Reject malformed IDs before they reach the database helper.
    if (!Number.isInteger(id) || id < 1) {
        throw new Error("Invalid meeting ID.");
    }

    // Log unexpected database failures while keeping the user-facing error generic.
    try {
        await removeMeeting(id);
    } catch (error) {
        console.error("Error deleting meeting:", error);
        throw new Error("Failed to delete the meeting. Please try again later.");
    }

    // Refresh the list before sending the browser back to it.
    revalidatePath("/meetings");
    redirect("/meetings");
}