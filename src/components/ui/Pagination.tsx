import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Select } from "@/components/ui/Select";

interface Props {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

function getPageRange(current: number, total: number): (number | "dots")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "dots")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) pages.push("dots");
  for (let p = left; p <= right; p += 1) pages.push(p);
  if (right < total - 1) pages.push("dots");
  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="mb-2 flex items-center text-sm text-text text-opacity-60">
        <span className="mr-3">Số bản ghi trên trang</span>
        <Select
          value={pageSize}
          onChange={onPageSizeChange}
          options={pageSizeOptions.map((size) => ({
            value: size,
            label: `${size}`,
          }))}
        />
      </div>

      <div className="mb-2 flex items-center">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Trang trước"
          className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text"
        >
          <FiChevronLeft size={16} />
        </button>

        {getPageRange(page, totalPages).map((p, idx) =>
          p === "dots" ? (
            <span
              key={`dots-${idx}`}
              className="mr-1 flex h-8 w-8 items-center justify-center text-text text-opacity-40"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`mr-1 flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors ${
                p === page
                  ? "border-primary bg-primary text-white"
                  : "border-border text-text hover:border-primary hover:text-primary"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Trang sau"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
