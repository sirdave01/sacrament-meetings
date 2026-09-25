"use client";

// Subscribe to the client clock without introducing an effect-driven state update.
import { useSyncExternalStore } from "react";

// Reuse the shared navigation links in the global header.
import NavLinks from "@/components/NavLinks";

// Keep the displayed ward name in one place for easy site-wide editing.
const WARD_NAME = "Osigwe Ward";

// Format the client's current date according to its locale.
const getCurrentDate = () =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(new Date());

// This header does not need external notifications; the date is refreshed on render.
const subscribeToDate = () => () => {};

// Provide deterministic text during server rendering to avoid a locale mismatch.
const getServerDate = () => "Today";

// Render the shared site identity and primary navigation.
export default function Header() {
    // Switch from the server snapshot to the browser's localized date after hydration.
    const currentDate = useSyncExternalStore(subscribeToDate, getCurrentDate, getServerDate);

    // Keep ward identity and navigation in the same global shell.
    return (
        <header className="bg-gray-800 p-4 text-white shadow-md">

            <div className="mx-auto flex max-w-4xl flex-col gap-1">
                {/* Use the shared constant so the ward name is not repeated in markup. */}
                <div id="header-title" className="text-2xl font-bold">{WARD_NAME}</div>

                {/* Provide machine-readable date metadata only after the real date is available. */}
                <time dateTime={currentDate === "Today" ? undefined : new Date().toISOString().slice(0, 10)} className="text-sm text-gray-300">

                    {currentDate}

                </time>

            </div>

            <nav className="mx-auto mt-4 flex max-w-4xl items-center justify-between">

                {/* Keep active route indication consistent across the site. */}
                <NavLinks />
                
            </nav>
            
        </header>
        
    );
    
}