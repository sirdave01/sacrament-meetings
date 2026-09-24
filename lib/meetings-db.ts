// switching to SQL DB on NEON - PostgreSQL (Vercel)

import { neon } from "@neondatabase/serverless";

import type { SacramentMeeting } from "./types";

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

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

function mapMeeting(meeting: MeetingRow): SacramentMeeting {
    return {
        id: meeting.id,
        date: meeting.date instanceof Date
            ? meeting.date.toISOString().split("T")[0]
            : meeting.date,
        meetingType: meeting.meeting_type,
        presiding: meeting.presiding,
        conducting: meeting.conducting,
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

const MEETING_COLUMNS = sql`id, date, meeting_type, presiding, conducting,
    announcements, opening_hymn, opening_prayer, ward_business, stake_business,
    sacrament_hymn, speakers, closing_hymn, closing_prayer`;

export async function getMeetings(date?: string | null): Promise<SacramentMeeting[]> {

    const normalizedDate = date?.trim();

    if (normalizedDate) {

                const rows = await sql`
        
                SELECT ${MEETING_COLUMNS}
      FROM meetings
      WHERE date = ${normalizedDate}
      ORDER BY date ASC
    ` as unknown as MeetingRow[];
    
                return rows.map(mapMeeting);
    }

        const rows = await sql`
            SELECT ${MEETING_COLUMNS}
            FROM meetings
            ORDER BY date ASC
        ` as unknown as MeetingRow[];

        return rows.map(mapMeeting);
}

export async function getFilteredMeetings(
    query: string,
    page: number,
    pageSize = ITEMS_PER_PAGE,
): Promise<SacramentMeeting[]> {
    const offset = Math.max(0, page - 1) * pageSize;
    const search = `%${query.trim()}%`;

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

    return rows.map(mapMeeting);
}

export async function fetchFilteredMeetings(
    query: string,
    currentPage: number,
): Promise<SacramentMeeting[]> {
    return getFilteredMeetings(query, currentPage, ITEMS_PER_PAGE);
}

export async function fetchMeetingsPages(query: string): Promise<number> {
    const search = `%${query.trim()}%`;

    const rows = await sql`
        SELECT COUNT(*)::int AS count
        FROM meetings
        WHERE meeting_type::text ILIKE ${search}
             OR presiding ILIKE ${search}
             OR conducting ILIKE ${search}
             OR announcements::text ILIKE ${search}
             OR speakers::text ILIKE ${search}
    ` as unknown as Array<{ count: number }>;

    const count = Number(rows[0]?.count ?? 0);

    return Math.ceil(count / ITEMS_PER_PAGE);
}

// Keep the original helper name as a compatibility alias for the rest of the app.
export const getAllMeetings = getMeetings;

// Create the export function to get a meeting by its ID.
export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
    const rows = await sql`
        SELECT ${MEETING_COLUMNS}
        FROM meetings
        WHERE id = ${id}
    ` as unknown as MeetingRow[];

    return rows[0] ? mapMeeting(rows[0]) : null;

}