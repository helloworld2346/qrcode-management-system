import { useMemo, useState } from "react";

import { FormSelect } from "@/components/ui/FormSelect";
import { Pagination } from "@/components/ui/Pagination";
import { useAccounts } from "@/features/accounts/accounts.hooks";
import { useAuditLogs } from "@/features/audit-log/audit-log.hooks";
import {
  actionLabel,
  ENTITY_LABELS,
  ENTITY_OPTIONS,
  type AuditEntity,
} from "@/features/audit-log/audit-log.types";

export function AuditLogPage() {
  const [entity, setEntity] = useState<AuditEntity | "">("");
  const [actorId, setActorId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, isError, error } = useAuditLogs({
    entity: entity || undefined,
    actor_id: actorId || undefined,
    page,
    size: pageSize,
  });

  // Map actor_id (ULID) -> username để hiển thị
  const { data: accountsData } = useAccounts({ page: 1, size: 200 });
  const actorMap = useMemo(() => {
    const m = new Map<string, string>();
    (accountsData?.items ?? []).forEach((a) => m.set(a.id, a.username));
    return m;
  }, [accountsData]);

  const actorOptions = useMemo(
    () => [
      { value: "", label: "Tất cả người thực hiện" },
      ...(accountsData?.items ?? []).map((a) => ({
        value: a.id,
        label: a.username,
      })),
    ],
    [accountsData],
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleEntity = (v: string) => {
    setEntity(v as AuditEntity | "");
    setPage(1);
  };
  const handleActor = (v: string) => {
    setActorId(v);
    setPage(1);
  };

  const actorName = (log: {
    actor_id: string;
    detail: Record<string, unknown> | null;
    entity_id: string;
  }) => {
    if (!log.actor_id) {
      const u = log.detail?.username;
      return typeof u === "string" ? u : log.entity_id || "—";
    }
    return actorMap.get(log.actor_id) ?? log.actor_id;
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-2 mr-4">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Nhật ký hệ thống
          </h1>
          <p className="mt-1 text-sm text-text text-opacity-60">
            Lịch sử thao tác của người dùng trên toàn hệ thống.
          </p>
        </div>
        <div className="mb-2 flex flex-wrap items-center">
          <FormSelect
            value={entity}
            onChange={handleEntity}
            placeholder="Tất cả đối tượng"
            className="mb-2 mr-3 w-48"
            options={[
              { value: "", label: "Tất cả đối tượng" },
              ...ENTITY_OPTIONS,
            ]}
          />
          <FormSelect
            value={actorId}
            onChange={handleActor}
            placeholder="Tất cả người thực hiện"
            className="mb-2 w-56"
            options={actorOptions}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[6%]" />
            <col className="w-[15%]" />
            <col className="w-[18%]" />
            <col className="w-[15%]" />
            <col className="w-[12%]" />
            <col className="w-[40%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-left text-text text-opacity-60">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Thời gian</th>
              <th className="px-4 py-3 font-medium">Người thực hiện</th>
              <th className="px-4 py-3 font-medium">Hành động</th>
              <th className="px-4 py-3 font-medium">Đối tượng</th>
              <th className="px-4 py-3 font-medium">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-accent">
                  {(error as Error).message}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  Chưa có bản ghi nào.
                </td>
              </tr>
            ) : (
              items.map((log, idx) => (
                <tr
                  key={log.id}
                  className="border-b border-border last:border-b-0 align-top"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-text text-opacity-60">
                    {(page - 1) * pageSize + idx + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-text text-opacity-60">
                    {new Date(log.created_at).toLocaleString("vi-VN")}
                  </td>
                  <td className="break-words px-4 py-3 text-text">
                    {actorName(log)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary">
                      {actionLabel(log.action)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-80">
                    {ENTITY_LABELS[log.entity] ?? log.entity}
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-70">
                    {log.detail && Object.keys(log.detail).length > 0 ? (
                      <ul className="space-y-0.5">
                        {Object.entries(log.detail).map(([k, v]) => (
                          <li
                            key={k}
                            className="whitespace-normal break-words text-xs"
                          >
                            <span className="text-text text-opacity-50">
                              {k}:
                            </span>{" "}
                            <span className="font-medium">
                              {typeof v === "object"
                                ? JSON.stringify(v)
                                : String(v)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-text text-opacity-40">—</span>
                    )}
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
