import { QRCodeSVG } from "qrcode.react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import { findAssetByCode } from "@/features/assets/data/mock";

const LABEL_WIDTH = "40mm";
const LABEL_HEIGHT = "30mm";

export function AssetPrintPage() {
  const { code = "" } = useParams();
  const asset = findAssetByCode(code);

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

  return (
    <div>
      {/* Vùng điều khiển - ẩn khi in */}
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
            Tem chuẩn {LABEL_WIDTH} x {LABEL_HEIGHT} cho tài sản {asset.code}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="mb-2 flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          <FiPrinter className="mr-2" size={16} />
          In
        </button>
      </div>

      {/* Vùng tem - chỉ in phần này */}
      <div className="no-print mb-4 text-xs text-text text-opacity-40">
        Xem trước tem:
      </div>
      <div className="print-area">
        <div
          className="flex items-center overflow-hidden border border-border bg-white"
          style={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }}
        >
          <div className="mr-2 flex items-center justify-center p-1">
            <QRCodeSVG value={asset.code} size={80} level="M" />
          </div>
          <div className="overflow-hidden pr-1">
            <p className="truncate text-[9px] font-semibold text-black">
              {asset.code}
            </p>
            <p className="truncate text-[8px] text-black">{asset.name}</p>
            <p className="truncate text-[7px] text-black">{asset.unit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
