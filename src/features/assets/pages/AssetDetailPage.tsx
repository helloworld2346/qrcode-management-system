import { QRCodeSVG } from "qrcode.react";
import { FiArrowLeft, FiEdit2, FiPrinter } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import {
  findAssetByCode,
  statusColor,
  statusMeta,
} from "@/features/assets/data/mock";

export function AssetDetailPage() {
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

  const statusText =
    statusMeta.find((s) => s.value === asset.status)?.label ?? asset.status;

  const rows = [
    { label: "Mã tài sản", value: asset.code },
    { label: "Tên tài sản", value: asset.name },
    { label: "Đơn vị", value: asset.unit },
    { label: "Ngày cấp", value: asset.issuedDate },
  ];

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
          <Link
            to={`/dashboard/assets/${asset.code}/edit`}
            className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <FiEdit2 className="mr-2" size={16} />
            Sửa
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap">
        {/* Cột trái: thông tin */}
        <div className="mb-4 w-full lg:w-2/3 lg:pr-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
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
                {statusText}
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
        </div>

        {/* Cột phải: QR */}
        <div className="mb-4 w-full lg:w-1/3 lg:pl-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Mã QR
            </h2>
            <div className="mb-4 flex items-center justify-center rounded-xl border border-border bg-white py-6">
              <QRCodeSVG value={asset.code} size={160} level="M" />
            </div>
            <p className="text-center text-xs text-text text-opacity-50">
              {asset.code}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
