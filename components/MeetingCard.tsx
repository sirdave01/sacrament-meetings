// Summary view: the full meeting object is passed in one typed prop.

import Link from "next/link";

import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {

    meeting: SacramentMeeting;

}

export default function MeetingCard({ meeting }: MeetingCardProps) {

    return (

        <Link href={`/meetings/${meeting.id}`} className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">

            <h2 className="text-xl font-semibold mb-2">

                {meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} Sacrament Meeting

            </h2>

            <p className="text-gray-600 mb-1">Date: {new Date(meeting.date).toLocaleDateString()}</p>
            
            <p className="text-gray-600">Presiding: {meeting.presiding}</p>

        </Link>

    );

}