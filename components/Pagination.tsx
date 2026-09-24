"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedPage = Number(searchParams.get("page"));
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  if (totalPages <= 1) {
    return null;
  }

  const pageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

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