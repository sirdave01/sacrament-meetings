"use client";

// Use client-side navigation so changing pages preserves the app shell.
import Link from "next/link";
// Read the current URL state to keep pagination aligned with search filters.
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

// Render previous/next controls only when more than one page exists.
export default function Pagination({ totalPages }: PaginationProps) {
  // Keep links relative to the active route.
  const pathname = usePathname();
  // Preserve the current filter parameters when building page links.
  const searchParams = useSearchParams();
  // Normalize invalid or absent page values to the first page.
  const requestedPage = Number(searchParams.get("page"));
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  // Avoid rendering controls that cannot change the result set.
  if (totalPages <= 1) {
    return null;
  }

  // Create a URL for a target page without dropping the active search query.
  const pageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  // Disable unavailable directions with plain text instead of dead links.
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-400">
          Previous
        </span>
      )}

      <span aria-current="page" className="text-sm font-medium text-white">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={pageUrl(currentPage + 1)}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-400">
          Next
        </span>
      )}
    </nav>
  );
}