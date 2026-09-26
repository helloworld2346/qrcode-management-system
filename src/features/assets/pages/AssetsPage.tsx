import { useMemo, useState } from "react";
import { FiEdit2, FiMaximize2, FiPlus, FiPrinter } from "react-icons/fi";

import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  assetRows,
  statusMeta,
  type AssetStatus,
} from "@/features/assets/data/mock";
import { usePagination } from "@/hooks/usePagination";
import { Link } from "react-router-dom";

const statusColor: Record<AssetStatus, string> = {
  in_use: "#0ea5e9",
  available: "#16a34a",
  stored: "#0f4c81",
  maintenance: "#d97706",
  damaged: "#c62839",
  lost: "#64748b",
};

const statusLabel = (value: AssetStatus) =>
  statusMeta.find((s) => s.value === value)?.label ?? value;

export function AssetsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assetRows.filter((a) => {
      const matchQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [query, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<AssetStatus, number> = {
      in_use: 0,
      available: 0,
      stored: 0,
      maintenance: 0,
      damaged: 0,
      lost: 0,
    };
    assetRows.forEach((a) => {
      counts[a.status] += 1;
    });
    return counts;
  }, []);

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    pageItems,
    totalItems,
  } = usePagination(filtered, 10);

  const handleQuery = (v: string) => {
    setQuery(v);
    setPage(1);
  };

  const handleStatus = (v: AssetStatus | "all") => {
    setStatusFilter(v);
    setPage(1);
  };

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-2 mr-4">
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Tài sản
            </h1>
            <p className="mt-1 text-sm text-text text-opacity-60">
              Quản lý danh sách tài sản toàn đơn vị.
            </p>
          </div>
          <div className="mb-2 flex items-center">
            <SearchInput
              value={query}
              onChange={handleQuery}
              placeholder="Tìm theo tên hoặc mã..."
              className="mr-3 w-64"
            />
            <Link
              to="/dashboard/assets/create"
              className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <FiPlus className="mr-2" size={16} />
              Thêm tài sản
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap">
        <button
          type="button"
          onClick={() => handleStatus("all")}
          className={`mb-2 mr-2 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-primary text-white"
              : "border border-border bg-surface text-text hover:border-primary"
          }`}
        >
          Tất cả
          <span
            className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
              statusFilter === "all"
                ? "bg-white bg-opacity-20 text-white"
                : "bg-primary bg-opacity-10 text-text text-opacity-70"
            }`}
          >
            {assetRows.length}
          </span>
        </button>
        {statusMeta.map((s) => {
          const active = statusFilter === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => handleStatus(s.value)}
              style={
                active
                  ? { backgroundColor: statusColor[s.value], color: "#ffffff" }
                  : undefined
              }
              className={`mb-2 mr-2 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? ""
                  : "border border-border bg-surface text-text hover:border-primary"
              }`}
            >
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: active ? "#ffffff" : statusColor[s.value],
                }}
              />
              {s.label}
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                  active
                    ? "bg-white bg-opacity-20 text-white"
                    : "bg-primary bg-opacity-10 text-text text-opacity-70"
                }`}
              >
                {statusCounts[s.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-text text-opacity-50">
              <th className="px-5 py-3 font-semibold">#</th>
              <th className="px-5 py-3 font-semibold">Mã</th>
              <th className="px-5 py-3 font-semibold">Tên tài sản</th>
              <th className="px-5 py-3 font-semibold">Đơn vị</th>
              <th className="px-5 py-3 font-semibold">Trạng thái</th>
              <th className="px-5 py-3 font-semibold">Ngày cấp</th>
              <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-text text-opacity-50"
                >
                  Không tìm thấy tài sản phù hợp.
                </td>
              </tr>
            ) : (
              pageItems.map((a, idx) => (
                <tr
                  key={a.code}
                  className="border-b border-border transition-colors hover:bg-primary hover:bg-opacity-5"
                >
                  <td className="px-5 py-3 text-text text-opacity-60">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-5 py-3 font-medium text-text">{a.code}</td>
                  <td className="px-5 py-3 text-text">{a.name}</td>
                  <td className="px-5 py-3 text-text text-opacity-70">
                    {a.unit}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${statusColor[a.status]}1a`,
                        color: statusColor[a.status],
                      }}
                    >
                      <span
                        className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: statusColor[a.status] }}
                      />
                      {statusLabel(a.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text text-opacity-70">
                    {a.issuedDate}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/dashboard/assets/${a.code}`}
                        aria-label="Xem"
                        className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                      >
                        <FiMaximize2 size={15} />
                      </Link>
                      <Link
                        to={`/dashboard/assets/${a.code}/print`}
                        aria-label="In QR"
                        className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                      >
                        <FiPrinter size={15} />
                      </Link>
                      <Link
                        to={`/dashboard/assets/${a.code}/edit`}
                        aria-label="Sửa"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
