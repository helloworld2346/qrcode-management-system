import { useState } from "react";
import { FiArrowLeft, FiEdit2, FiPrinter, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormSelect } from "@/components/ui/FormSelect";
import {
  useAssetByCode,
  useAssetHistory,
  useAssetQR,
  useDeleteAsset,
  useUpdateAssetStatus,
} from "@/features/assets/assets.hooks";
import {
  statusColor,
  statusLabel,
  statusMeta,
  type AssetStatus,
} from "@/features/assets/assets.types";
import { useAuthStore } from "@/store/auth.store";
import { errorMessage } from "@/utils/errorMessages";

const fmtValue = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "-";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Có" : "Không";
  if (typeof v === "object") {
    const o = v as { parent?: string; child?: string };
    if ("parent" in o || "child" in o) {
      return [o.parent, o.child].filter(Boolean).join(" → ");
    }
  }
  return String(v);
};

export function AssetDetailPage() {
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const canWrite = user?.role === "admin" || user?.role === "editor";
  const { data: asset, isLoading, error } = useAssetByCode(code);
  const { data: qrUrl } = useAssetQR(asset?.id);
  const { data: history } = useAssetHistory(asset?.id);
  const statusMut = useUpdateAssetStatus();
  const [newStatus, setNewStatus] = useState<AssetStatus | "">("");
  const [note, setNote] = useState("");
  const [statusErr, setStatusErr] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");
  const deleteMut = useDeleteAsset();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-text text-opacity-60">
        Đang tải...
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center">
        <p className="mb-3 text-sm text-text text-opacity-60">
          Không tìm thấy tài sản với mã “{code}”.
        </p>
        <Link
          to="/dashboard/assets"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <FiArrowLeft className="mr-1" size={14} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const rows = [
    { label: "Mã tài sản", value: asset.code },
    { label: "Tên tài sản", value: asset.name },
    { label: "Danh mục", value: asset.category_name ?? asset.category_id },
    { label: "Đơn vị", value: asset.department_name ?? asset.department_id },
    {
      label: "Ngày tạo",
      value: new Date(asset.created_at).toLocaleString("vi-VN"),
    },
    { label: "Đã in tem", value: asset.is_printed ? "Có" : "Chưa" },
  ];

  const detail = asset.attributes_detail ?? [];
  const shownCodes = new Set(detail.map((d) => d.code));
  const attrRows = [
    ...detail
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((d) => ({ label: d.name, value: fmtValue(d.value) })),
    ...Object.entries(asset.attributes ?? {})
      .filter(([k]) => !shownCodes.has(k))
      .map(([k, v]) => ({ label: k, value: fmtValue(v) })),
  ];

  const submitStatus = () => {
    if (!newStatus) return;
    setStatusErr("");
    statusMut.mutate(
      { id: asset.id, payload: { status: newStatus, note: note || undefined } },
      {
        onSuccess: () => {
          setNewStatus("");
          setNote("");
        },
        onError: (e) => setStatusErr(errorMessage(e)),
      },
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-2 mr-4">
          <Link
            to="/dashboard/assets"
            className="mb-1 inline-flex items-center text-xs font-medium text-text text-opacity-50 transition-colors hover:text-primary"
          >
            <FiArrowLeft className="mr-1" size={14} />
            Quay lại danh sách
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            {asset.name}
          </h1>
          <p className="mt-1 text-sm text-text text-opacity-60">
            Chi tiết tài sản {asset.code}.
          </p>
        </div>
        <div className="mb-2 flex items-center">
          <Link
            to={`/dashboard/assets/${asset.code}/print`}
            className="mr-3 flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary"
          >
            <FiPrinter className="mr-2" size={16} />
            In QR
          </Link>
          {canWrite && (
            <>
              <Link
                to={`/dashboard/assets/${asset.code}/edit`}
                className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                <FiEdit2 className="mr-2" size={16} />
                Sửa
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDeleteErr("");
                  setDeleteOpen(true);
                }}
                className="ml-3 flex items-center rounded-lg border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:bg-opacity-10"
              >
                <FiTrash2 className="mr-2" size={16} />
                Xóa
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap">
        <div className="mb-4 w-full lg:w-2/3 lg:pr-2">
          <div className="mb-4 rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
                Thông tin cơ bản
              </h2>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${statusColor[asset.status]}1a`,
                  color: statusColor[asset.status],
                }}
              >
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: statusColor[asset.status] }}
                />
                {statusLabel(asset.status)}
              </span>
            </div>
            <dl>
              {rows.map((r) => (
                <div
                  key={r.label}
                  className="flex border-b border-border py-3 last:border-b-0"
                >
                  <dt className="w-40 text-sm text-text text-opacity-50">
                    {r.label}
                  </dt>
                  <dd className="text-sm font-medium text-text">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {attrRows.length > 0 && (
            <div className="mb-4 rounded-2xl border border-border bg-surface p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
                Thuộc tính
              </h2>
              <dl>
                {attrRows.map((r) => (
                  <div
                    key={r.label}
                    className="flex border-b border-border py-3 last:border-b-0"
                  >
                    <dt className="w-40 text-sm text-text text-opacity-50">
                      {r.label}
                    </dt>
                    <dd className="text-sm font-medium text-text">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {canWrite && (
            <div className="mb-4 rounded-2xl border border-border bg-surface p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
                Đổi trạng thái
              </h2>
              <div className="flex flex-wrap items-end">
                <FormSelect
                  value={newStatus}
                  onChange={(v) => setNewStatus(v as AssetStatus)}
                  placeholder="-- Trạng thái mới --"
                  className="mb-3 mr-3 w-56"
                  options={statusMeta
                    .filter((s) => s.value !== asset.status)
                    .filter(
                      (s) => s.value !== "LIQUIDATED" || user?.role === "admin",
                    )
                    .map((s) => ({ value: s.value, label: s.label }))}
                />
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú"
                  className="mb-3 mr-3 w-56 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                />
                <button
                  type="button"
                  onClick={submitStatus}
                  disabled={!newStatus || statusMut.isPending}
                  className="mb-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {statusMut.isPending ? "Đang đổi..." : "Đổi"}
                </button>
              </div>
              {statusErr && (
                <p className="mt-2 text-sm text-red-500">{statusErr}</p>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Lịch sử trạng thái
            </h2>
            {!history || history.length === 0 ? (
              <p className="text-sm text-text text-opacity-50">Chưa có.</p>
            ) : (
              <ul className="space-y-2">
                {history.map((h) => (
                  <li key={h.id} className="flex items-baseline text-sm">
                    <span className="w-40 shrink-0 text-text text-opacity-50">
                      {new Date(h.created_at).toLocaleString("vi-VN")}
                    </span>
                    <span className="font-medium text-text">
                      {h.old_status ? `${statusLabel(h.old_status)} → ` : ""}
                      {statusLabel(h.new_status)}
                    </span>
                    {h.note && (
                      <span className="ml-2 text-text text-opacity-60">
                        ({h.note})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-4 w-full lg:w-1/3 lg:pl-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Mã QR
            </h2>
            <div className="mb-4 flex items-center justify-center rounded-xl border border-border bg-white py-6">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`QR ${asset.code}`}
                  width={160}
                  height={160}
                />
              ) : (
                <span className="text-xs text-text text-opacity-40">
                  Đang tải QR...
                </span>
              )}
            </div>
            <p className="text-center text-xs text-text text-opacity-50">
              {asset.code}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Xóa tài sản"
        message={`Xóa "${asset.name}" (${asset.code})? Chỉ tài sản Trong kho mới xóa được.`}
        confirmLabel="Xóa"
        loading={deleteMut.isPending}
        error={deleteErr}
        onConfirm={() => {
          setDeleteErr("");
          deleteMut.mutate(asset.id, {
            onSuccess: () => navigate("/dashboard/assets"),
            onError: (e) => setDeleteErr(errorMessage(e)),
          });
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
