import Image from "next/image";

import MeetingCard from "@/components/MeetingCard";

import { getAllMeetings } from "@/lib/meetings-db";

export default async function Home() {

    // Read the in-memory list of meetings and display a landing-page summary.
    const meetings = await getAllMeetings();

    return (
      
        <main className="mx-auto max-w-4xl px-4 py-12">
          
            <section className="mb-8">
              
                <div className="flex items-center gap-4">
                  
                    <Image

                      src="/window.svg"

                      alt="Meeting schedule icon"

                      width={64}

                      height={64}

                    />

                    <h1 className="text-4xl font-bold">Sacrament Meetings</h1>

                </div>
                
                <p className="mt-2 text-white text-lg">
                  
                    Select a meeting to view its complete agenda.
                    
                </p>
                
            </section>

            <section aria-labelledby="meetings-heading">
              
                <h2 id="meetings-heading" className="sr-only">Available meetings</h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  
                    {meetings.map((meeting) => (
                      
                        <MeetingCard key={meeting.id} meeting={meeting} />
                        
                    ))}
                    
                </div>
                
            </section>
            
        </main>
        
    );
    
}