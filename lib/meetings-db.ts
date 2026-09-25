// Use Neon Serverless to run parameterized PostgreSQL queries from the server.

// Reuse the domain type for database row conversion and mutation inputs.
import { neon } from "@neondatabase/serverless";

import type { SacramentMeeting } from "./types";

// Read the connection string from the server-only environment configuration.
const sql = neon(process.env.DATABASE_URL!);

// Share one page size across list retrieval and page-count calculations.
const ITEMS_PER_PAGE = 5;

// Describe the snake_case columns returned by PostgreSQL before mapping them to app fields.
type MeetingRow = {
    id: number;
    date: string | Date;
    meeting_type: SacramentMeeting["meetingType"];
    presiding: string;
    conducting: string;
    announcements?: string[];
    opening_hymn: SacramentMeeting["openingHymn"];
    opening_prayer: string;
    ward_business: SacramentMeeting["wardBusiness"];
    stake_business: boolean;
    sacrament_hymn: SacramentMeeting["sacramentHymn"];
    speakers: SacramentMeeting["speakers"];
    closing_hymn: SacramentMeeting["closingHymn"];
    closing_prayer: string;
};

// Convert a database row into the camelCase record shape used by the UI.
function mapMeeting(meeting: MeetingRow): SacramentMeeting {
    return {
        // Preserve the primary key for detail routes and row actions.
        id: meeting.id,
        // Normalize Date objects while leaving already formatted date strings intact.
        date: meeting.date instanceof Date
            ? meeting.date.toISOString().split("T")[0]
            : meeting.date,
        // Translate database column naming into the public domain model.
        meetingType: meeting.meeting_type,
        presiding: meeting.presiding,
        conducting: meeting.conducting,
        // Copy every agenda field into its application-facing name.
        announcements: meeting.announcements,
        openingHymn: meeting.opening_hymn,
        openingPrayer: meeting.opening_prayer,
        wardBusiness: meeting.ward_business,
        stakeBusiness: meeting.stake_business,
        sacramentHymn: meeting.sacrament_hymn,
        speakers: meeting.speakers,
        closingHymn: meeting.closing_hymn,
        closingPrayer: meeting.closing_prayer,
    };
}
    // Reuse one trusted column list across meeting SELECT queries.

const MEETING_COLUMNS = sql`id, date, meeting_type, presiding, conducting,
    announcements, opening_hymn, opening_prayer, ward_business, stake_business,
    sacrament_hymn, speakers, closing_hymn, closing_prayer`;

// Return all meetings, or only meetings matching an optional exact date.
export async function getMeetings(date?: string | null): Promise<SacramentMeeting[]> {

    // Treat whitespace-only filters as no filter.
    const normalizedDate = date?.trim();

    // Use a parameterized equality query when a date was supplied.
    if (normalizedDate) {

                const rows = await sql`
        
                SELECT ${MEETING_COLUMNS}
      FROM meetings
      WHERE date = ${normalizedDate}
      ORDER BY date ASC
    ` as unknown as MeetingRow[];
    
                // Normalize every returned row before it reaches a route or component.
                return rows.map(mapMeeting);
    }

            // Without a date filter, return the complete schedule in calendar order.
        const rows = await sql`
            SELECT ${MEETING_COLUMNS}
            FROM meetings
            ORDER BY date ASC
        ` as unknown as MeetingRow[];

        // Keep the result shape consistent with the filtered branch.
        return rows.map(mapMeeting);
}

    // Retrieve a page of meetings matching a case-insensitive text search.
export async function getFilteredMeetings(
    query: string,
    page: number,
    pageSize = ITEMS_PER_PAGE,
): Promise<SacramentMeeting[]> {
    // Translate the one-based UI page to the database's zero-based row offset.
    const offset = Math.max(0, page - 1) * pageSize;
    // Surround the trimmed term with wildcards for partial matches.
    const search = `%${query.trim()}%`;

    // Parameterized values prevent user search text from becoming SQL syntax.
    const rows = await sql`
        SELECT ${MEETING_COLUMNS}
        FROM meetings
        WHERE meeting_type::text ILIKE ${search}
             OR presiding ILIKE ${search}
             OR conducting ILIKE ${search}
             OR announcements::text ILIKE ${search}
             OR speakers::text ILIKE ${search}
        ORDER BY date ASC
        LIMIT ${pageSize}
        OFFSET ${offset}
    ` as unknown as MeetingRow[];

    // Convert every result row into the shared meeting model.
    return rows.map(mapMeeting);
}

// Preserve the earlier helper name while using the shared paging implementation.
export async function fetchFilteredMeetings(
    query: string,
    currentPage: number,
): Promise<SacramentMeeting[]> {
    // Apply the default page size consistently with the page-count helper.
    return getFilteredMeetings(query, currentPage, ITEMS_PER_PAGE);
}

// Count matching records and convert the count into a number of result pages.
export async function fetchMeetingsPages(query: string): Promise<number> {
    // Use the same wildcard search term as the filtered-row query.
    const search = `%${query.trim()}%`;

    // Ask PostgreSQL to count matches without loading all matching records.
    const rows = await sql`
        SELECT COUNT(*)::int AS count
        FROM meetings
        WHERE meeting_type::text ILIKE ${search}
             OR presiding ILIKE ${search}
             OR conducting ILIKE ${search}
             OR announcements::text ILIKE ${search}
             OR speakers::text ILIKE ${search}
    ` as unknown as Array<{ count: number }>;

    // Coerce the driver's result and safely handle an empty response.
    const count = Number(rows[0]?.count ?? 0);

    // Round up so a partial final page is included.
    return Math.ceil(count / ITEMS_PER_PAGE);
}

// Keep the original helper name as a compatibility alias for existing callers.
export const getAllMeetings = getMeetings;

// Look up one record by primary key and represent a missing row as null.
export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
    // Parameterize the ID so it cannot be interpreted as SQL text.
    const rows = await sql`
        SELECT ${MEETING_COLUMNS}
        FROM meetings
        WHERE id = ${id}
    ` as unknown as MeetingRow[];

    // Map the first row when found; return null when the query matches nothing.
    return rows[0] ? mapMeeting(rows[0]) : null;

}

// Insert a validated meeting; PostgreSQL generates the primary key.
export async function createMeeting(meeting: Omit<SacramentMeeting, "id">): Promise<void> {
    // Keep column and value ordering aligned in the parameterized INSERT.
    // Pass announcements as a native PostgreSQL text array; agenda objects use JSON text.
    await sql`
        INSERT INTO meetings (
            date, meeting_type, presiding, conducting, announcements,
            opening_hymn, opening_prayer, ward_business, stake_business,
            sacrament_hymn, speakers, closing_hymn, closing_prayer
        ) VALUES (
            ${meeting.date}, ${meeting.meetingType}, ${meeting.presiding}, ${meeting.conducting},
            ${meeting.announcements ?? []}, ${JSON.stringify(meeting.openingHymn)},
            ${meeting.openingPrayer}, ${JSON.stringify(meeting.wardBusiness)}, ${meeting.stakeBusiness},
            ${JSON.stringify(meeting.sacramentHymn)}, ${JSON.stringify(meeting.speakers)},
            ${JSON.stringify(meeting.closingHymn)}, ${meeting.closingPrayer}
        )
    `;
}

// Replace all editable fields on the meeting identified by its primary key.
export async function updateMeeting(id: number, meeting: Omit<SacramentMeeting, "id">): Promise<void> {
    // Bind every value separately so user content never becomes SQL syntax.
    // Keep announcements as a native array to match its PostgreSQL column type.
    await sql`
        UPDATE meetings
        SET date = ${meeting.date}, meeting_type = ${meeting.meetingType},
            presiding = ${meeting.presiding}, conducting = ${meeting.conducting},
            announcements = ${meeting.announcements ?? []},
            opening_hymn = ${JSON.stringify(meeting.openingHymn)}, opening_prayer = ${meeting.openingPrayer},
            ward_business = ${JSON.stringify(meeting.wardBusiness)}, stake_business = ${meeting.stakeBusiness},
            sacrament_hymn = ${JSON.stringify(meeting.sacramentHymn)},
            speakers = ${JSON.stringify(meeting.speakers)}, closing_hymn = ${JSON.stringify(meeting.closingHymn)},
            closing_prayer = ${meeting.closingPrayer}
        WHERE id = ${id}
    `;
}

// Delete only the row matching the validated meeting ID.
export async function deleteMeeting(id: number): Promise<void> {
    await sql`DELETE FROM meetings WHERE id = ${id}`;
}