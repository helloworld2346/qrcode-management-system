import { useEffect, useRef, useState } from "react";
import {
  FiCamera,
  FiCameraOff,
  FiImage,
  FiMaximize2,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/Input";
import { useAssetByCode } from "@/features/assets/assets.hooks";
import { statusColor, statusLabel } from "@/features/assets/assets.types";
import { errorMessage } from "@/types/api.types";

function parseCode(raw: string): string {
  const s = raw.trim();
  if (s.startsWith("TS|")) return s.split("|")[1] ?? "";
  const m = s.match(/\/scan\/([A-Za-z0-9]+)/);
  if (m) return m[1];
  return s;
}

const fmtValue = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "-";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Có" : "Không";
  return String(v);
};

export function ScannerPage() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraErr, setCameraErr] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [fileScanning, setFileScanning] = useState(false);
  const divId = "qr-reader";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);

  const { data: asset, isFetching, error } = useAssetByCode(code);

  useEffect(() => {
    if (!cameraOn) return;
    let stopped = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode(divId);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 220 },
          (decoded) => {
            const c = parseCode(decoded);
            if (c) {
              setCode(c);
              setInput(c);
              setCameraOn(false);
            }
          },
          () => {},
        );
        if (stopped) await scanner.stop();
      } catch (e) {
        setCameraErr(
          "Không mở được camera: " +
            ((e as Error)?.message ?? "kiểm tra quyền camera/HTTPS"),
        );
        setCameraOn(false);
      }
    })();
    return () => {
      stopped = true;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [cameraOn]);

  const lookup = () => {
    const c = parseCode(input);
    if (c) setCode(c);
  };

  const handleFile = async (file: File) => {
    setFileErr("");
    setFileScanning(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(divId);
      const decoded = await scanner.scanFile(file, false);
      const c = parseCode(decoded);
      if (c) {
        setCode(c);
        setInput(c);
      } else {
        setFileErr("Không đọc được mã từ ảnh.");
      }
    } catch {
      setFileErr("Không tìm thấy mã QR trong ảnh. Thử ảnh rõ nét hơn.");
    } finally {
      setFileScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-surface px-6 py-6">
        <div
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary opacity-10 blur-2xl"
          style={{ transform: "translate(30%, -30%)" }}
        />
        <div className="relative flex items-center">
          <span className="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary bg-opacity-10 text-primary">
            <FiSearch size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Quét / Tra cứu tài sản
            </h1>
            <p className="mt-1 text-sm text-text text-opacity-60">
              Nhập mã, quét bằng camera, hoặc tải ảnh QR lên để xem thông tin
              tức thì.
            </p>
          </div>
        </div>
      </div>

      <div className="-mx-2 flex flex-wrap">
        <div className="mb-4 w-full px-2 lg:w-1/2">
          <div className="h-full rounded-2xl border border-border bg-surface px-5 py-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text text-opacity-50">
              Mã tài sản
            </label>
            <div className="flex flex-wrap items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup()}
                placeholder="Nhập mã (VD: Oc1hPFfNDsCR) hoặc dán nội dung QR"
                className="mb-2 mr-3 w-full sm:flex-1"
              />
              <button
                type="button"
                onClick={lookup}
                disabled={!input.trim() || isFetching}
                className="mb-2 flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                <FiSearch className="mr-2" size={15} />
                {isFetching ? "Đang tìm..." : "Tra cứu"}
              </button>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text text-opacity-40">
                Hoặc quét mã
              </p>
              <div className="flex flex-wrap items-center">
                <button
                  type="button"
                  onClick={() => {
                    setCameraErr("");
                    setCameraOn((v) => !v);
                  }}
                  className={`mb-2 mr-3 flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    cameraOn
                      ? "border-primary bg-primary bg-opacity-10 text-primary"
                      : "border-border text-text hover:border-primary"
                  }`}
                >
                  {cameraOn ? (
                    <FiCameraOff className="mr-2" size={15} />
                  ) : (
                    <FiCamera className="mr-2" size={15} />
                  )}
                  {cameraOn ? "Tắt camera" : "Quét bằng camera"}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileScanning}
                  className="mb-2 flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary disabled:opacity-50"
                >
                  <FiImage className="mr-2" size={15} />
                  {fileScanning ? "Đang đọc ảnh..." : "Tải ảnh QR lên"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
              {cameraErr && (
                <p className="mt-2 text-xs text-accent">{cameraErr}</p>
              )}
              {fileErr && <p className="mt-2 text-xs text-accent">{fileErr}</p>}
            </div>

            {!cameraOn && <div id={divId} className="hidden" />}

            {cameraOn && (
              <div className="mt-4 rounded-xl border border-border bg-bg p-3">
                <div className="relative mx-auto w-full max-w-sm">
                  <div
                    id={divId}
                    className="w-full overflow-hidden rounded-xl"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2">
                    <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-primary" />
                    <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-primary" />
                    <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-primary" />
                    <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-primary" />
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-text text-opacity-50">
                  Đưa mã QR vào khung để quét tự động.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 w-full px-2 lg:w-1/2">
          {code && !isFetching && !asset && error && (
            <div className="flex items-start rounded-2xl border border-accent border-opacity-40 bg-accent bg-opacity-5 px-5 py-4">
              <FiX className="mr-2 mt-0.5 shrink-0 text-accent" size={16} />
              <span className="text-sm text-accent">{errorMessage(error)}</span>
            </div>
          )}

          {code && isFetching && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-text bg-opacity-10" />
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-text bg-opacity-10" />
              <div className="mb-2 h-4 w-full animate-pulse rounded bg-text bg-opacity-10" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-text bg-opacity-10" />
            </div>
          )}

          {!code && !asset && (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-5 py-10 text-center">
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary bg-opacity-10 text-primary">
                <FiSearch size={24} />
              </span>
              <p className="text-sm font-medium text-text">Chưa có kết quả</p>
              <p className="mt-1 text-xs text-text text-opacity-50">
                Nhập mã hoặc quét QR để xem thông tin tài sản tại đây.
              </p>
            </div>
          )}

          {asset && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                <div className="mr-3">
                  <h2 className="text-lg font-semibold text-text">
                    {asset.name}
                  </h2>
                  <p className="mt-0.5 font-mono text-xs text-text text-opacity-50">
                    {asset.code}
                  </p>
                </div>
                <span
                  className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${statusColor[asset.status]}1a`,
                    color: statusColor[asset.status],
                  }}
                >
                  {statusLabel(asset.status)}
                </span>
              </div>
              <dl className="text-sm">
                <div className="flex border-b border-border border-opacity-50 py-2">
                  <dt className="w-32 shrink-0 text-text text-opacity-50">
                    Danh mục
                  </dt>
                  <dd className="font-medium text-text">
                    {asset.category_name ?? "-"}
                  </dd>
                </div>
                <div className="flex border-b border-border border-opacity-50 py-2">
                  <dt className="w-32 shrink-0 text-text text-opacity-50">
                    Đơn vị
                  </dt>
                  <dd className="font-medium text-text">
                    {asset.department_name ?? asset.department_id ?? "-"}
                  </dd>
                </div>
                <div className="flex border-b border-border border-opacity-50 py-2">
                  <dt className="w-32 shrink-0 text-text text-opacity-50">
                    Ngày tạo
                  </dt>
                  <dd className="font-medium text-text">
                    {new Date(asset.created_at).toLocaleString("vi-VN")}
                  </dd>
                </div>
                {(() => {
                  const detail = (asset.attributes_detail ?? [])
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order);
                  const shownCodes = new Set(detail.map((d) => d.code));
                  const extras = Object.entries(asset.attributes ?? {}).filter(
                    ([k]) => !shownCodes.has(k),
                  );
                  return (
                    <>
                      {detail.map((attr) => (
                        <div
                          key={attr.code}
                          className="flex border-b border-border border-opacity-50 py-2 last:border-b-0"
                        >
                          <dt className="w-32 shrink-0 text-text text-opacity-50">
                            {attr.name}
                          </dt>
                          <dd className="font-medium text-text">
                            {fmtValue(attr.value)}
                          </dd>
                        </div>
                      ))}
                      {extras.map(([k, v]) => (
                        <div
                          key={k}
                          className="flex border-b border-border border-opacity-50 py-2 last:border-b-0"
                        >
                          <dt className="w-32 shrink-0 text-text text-opacity-50">
                            {k}
                          </dt>
                          <dd className="font-medium text-text">
                            {fmtValue(v)}
                          </dd>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </dl>
              <Link
                to={`/dashboard/assets/${asset.code}`}
                className="mt-4 inline-flex items-center rounded-lg bg-primary bg-opacity-10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-opacity-20"
              >
                <FiMaximize2 className="mr-2" size={15} />
                Xem chi tiết đầy đủ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
