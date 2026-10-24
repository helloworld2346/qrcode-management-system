import { useState } from "react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import { useAssetByCode, useAssetQR } from "@/features/assets/assets.hooks";

const LABEL_WIDTH = "40mm";
const LABEL_HEIGHT = "30mm";
const COPY_OPTIONS = [1, 4, 8, 12, 24];

export function AssetPrintPage() {
  const { code = "" } = useParams();
  const { data: asset, isLoading } = useAssetByCode(code);
  const { data: qrUrl } = useAssetQR(asset?.id);
  const [copies, setCopies] = useState(1);

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

  const Label = () => (
    <div
      className="flex items-center overflow-hidden border border-border bg-white"
      style={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }}
    >
      <div className="mr-2 flex items-center justify-center p-1">
        {qrUrl ? (
          <img src={qrUrl} alt={asset.code} width={80} height={80} />
        ) : (
          <div className="h-[80px] w-[80px] bg-gray-100" />
        )}
      </div>
      <div className="overflow-hidden pr-1">
        <p className="truncate text-[9px] font-semibold text-black">
          {asset.code}
        </p>
        <p className="truncate text-[8px] text-black">{asset.name}</p>
        <p className="truncate text-[7px] text-black">
          {asset.category_name ?? ""}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-2 mr-4">
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
            Tem chuẩn {LABEL_WIDTH} × {LABEL_HEIGHT} cho tài sản {asset.code}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="mb-2 flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
        >
          <FiPrinter className="mr-2" size={16} />
          In {copies > 1 ? `${copies} tem` : "tem"}
        </button>
      </div>

      {/* Nội dung: 2 cột */}
      <div className="no-print -mx-2 flex flex-wrap">
        {/* Cột trái: khung giấy xem trước */}
        <div className="mb-4 w-full px-2 lg:w-2/3">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
                Xem trước tem
              </h2>
              <span className="rounded-full bg-primary bg-opacity-10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {LABEL_WIDTH} × {LABEL_HEIGHT}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-bg py-10">
              <div
                className="rounded-lg bg-white p-3"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
              >
                <Label />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: thông tin + số bản in */}
        <div className="mb-4 w-full px-2 lg:w-1/3">
          <div className="mb-4 rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Thông tin
            </h2>
            <dl className="text-sm">
              <div className="mb-3 border-b border-border pb-3">
                <dt className="mb-0.5 text-xs text-text text-opacity-50">
                  Mã tài sản
                </dt>
                <dd className="font-medium text-text">{asset.code}</dd>
              </div>
              <div className="mb-3 border-b border-border pb-3">
                <dt className="mb-0.5 text-xs text-text text-opacity-50">
                  Tên tài sản
                </dt>
                <dd className="font-medium text-text">{asset.name}</dd>
              </div>
              <div>
                <dt className="mb-0.5 text-xs text-text text-opacity-50">
                  Danh mục
                </dt>
                <dd className="font-medium text-text">
                  {asset.category_name ?? "-"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Số bản in
            </h2>
            <div className="-mx-1 flex flex-wrap">
              {COPY_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCopies(n)}
                  className={`mx-1 mb-2 h-9 w-12 rounded-lg border text-sm font-medium transition-colors ${
                    copies === n
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-text hover:border-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-text text-opacity-50">
              In {copies} tem lên khổ A4, xếp lưới tự động.
            </p>
          </div>
        </div>
      </div>

      {/* Vùng in thật: lưới N tem, dùng margin thay cho gap */}
      <div className="print-area">
        <div className="-m-1 flex flex-wrap">
          {Array.from({ length: copies }).map((_, i) => (
            <div key={i} className="m-1">
              <Label />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
