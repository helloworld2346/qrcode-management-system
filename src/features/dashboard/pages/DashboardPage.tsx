import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { assetsApi } from "@/features/assets/assets.api";
import {
  statusColor,
  statusLabel,
  statusMeta,
} from "@/features/assets/assets.types";
import { pickData } from "@/types/api.types";

export function DashboardPage() {
  const results = useQueries({
    queries: statusMeta.map((s) => ({
      queryKey: ["assets-count", s.value],
      queryFn: async () =>
        pickData(await assetsApi.list({ status: s.value, size: 1 }))?.total ?? 0,
    })),
  });
  const totalQuery = useQueries({
    queries: [
      {
        queryKey: ["assets-count", "all"],
        queryFn: async () =>
          pickData(await assetsApi.list({ size: 1 }))?.total ?? 0,
      },
    ],
  });

  const loading = results.some((r) => r.isLoading) || totalQuery[0].isLoading;
  const total = totalQuery[0].data ?? 0;
  const counts = statusMeta.map((s, i) => ({
    ...s,
    count: results[i].data ?? 0,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-text">Tổng quan</h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Tình hình tài sản trong hệ thống.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface px-5 py-4">
          <p className="text-sm text-text text-opacity-60">Tổng tài sản</p>
          <p className="mt-1 text-3xl font-bold text-text">
            {loading ? "…" : total}
          </p>
        </div>
        {counts.slice(0, 3).map((c) => (
          <div key={c.value} className="rounded-2xl border border-border bg-surface px-5 py-4">
            <p className="text-sm text-text text-opacity-60">{c.label}</p>
            <p
              className="mt-1 text-3xl font-bold"
              style={{ color: statusColor[c.value] }}
            >
              {loading ? "…" : c.count}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface px-5 py-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text text-opacity-60">
          Tài sản theo trạng thái
        </h2>
        <div className="space-y-3">
          {counts.map((c) => (
            <Link
              key={c.value}
              to={`/dashboard/assets?status=${c.value}`}
              className="flex items-center gap-3"
            >
              <span className="w-32 shrink-0 text-sm text-text text-opacity-70">
                {c.label}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-primary bg-opacity-10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round((c.count / max) * 100)}%`,
                    backgroundColor: statusColor[c.value],
                  }}
                />
              </div>
              <span className="w-10 text-right text-sm font-medium text-text">
                {loading ? "…" : c.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
