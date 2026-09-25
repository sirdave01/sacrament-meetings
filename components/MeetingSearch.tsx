"use client";

// Delay URL updates so the server isn't queried for every keystroke.
import { useDebouncedCallback } from "use-debounce";
// Read and update the current route while preserving its other query parameters.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// Keep the search field immediately responsive while the URL update is delayed.
import { useState } from "react";

// The server-rendered query seeds the client input on first render.
interface MeetingSearchProps {
  initialQuery: string;
}

// Let users filter the meeting list without a full document navigation.
export default function MeetingSearch({ initialQuery }: MeetingSearchProps) {
  // Preserve the active pathname when changing only search parameters.
  const pathname = usePathname();
  // Push updated filters into Next's client router.
  const router = useRouter();
  // Start from the current URL so unrelated parameters can remain intact.
  const searchParams = useSearchParams();
  // Mirror the input text locally for immediate typing feedback.
  const [query, setQuery] = useState(initialQuery);

  // Debounce filter changes and reset pagination whenever the search changes.
  const updateSearch = useDebouncedCallback((value: string) => {
    // Clone the read-only URL parameters before editing them.
    const params = new URLSearchParams(searchParams.toString());
    // Trim spaces so empty-looking queries behave like no filter.
    const normalizedValue = value.trim();

    // Set the query when nonempty; remove it to restore the full list otherwise.
    if (normalizedValue) {
      params.set("query", normalizedValue);
    } else {
      params.delete("query");
    }

    // Return to the first result page because a changed filter changes page contents.
    params.delete("page");
    // Avoid a trailing question mark when no parameters remain.
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, 300);

  // Update visible text now, then schedule the corresponding URL change.
  function handleChange(value: string) {
    setQuery(value);
    updateSearch(value);
  }

  // A wrapping label supplies an accessible name without visible extra text.
  return (
    <label className="block max-w-md">
      <span className="sr-only">Search meetings</span>
      <input
        type="search"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search meetings"
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-black shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}