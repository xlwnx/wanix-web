import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  prevHref: string;
  nextHref: string;
}

export function Pagination({
  page,
  totalPages,
  prevHref,
  nextHref,
}: PaginationProps) {
  const maxPage = Math.min(totalPages, 500);
  if (maxPage <= 1 && page <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      {page > 1 && (
        <Link
          href={prevHref}
          className="px-4 py-2 rounded-lg glass text-sm text-foreground hover:border-accent/50 transition-colors"
        >
          Previous
        </Link>
      )}
      <span className="text-xs text-muted font-mono">
        Page {page} of {maxPage}
      </span>
      {page < maxPage && (
        <Link
          href={nextHref}
          className="px-4 py-2 rounded-lg glass text-sm text-foreground hover:border-accent/50 transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
