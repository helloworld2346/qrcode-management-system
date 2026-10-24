import { useState } from "react";
import { FiArrowLeft, FiCopy, FiLayout, FiPrinter } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import {
  useAssetByCode,
  useAssetQR,
  useMarkPrinted,
} from "@/features/assets/assets.hooks";
import { statusColor, statusLabel } from "@/features/assets/assets.types";
import type { LabelPreset } from "@/features/print/print.api";
import { usePrintLabels } from "@/features/print/print.hooks";

const PRESET_OPTIONS = [
  { value: "A4-3x8", label: "A4 · 3×8 (24 tem/trang, QR 24mm)" },
  { value: "A4-2x5", label: "A4 · 2×5 (10 tem/trang, QR 40mm)" },
];

const PER_PAGE: Record<LabelPreset, number> = {
  "A4-3x8": 24,
  "A4-2x5": 10,
};

const LABEL_DIMS: Record<
  LabelPreset,
  { w: string; h: string; wmm: number; hmm: number; qrMm: number }
> = {
  "A4-3x8": { w: "65mm", h: "34mm", wmm: 65, hmm: 34, qrMm: 24 },
  "A4-2x5": { w: "95mm", h: "54mm", wmm: 95, hmm: 54, qrMm: 40 },
};

export function AssetPrintPage() {
  const { code = "" } = useParams();
  const { data: asset, isLoading } = useAssetByCode(code);
  const { data: qrUrl } = useAssetQR(asset?.id);

  const [preset, setPreset] = useState<LabelPreset>("A4-3x8");
  const [copies, setCopies] = useState(1);
  const [err, setErr] = useState("");

  const printMut = usePrintLabels();
  const markMut = useMarkPrinted();

  const dims = LABEL_DIMS[preset];

  const handlePrint = () => {
    if (!asset) return;
    setErr("");
    printMut.mutate(
      { ids: [asset.id], label_preset: preset, copies },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
          markMut.mutate([asset.id]);
        },
        onError: (e) => setErr((e as Error).message),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-text text-opacity-60">
        Đang tải...
      </div>
    );
  }

  if (!asset) {
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

  const pages = Math.ceil(copies / PER_PAGE[preset]);

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <Link
          to={`/dashboard/assets/${asset.code}`}
          className="mb-1 inline-flex items-center text-xs font-medium text-text text-opacity-50 transition-colors hover:text-primary"
        >
          <FiArrowLeft className="mr-1" size={14} />
          Quay lại chi tiết
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          In tem QR
        </h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Tem chuẩn {dims.w} x {dims.h} cho tài sản {asset.code}.
        </p>
      </div>

      <div className="flex flex-wrap">
        <div className="mb-4 w-full lg:w-1/3 lg:pr-2">
          <div className="mb-4 rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Tùy chọn in
            </h2>

            <label className="mb-1 flex items-center text-xs font-medium text-text text-opacity-60">
              <FiLayout className="mr-1.5" size={13} />
              Khổ tem
            </label>
            <FormSelect
              value={preset}
              options={PRESET_OPTIONS}
              onChange={(v) => setPreset(v as LabelPreset)}
              className="mb-4"
            />

            <label className="mb-1 flex items-center text-xs font-medium text-text text-opacity-60">
              <FiCopy className="mr-1.5" size={13} />
              Số bản in
            </label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={copies}
              onChange={(e) =>
                setCopies(Math.max(1, Number(e.target.value) || 1))
              }
              className="mb-4"
            />

            <button
              type="button"
              onClick={handlePrint}
              disabled={printMut.isPending}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              <FiPrinter className="mr-2" size={16} />
              {printMut.isPending ? "Đang tạo PDF..." : "In tem"}
            </button>

            {err && (
              <div className="mt-3 rounded-lg border border-accent px-3 py-2 text-xs text-accent">
                {err}
              </div>
            )}

            <p className="mt-3 text-xs text-text text-opacity-40">
              {copies} tem · {pages} trang ({PER_PAGE[preset]} tem/trang)
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Thông tin tài sản
            </h2>
            <dl>
              {[
                { label: "Mã tài sản", value: asset.code },
                { label: "Tên", value: asset.name },
                { label: "Đơn vị", value: asset.department_name ?? "-" },
                { label: "Danh mục", value: asset.category_name ?? "-" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex border-b border-border py-2.5 last:border-b-0"
                >
                  <dt className="w-24 shrink-0 text-xs text-text text-opacity-50">
                    {r.label}
                  </dt>
                  <dd className="text-xs font-medium text-text">{r.value}</dd>
                </div>
              ))}
              <div className="flex items-center border-b border-border py-2.5 last:border-b-0">
                <dt className="w-24 shrink-0 text-xs text-text text-opacity-50">
                  Trạng thái
                </dt>
                <dd>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${statusColor[asset.status]}1a`,
                      color: statusColor[asset.status],
                    }}
                  >
                    {statusLabel(asset.status)}
                  </span>
                </dd>
              </div>
              <div className="flex py-2.5">
                <dt className="w-24 shrink-0 text-xs text-text text-opacity-50">
                  Đã in tem
                </dt>
                <dd className="text-xs font-medium text-text">
                  {asset.is_printed ? "Có" : "Chưa"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mb-4 w-full lg:w-2/3 lg:pl-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
                Xem trước tem
              </h2>
              <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium text-text text-opacity-60">
                {dims.w} × {dims.h}
              </span>
            </div>

            <div
              className="relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border py-16"
              style={{
                backgroundColor: "rgb(var(--color-bg))",
                backgroundImage:
                  "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            >
              <div className="relative">
                <div className="absolute -top-6 left-0 right-0 flex items-center">
                  <span className="h-2 w-px bg-text bg-opacity-30" />
                  <span className="h-px flex-1 bg-text bg-opacity-30" />
                  <span className="mx-1 text-[10px] font-medium text-text text-opacity-50">
                    {dims.wmm}mm
                  </span>
                  <span className="h-px flex-1 bg-text bg-opacity-30" />
                  <span className="h-2 w-px bg-text bg-opacity-30" />
                </div>

                <div className="absolute -right-8 bottom-0 top-0 flex flex-col items-center">
                  <span className="w-2 h-px bg-text bg-opacity-30" />
                  <span className="w-px flex-1 bg-text bg-opacity-30" />
                  <span className="my-1 text-[10px] font-medium text-text text-opacity-50">
                    {dims.hmm}mm
                  </span>
                  <span className="w-px flex-1 bg-text bg-opacity-30" />
                  <span className="w-2 h-px bg-text bg-opacity-30" />
                </div>

                <div
                  className="flex items-center overflow-hidden rounded bg-white pl-4 shadow-lg ring-1 ring-black ring-opacity-5"
                  style={{ width: dims.w, height: dims.h }}
                >
                  <div className="mr-2 flex items-center justify-center border border-gray-300 p-1">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt={asset.code}
                        style={{
                          width: dims.qrMm + "mm",
                          height: dims.qrMm + "mm",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-gray-100"
                        style={{ width: dims.qrMm + "mm", height: dims.qrMm + "mm" }}
                      />
                    )}
                  </div>
                  <div className="overflow-hidden border-l border-gray-300 pl-2 pr-1">
                    <p className="truncate text-[9px] font-semibold text-black">
                      {asset.name}
                    </p>
                    <p className="truncate text-[8px] text-gray-500">
                      {asset.department_name ?? ""}
                    </p>
                    <p className="mt-0.5 inline-block rounded bg-gray-100 px-1 text-[8px] font-semibold text-black">
                      {asset.code}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
