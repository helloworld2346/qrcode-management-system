import { useEffect, useRef, useState } from "react";
import { FiCamera, FiCameraOff, FiSearch } from "react-icons/fi";
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

export function ScannerPage() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraErr, setCameraErr] = useState("");
  const divId = "qr-reader";
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

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Quét / Tra cứu
        </h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Nhập mã tài sản hoặc quét QR để xem thông tin đầy đủ.
        </p>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            placeholder="Nhập mã (VD: Oc1hPFfNDsCR) hoặc dán nội dung QR"
            className="mb-2 mr-3 w-full sm:w-96"
          />
          <button
            type="button"
            onClick={lookup}
            disabled={!input.trim() || isFetching}
            className="mb-2 mr-3 flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            <FiSearch className="mr-2" size={15} />
            {isFetching ? "Đang tìm..." : "Tra cứu"}
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraErr("");
              setCameraOn((v) => !v);
            }}
            className="mb-2 flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:border-primary"
          >
            {cameraOn ? (
              <FiCameraOff className="mr-2" size={15} />
            ) : (
              <FiCamera className="mr-2" size={15} />
            )}
            {cameraOn ? "Tắt camera" : "Quét bằng camera"}
          </button>
        </div>
        {cameraErr && <p className="mt-2 text-xs text-accent">{cameraErr}</p>}
      </div>

      {cameraOn && (
        <div className="mb-4 rounded-2xl border border-border bg-surface p-4">
          <div
            id={divId}
            className="mx-auto w-full max-w-sm overflow-hidden rounded-xl"
          />
        </div>
      )}

      {code && !isFetching && !asset && error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-600">
          {errorMessage(error)}
        </div>
      )}

      {asset && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">{asset.name}</h2>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${statusColor[asset.status]}1a`,
                color: statusColor[asset.status],
              }}
            >
              {statusLabel(asset.status)}
            </span>
          </div>
          <dl className="text-sm">
            <div className="flex py-2">
              <dt className="w-32 text-text text-opacity-50">Mã</dt>
              <dd className="font-medium text-text">{asset.code}</dd>
            </div>
            <div className="flex py-2">
              <dt className="w-32 text-text text-opacity-50">Danh mục</dt>
              <dd className="font-medium text-text">
                {asset.category_name ?? "-"}
              </dd>
            </div>
            <div className="flex py-2">
              <dt className="w-32 text-text text-opacity-50">Ngày tạo</dt>
              <dd className="font-medium text-text">
                {new Date(asset.created_at).toLocaleString("vi-VN")}
              </dd>
            </div>
            {Object.entries(asset.attributes ?? {}).map(([k, v]) => (
              <div key={k} className="flex py-2">
                <dt className="w-32 text-text text-opacity-50">{k}</dt>
                <dd className="font-medium text-text">
                  {Array.isArray(v)
                    ? v.join(", ")
                    : typeof v === "boolean"
                      ? v
                        ? "Có"
                        : "Không"
                      : String(v ?? "-")}
                </dd>
              </div>
            ))}
          </dl>
          <Link
            to={`/dashboard/assets/${asset.code}`}
            className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Xem chi tiết đầy đủ →
          </Link>
        </div>
      )}
    </div>
  );
}
