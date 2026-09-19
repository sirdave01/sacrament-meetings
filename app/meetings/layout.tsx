import Link from "next/link";

import type { ReactNode } from "react";

export default function MeetingsLayout({
    
	children,
    
}: Readonly<{
    
	children: ReactNode;
    
}>) {
    
	return (
        
		<section>
            
			{/* This section-level layout adds meeting-specific navigation for all routes in /meetings. */}
			<nav aria-label="Meetings navigation" className="mx-auto flex max-w-4xl gap-6 p-4">
                
				<Link href="/meetings">All Meetings</Link>
                
				<Link href="/meetings/current">Current Meeting</Link>
                
			</nav>

			{children}
            
		</section>
        
	);
    
}
