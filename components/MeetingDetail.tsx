// Provide client-side navigation back to the meeting index.
import Link from "next/link";

// Type the full record displayed by this read-only agenda view.
import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {

    // Detail view receives the complete meeting record, not separate props for every field.
    
    meeting: SacramentMeeting;
    
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
    
	// Group agenda details into named sections so the page is easy to scan.
	return (
        
		<article className="space-y-6 rounded-lg bg-white p-6 shadow-md">
            
			{/* Identify the meeting and offer a route back to the full list. */}
			<div>
                
				<Link href="/meetings" className="text-sm text-blue-600 hover:underline">
                
					Back to meetings
                    
				</Link>
                
				<h1 className="mt-2 text-3xl font-bold text-black">
                    
					{meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} Sacrament Meeting
                    
				</h1>
                
				<p className="text-black">{new Date(meeting.date).toLocaleDateString()}</p>
                
			</div>

			{/* Show the people assigned to lead the meeting. */}
			<section>
                
				<h2 className="text-xl font-semibold text-black">Leadership</h2>
                
				<p className="text-black">Presiding: {meeting.presiding}</p>
                
				<p className="text-black">Conducting: {meeting.conducting}</p>
                
			</section>

			{/* Present the opening hymn and prayer together. */}
			<section>
                
				<h2 className="text-xl font-semibold text-black">Opening</h2>
                
				<p className="text-black">Hymn {meeting.openingHymn.number}: {meeting.openingHymn.title}</p>
                
				<p className="text-black">Prayer: {meeting.openingPrayer}</p>
                
			</section>

			{/* Omit this section when there are no optional announcements to display. */}
            
			{meeting.announcements && meeting.announcements.length > 0 && (
                
				<section>
                    
					<h2 className="text-xl font-semibold text-black">Announcements</h2>
                    
					<ul className="list-disc pl-5">
                        
						{meeting.announcements.map((announcement) => (
                            
							<li key={announcement} className="text-black">
                                {announcement}
                            </li>
                            
						))}
                        
					</ul>
                    
				</section>
                
			)}

			{/* Show ward agenda items and whether stake business is included. */}
			<section>
                
				<h2 className="text-xl font-semibold text-black">Ward Business</h2>
                
				{meeting.wardBusiness.length > 0 ? (
                    
					<ul className="list-disc pl-5">
                        
						{meeting.wardBusiness.map((item) => (
                            
							<li key={item.description} className="text-black">
                                {item.description}
                            </li>
                            
						))}
                        
					</ul>
                    
				) : (
                    
					<p className="text-black">No ward business.</p>
                    
				)}
                
				<p className="text-black">Stake business: {meeting.stakeBusiness ? "Yes" : "No"}</p>
                
			</section>

			{/* Place the sacrament hymn and ordered speaker entries in one section. */}
			<section>
				<h2 className="text-xl font-semibold text-black">Sacrament and Speakers</h2>
                
				<p className="text-black">Hymn {meeting.sacramentHymn.number}: {meeting.sacramentHymn.title}</p>
                
				<ul className="list-disc pl-5">
                    
					{meeting.speakers.map((speaker) => (
                        
						<li key={`${speaker.name}-${speaker.type}`} className="text-black">
                            
							{speaker.name}{speaker.topic ? `: ${speaker.topic}` : ""} ({speaker.type})
                            
						</li>
                        
					))}
                    
				</ul>
                
			</section>

			{/* Finish with the closing hymn and prayer. */}
			<section>
                
				<h2 className="text-xl font-semibold text-black">Closing</h2>
                
				<p className="text-black">Hymn {meeting.closingHymn.number}: {meeting.closingHymn.title}</p>
                
				<p className="text-black">Prayer: {meeting.closingPrayer}</p>
                
			</section>
            
		</article>
        
	);
    
}
