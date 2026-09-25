"use client";

// Use Next's client-side links for app navigation.
import Link from "next/link";

// Read the active URL so navigation can reflect the current section.
import { usePathname } from "next/navigation";

// These are the app's real destinations. Individual meeting details are linked
// from MeetingCard rather than listed as fixed navigation links.

// Keep only top-level destinations here; meeting detail links live on their cards.
const links = [
    
    { href: "/", label: "Home" },
    
    { href: "/meetings", label: "All Meetings" },
    
];

// Mark the current top-level destination for visual and assistive-technology users.
export default function NavLinks() {

    // The pathname changes automatically as the user navigates between routes.
    const pathname = usePathname();

    // Render each configured destination with its current-page state.
    return (
        
        <ul className="flex gap-6">

            {/* Generate navigation items from the small destination table above. */}
            {links.map(({ href, label }) => {

                // Treat nested meeting detail/edit URLs as part of the meetings section.
                const isActive =
                    pathname === href ||
                    (href === "/meetings" && pathname.startsWith("/meetings/") && pathname !== "/meetings/current");

                // Use the destination as a stable key and expose active state semantically.
                return (

                    <li key={href}>

                        <Link
                            
                            href={href}

                            aria-current={isActive ? "page" : undefined}

                            className={isActive ? "font-semibold text-yellow-300 underline" : "text-white hover:text-gray-300"}
                        >
                            {label}

                        </Link>

                    </li>

                );

            })}

        </ul>

    );

}