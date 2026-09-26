import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AssetForm } from "@/features/assets/components/AssetForm";
import { type AssetFormValues } from "@/features/assets/assets.schema";
import { isoToVN, vnToISO } from "@/features/assets/assets.utils";
import { findAssetByCode } from "@/features/assets/data/mock";
import { logger } from "@/utils/logger";

export function AssetEditPage() {
  const { code = "" } = useParams();
  const navigate = useNavigate();
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

  const onSubmit = (values: AssetFormValues) => {
    logger.info("update asset", {
      ...values,
      code: asset.code,
      issuedDate: isoToVN(values.issuedDate),
    });
    navigate(`/dashboard/assets/${asset.code}`);
  };

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
          Sửa tài sản
        </h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Cập nhật thông tin cho tài sản {asset.code}.
        </p>
      </div>

      <AssetForm
        defaultValues={{
          code: asset.code,
          name: asset.name,
          unit: asset.unit,
          status: asset.status,
          issuedDate: vnToISO(asset.issuedDate),
          note: "",
        }}
        submitLabel="Lưu thay đổi"
        cancelTo={`/dashboard/assets/${asset.code}`}
        onSubmit={onSubmit}
      />
    </div>
  );
}
