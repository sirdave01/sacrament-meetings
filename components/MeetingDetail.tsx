import Link from "next/link";

import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {

    // Detail view receives the complete meeting record, not separate props for every field.
    
    meeting: SacramentMeeting;
    
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
    
	return (
        
		<article className="space-y-6 rounded-lg bg-white p-6 shadow-md">
            
			<div>
                
				<Link href="/meetings" className="text-sm text-blue-600 hover:underline">
                
					Back to meetings
                    
				</Link>
                
				<h1 className="mt-2 text-3xl font-bold">
                    
					{meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} Sacrament Meeting
                    
				</h1>
                
				<p className="text-gray-600">{new Date(meeting.date).toLocaleDateString()}</p>
                
			</div>

			<section>
                
				<h2 className="text-xl font-semibold">Leadership</h2>
                
				<p>Presiding: {meeting.presiding}</p>
                
				<p>Conducting: {meeting.conducting}</p>
                
			</section>

			<section>
                
				<h2 className="text-xl font-semibold">Opening</h2>
                
				<p>Hymn {meeting.openingHymn.number}: {meeting.openingHymn.title}</p>
                
				<p>Prayer: {meeting.openingPrayer}</p>
                
			</section>

			{/* announcements is optional in SacramentMeeting, so render it only when present. */}
            
			{meeting.announcements && meeting.announcements.length > 0 && (
                
				<section>
                    
					<h2 className="text-xl font-semibold">Announcements</h2>
                    
					<ul className="list-disc pl-5">
                        
						{meeting.announcements.map((announcement) => (
                            
							<li key={announcement}>{announcement}</li>
                            
						))}
                        
					</ul>
                    
				</section>
                
			)}

			<section>
                
				<h2 className="text-xl font-semibold">Ward Business</h2>
                
				{meeting.wardBusiness.length > 0 ? (
                    
					<ul className="list-disc pl-5">
                        
						{meeting.wardBusiness.map((item) => (
                            
							<li key={item.description}>{item.description}</li>
                            
						))}
                        
					</ul>
                    
				) : (
                    
					<p>No ward business.</p>
                    
				)}
                
				<p>Stake business: {meeting.stakeBusiness ? "Yes" : "No"}</p>
                
			</section>

			<section>
				<h2 className="text-xl font-semibold">Sacrament and Speakers</h2>
                
				<p>Hymn {meeting.sacramentHymn.number}: {meeting.sacramentHymn.title}</p>
                
				<ul className="list-disc pl-5">
                    
					{meeting.speakers.map((speaker) => (
                        
						<li key={`${speaker.name}-${speaker.type}`}>
                            
							{speaker.name}{speaker.topic ? `: ${speaker.topic}` : ""} ({speaker.type})
                            
						</li>
                        
					))}
                    
				</ul>
                
			</section>

			<section>
                
				<h2 className="text-xl font-semibold">Closing</h2>
                
				<p>Hymn {meeting.closingHymn.number}: {meeting.closingHymn.title}</p>
                
				<p>Prayer: {meeting.closingPrayer}</p>
                
			</section>
            
		</article>
        
	);
    
}
