import { useState } from "react";
import { FiEdit2, FiMaximize2, FiPlus, FiPrinter } from "react-icons/fi";
import { Link } from "react-router-dom";

import { Checkbox } from "@/components/ui/Checkbox";
import { FormSelect } from "@/components/ui/FormSelect";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { useAssets, useMarkPrinted } from "@/features/assets/assets.hooks";
import {
  statusColor,
  statusLabel,
  statusMeta,
  type AssetStatus,
} from "@/features/assets/assets.types";
import { useCategoryOptions } from "@/features/categories/categories.hooks";
import { useDepartmentOptions } from "@/features/departments/departments.hooks";
import type { LabelPreset } from "@/features/print/print.api";
import { usePrintLabels } from "@/features/print/print.hooks";
import { useAuthStore } from "@/store/auth.store";

const PRESET_OPTIONS = [
  { value: "A4-3x8", label: "A4 — 3×8 (24 tem/trang)" },
  { value: "A4-2x5", label: "A4 — 2×5 (10 tem/trang)" },
];

export function AssetsPage() {
  const user = useAuthStore((s) => s.user);
  const canWrite = user?.role === "admin" || user?.role === "editor";
  const isAdmin = user?.role === "admin";
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [departmentId, setDepartmentId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [preset, setPreset] = useState<LabelPreset>("A4-3x8");

  const { data: departments } = useDepartmentOptions();
  const { data: categories } = useCategoryOptions();

  const departmentOptions = [
    { value: "all", label: "Tất cả đơn vị" },
    ...(departments ?? []).map((d) => ({ value: d.id, label: d.name })),
  ];
  const categoryOptions = [
    { value: "all", label: "Tất cả danh mục" },
    ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];

  const { data, isLoading, error } = useAssets({
    q: query || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    department_id: isAdmin && departmentId !== "all" ? departmentId : undefined,
    category_id: categoryId !== "all" ? categoryId : undefined,
    page,
    size: pageSize,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const printMut = usePrintLabels();
  const markMut = useMarkPrinted();

  const handleQuery = (v: string) => {
    setQuery(v);
    setPage(1);
  };
  const handleStatus = (v: AssetStatus | "all") => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleDepartment = (v: string) => {
    setDepartmentId(v);
    setPage(1);
  };
  const handleCategory = (v: string) => {
    setCategoryId(v);
    setPage(1);
  };

  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const pageIds = items.map((a) => a.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someOnPageSelected =
    pageIds.some((id) => selected.includes(id)) && !allOnPageSelected;
  const toggleAllOnPage = () =>
    setSelected((prev) =>
      allOnPageSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...prev, ...pageIds.filter((id) => !prev.includes(id))],
    );

  const handlePrintSelected = () => {
    if (selected.length === 0 || printMut.isPending) return;
    const ids = [...selected];
    printMut.mutate(
      { ids, label_preset: preset },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
          // giải phóng sau khi tab mới đã nạp
          setTimeout(() => URL.revokeObjectURL(url), 60_000);
          markMut.mutate(ids, {
            onSuccess: () => setSelected([]),
          });
        },
      },
    );
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
              {user?.role === "admin"
                ? "Quản lý danh sách tài sản toàn đơn vị."
                : "Tài sản thuộc đơn vị của bạn."}
            </p>
          </div>
          <div className="mb-2 flex flex-wrap items-center">
            {isAdmin && (
              <FormSelect
                value={departmentId}
                options={departmentOptions}
                onChange={handleDepartment}
                className="mr-3 w-48"
              />
            )}
            <FormSelect
              value={categoryId}
              options={categoryOptions}
              onChange={handleCategory}
              className="mr-3 w-48"
            />
            <SearchInput
              value={query}
              onChange={handleQuery}
              placeholder="Tìm theo tên..."
              className="mr-3 w-64"
            />
            {canWrite && (
              <Link
                to="/dashboard/assets/create"
                className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                <FiPlus className="mr-2" size={16} />
                Thêm tài sản
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap">
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
                    ? { backgroundColor: statusColor[s.value], color: "#fff" }
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
                    backgroundColor: active ? "#fff" : statusColor[s.value],
                  }}
                />
                {s.label}
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="mb-2 flex items-center">
            <span className="mr-3 text-sm text-text text-opacity-60">
              Đã chọn {selected.length}
            </span>
            <FormSelect
              value={preset}
              options={PRESET_OPTIONS}
              onChange={(v) => setPreset(v as LabelPreset)}
              className="mr-3 w-56"
            />
            <button
              type="button"
              onClick={handlePrintSelected}
              disabled={printMut.isPending || markMut.isPending}
              className="flex items-center whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              <FiPrinter className="mr-2" size={15} />
              {printMut.isPending ? "Đang in..." : "In tem đã chọn"}
            </button>
          </div>
        )}
      </div>

      {printMut.isError && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-500 bg-opacity-10 px-4 py-2 text-sm text-red-500">
          {(printMut.error as Error).message}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-text text-opacity-50">
              <th className="px-5 py-3 font-semibold">
                <Checkbox
                  checked={allOnPageSelected}
                  indeterminate={someOnPageSelected}
                  onChange={toggleAllOnPage}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="px-5 py-3 font-semibold">#</th>
              <th className="px-5 py-3 font-semibold">Mã</th>
              <th className="px-5 py-3 font-semibold">Tên tài sản</th>
              <th className="px-5 py-3 font-semibold">Danh mục</th>
              <th className="px-5 py-3 font-semibold">Trạng thái</th>
              <th className="px-5 py-3 font-semibold">Ngày tạo</th>
              <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-text text-opacity-50"
                >
                  Đang tải...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-red-500">
                  {(error as Error).message}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-text text-opacity-50"
                >
                  Không tìm thấy tài sản phù hợp.
                </td>
              </tr>
            ) : (
              items.map((a, idx) => (
                <tr
                  key={a.id}
                  className="border-b border-border transition-colors hover:bg-primary hover:bg-opacity-5"
                >
                  <td className="px-5 py-3">
                    <Checkbox
                      checked={selected.includes(a.id)}
                      onChange={() => toggleOne(a.id)}
                      aria-label={`Chọn ${a.code}`}
                    />
                  </td>
                  <td className="px-5 py-3 text-text text-opacity-60">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-5 py-3 font-medium text-text">{a.code}</td>
                  <td className="px-5 py-3 text-text">{a.name}</td>
                  <td className="px-5 py-3 text-text text-opacity-70">
                    {a.category_name ?? "-"}
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
                    {new Date(a.created_at).toLocaleDateString("vi-VN")}
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
                      {canWrite && (
                        <Link
                          to={`/dashboard/assets/${a.code}/edit`}
                          aria-label="Sửa"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                      )}
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
          totalItems={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
