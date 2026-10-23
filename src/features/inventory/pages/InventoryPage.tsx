import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiCheckCircle, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth.store";
import { categoriesApi } from "@/features/categories/categories.api";
import { departmentsApi } from "@/features/departments/departments.api";
import {
  inventoryApi,
  type InventorySession,
} from "@/features/inventory/inventory.api";
import { pickData, errorMessage } from "@/types/api.types";

const keys = {
  sessions: ["inventory-sessions"] as const,
  report: (id: string) => ["inventory-report", id] as const,
};

export function InventoryPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin";

  const [name, setName] = useState("");
  const [scopeType, setScopeType] = useState<"DEPARTMENT" | "CATEGORY">("DEPARTMENT");
  const [scopeId, setScopeId] = useState("");
  const [createErr, setCreateErr] = useState("");
  const [active, setActive] = useState<InventorySession | null>(null);
  const [scanCode, setScanCode] = useState("");
  const [scanMsg, setScanMsg] = useState("");

  const { data: sessions, isLoading } = useQuery({
    queryKey: keys.sessions,
    queryFn: async () => pickData(await inventoryApi.sessions())?.items ?? [],
  });
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    enabled: scopeType === "DEPARTMENT" && isAdmin,
    queryFn: async () => pickData(await departmentsApi.list(1, 100))?.items ?? [],
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    enabled: scopeType === "CATEGORY",
    queryFn: async () => pickData(await categoriesApi.list(1, 100))?.items ?? [],
  });
  const { data: report, refetch: refetchReport } = useQuery({
    queryKey: keys.report(active?.id ?? ""),
    enabled: !!active,
    queryFn: async () => pickData(await inventoryApi.report(active!.id)),
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const res = await inventoryApi.create({
        name: name.trim(),
        scope_type: scopeType,
        scope_id: scopeType === "DEPARTMENT" && !isAdmin ? user?.departmentId ?? "" : scopeId,
      });
      const d = pickData(res);
      if (!res.ok || !d) throw new Error(res.error?.message || "Tạo phiên thất bại");
      return d;
    },
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: keys.sessions });
      setActive(s);
      setName("");
      setScopeId("");
      setCreateErr("");
    },
    onError: (e) => setCreateErr(errorMessage(e)),
  });

  const closeMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await inventoryApi.close(id);
      if (!res.ok) throw new Error(res.error?.message || "Đóng phiên thất bại");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.sessions });
      refetchReport();
    },
  });

  const scanMut = useMutation({
    mutationFn: async (code: string) => {
      const res = await inventoryApi.scan(active!.id, code);
      const d = pickData(res);
      if (!res.ok || !d) throw new Error(res.error?.message || "Quét thất bại");
      return d;
    },
    onSuccess: (s) => {
      setScanCode("");
      setScanMsg(
        s.is_unexpected
          ? `Đã ghi "${s.asset_name}" — NGOÀI phạm vi phiên`
          : `Đã ghi "${s.asset_name}"`,
      );
      refetchReport();
    },
    onError: (e) => setScanMsg(errorMessage(e)),
  });

  const scopeOptions =
    scopeType === "DEPARTMENT"
      ? (departments ?? []).map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))
      : (categories ?? []).map((c) => ({ value: c.id, label: `${c.name} (${c.code})` }));

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-text">Kiểm kê</h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Tạo phiên kiểm kê, quét QR tài sản và xem báo cáo thiếu/thừa.
        </p>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text text-opacity-60">
          Phiên mới
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <FormField label="Tên phiên" required className="w-64">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Kiểm kê Q4" />
          </FormField>
          <FormField label="Phạm vi" required className="w-44">
            <FormSelect
              value={scopeType}
              onChange={(v) => {
                setScopeType(v as "DEPARTMENT" | "CATEGORY");
                setScopeId("");
              }}
              options={[
                { value: "DEPARTMENT", label: "Theo đơn vị" },
                { value: "CATEGORY", label: "Theo danh mục" },
              ]}
            />
          </FormField>
          {(isAdmin || scopeType === "CATEGORY") && (
            <FormField label={scopeType === "DEPARTMENT" ? "Đơn vị" : "Danh mục"} required className="w-56">
              <FormSelect
                value={scopeId}
                onChange={setScopeId}
                placeholder="-- Chọn --"
                options={scopeOptions}
              />
            </FormField>
          )}
          <Button
            type="button"
            disabled={
              !name.trim() ||
              ((isAdmin || scopeType === "CATEGORY") && !scopeId) ||
              createMut.isPending
            }
            onClick={() => createMut.mutate()}
          >
            <FiPlus className="mr-2" size={15} />
            {createMut.isPending ? "Đang tạo..." : "Tạo phiên"}
          </Button>
        </div>
        {createErr && <p className="mt-2 text-xs text-accent">{createErr}</p>}
      </div>

      <div className="mb-4 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text text-opacity-60">
              <th className="px-4 py-3 font-medium">Tên phiên</th>
              <th className="px-4 py-3 font-medium">Phạm vi</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Tạo lúc</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text text-opacity-60">
                  Đang tải...
                </td>
              </tr>
            ) : !sessions || sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text text-opacity-60">
                  Chưa có phiên kiểm kê nào.
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-border last:border-b-0 ${
                    active?.id === s.id ? "bg-primary bg-opacity-5" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-text">{s.name}</td>
                  <td className="px-4 py-3 text-text text-opacity-70">
                    {s.scope_type === "DEPARTMENT" ? "Đơn vị" : "Danh mục"}: {s.scope_id}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.status === "OPEN"
                          ? "bg-green-500 bg-opacity-10 text-green-600"
                          : "bg-gray-500 bg-opacity-10 text-text text-opacity-60"
                      }`}
                    >
                      {s.status === "OPEN" ? "Đang mở" : "Đã đóng"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-60">
                    {new Date(s.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActive(s)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-text hover:border-primary"
                      >
                        {active?.id === s.id ? "Đang xem" : "Xem / Quét"}
                      </button>
                      {s.status === "OPEN" && (
                        <button
                          type="button"
                          disabled={closeMut.isPending}
                          onClick={() => {
                            if (window.confirm(`Đóng phiên "${s.name}"?`)) closeMut.mutate(s.id);
                          }}
                          className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-text hover:border-accent disabled:opacity-50"
                        >
                          Đóng phiên
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="rounded-2xl border border-border bg-surface px-5 py-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text text-opacity-60">
            Phiên: {active.name}
          </h2>

          {active.status === "OPEN" && (
            <div className="mb-4 flex items-center gap-3">
              <Input
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && scanCode.trim()) scanMut.mutate(scanCode.trim());
                }}
                placeholder="Nhập/quét mã tài sản..."
                className="w-72"
              />
              <Button
                type="button"
                disabled={!scanCode.trim() || scanMut.isPending}
                onClick={() => scanMut.mutate(scanCode.trim())}
              >
                <FiSearch className="mr-2" size={15} />
                Ghi quét
              </Button>
            </div>
          )}
          {scanMsg && <p className="mb-4 text-sm text-primary">{scanMsg}</p>}

          {report && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border p-4">
                <h3 className="mb-2 flex items-center text-sm font-semibold text-green-600">
                  <FiCheckCircle className="mr-2" />
                  Đã quét ({report.scanned_ok?.length ?? 0})
                </h3>
                <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
                  {(report.scanned_ok ?? []).map((s) => (
                    <li key={s.id}>
                      <Link to={`/dashboard/assets/${s.asset_code}`} className="text-primary hover:underline">
                        {s.asset_code}
                      </Link>{" "}
                      <span className="text-text text-opacity-70">— {s.asset_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border p-4">
                <h3 className="mb-2 text-sm font-semibold text-red-500">
                  Thiếu ({report.missing?.length ?? 0}/{report.total_expected})
                </h3>
                <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
                  {(report.missing ?? []).map((s) => (
                    <li key={s.asset_id}>
                      <Link to={`/dashboard/assets/${s.asset_code}`} className="text-primary hover:underline">
                        {s.asset_code}
                      </Link>{" "}
                      <span className="text-text text-opacity-70">— {s.asset_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border p-4">
                <h3 className="mb-2 text-sm font-semibold text-amber-600">
                  Ngoài phạm vi ({report.unexpected?.length ?? 0})
                </h3>
                <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
                  {(report.unexpected ?? []).map((s) => (
                    <li key={s.id}>
                      <Link to={`/dashboard/assets/${s.asset_code}`} className="text-primary hover:underline">
                        {s.asset_code}
                      </Link>{" "}
                      <span className="text-text text-opacity-70">— {s.asset_name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
