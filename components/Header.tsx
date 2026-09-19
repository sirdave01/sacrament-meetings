"use client";

import { useSyncExternalStore } from "react";

import NavLinks from "@/components/NavLinks";

const WARD_NAME = "Osigwe Ward";

const getCurrentDate = () =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(new Date());

const subscribeToDate = () => () => {};

const getServerDate = () => "Today";

export default function Header() {
    // useSyncExternalStore avoids an effect-driven state update and keeps SSR hydrated.
    const currentDate = useSyncExternalStore(subscribeToDate, getCurrentDate, getServerDate);

    return (
        <header className="bg-gray-800 p-4 text-white shadow-md">

            <div className="mx-auto flex max-w-4xl flex-col gap-1">
                <div id="header-title" className="text-2xl font-bold">{WARD_NAME}</div>

                <time dateTime={currentDate === "Today" ? undefined : new Date().toISOString().slice(0, 10)} className="text-sm text-gray-300">

                    {currentDate}

                </time>

            </div>

            <nav className="mx-auto mt-4 flex max-w-4xl items-center justify-between">

                <NavLinks />
                
            </nav>
            
        </header>
        
    );
    
}