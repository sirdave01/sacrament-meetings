"use client";

import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface MeetingSearchProps {
  initialQuery: string;
}

export default function MeetingSearch({ initialQuery }: MeetingSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const updateSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedValue = value.trim();

    if (normalizedValue) {
      params.set("query", normalizedValue);
    } else {
      params.delete("query");
    }

    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, 300);

  function handleChange(value: string) {
    setQuery(value);
    updateSearch(value);
  }

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