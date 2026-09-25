// Centralize domain types so database, actions, routes, and components agree on record shapes.

// Restrict meeting categories to the values accepted by the form and database.
export type MeetingType =
    
    | "testimony"

    | "regular"
    
    | "stake"
    
    | "general";

// Describe one scheduled hymn in the meeting agenda.
export interface Hymn {

    // Store the hymnbook number as a numeric value.
    number: number;

    // Keep the human-readable hymn title beside its number.
    title: string;

}

// Describe either a speaker or a musical number in agenda order.
export interface SpeakerItem {

    // Identify the participant or musical group.
    name: string;

    // Record the assigned topic or description.
    topic: string;

    // Distinguish spoken remarks from a musical selection.
    type: "speaker" | "musical-number";

}

// Keep each ward-business agenda entry as a displayable description.
export interface WardBusinessItem {

    // Text shown in the ward business section.
    description: string;

}

// Define the complete meeting record shared throughout the application.
export interface SacramentMeeting {

    // Database primary key used by dynamic routes and mutations.
    id: number;

    // Calendar date stored in ISO YYYY-MM-DD form.
    date: string;           // ISO date string: "YYYY-MM-DD"

    // Select the meeting format from the supported categories.
    meetingType: MeetingType;

    // Name of the person presiding over the meeting.
    presiding: string;

    // Name of the person conducting the meeting.
    conducting: string;

    // Optional announcements shown only when at least one is present.
    announcements?: string[];

    // Hymn and prayer that open the meeting.
    openingHymn: Hymn;

    openingPrayer: string;

    // Ordered ward-business agenda entries.
    wardBusiness: WardBusinessItem[];

    // Indicates whether stake business is part of this meeting.
    stakeBusiness: boolean;

    // Hymn sung before the sacrament ordinance.
    sacramentHymn: Hymn;

    // Ordered speaker and musical-number entries.
    speakers: SpeakerItem[];

    // Hymn and prayer that close the meeting.
    closingHymn: Hymn;

    closingPrayer: string;

}
