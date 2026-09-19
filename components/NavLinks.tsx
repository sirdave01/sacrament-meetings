"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

// These are the app's real destinations. Individual meeting details are linked
// from MeetingCard rather than listed as fixed navigation links.

const links = [
    
    { href: "/", label: "Home" },
    
    { href: "/meetings", label: "All Meetings" },
    
];

export default function NavLinks() {

    const pathname = usePathname();

    return (
        
        <ul className="flex gap-6">

            {links.map(({ href, label }) => {

                const isActive =
                    pathname === href ||
                    (href === "/meetings" && pathname.startsWith("/meetings/") && pathname !== "/meetings/current");

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