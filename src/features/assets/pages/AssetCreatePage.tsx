import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { AssetForm } from "@/features/assets/components/AssetForm";
import { type AssetFormValues } from "@/features/assets/assets.schema";
import { logger } from "@/utils/logger";

export function AssetCreatePage() {
  const navigate = useNavigate();

  const onSubmit = (values: AssetFormValues) => {
    // TODO: gọi qua useCreateAsset (TanStack Query mutation) khi có API layer
    logger.info("create asset", values);
    navigate("/dashboard/assets");
  };

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4">
        <Link
          to="/dashboard/assets"
          className="mb-1 inline-flex items-center text-xs font-medium text-text text-opacity-50 transition-colors hover:text-primary"
        >
          <FiArrowLeft className="mr-1" size={14} />
          Quay lại danh sách
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Thêm tài sản
        </h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Nhập thông tin tài sản mới cho đơn vị.
        </p>
      </div>

      <AssetForm
        defaultValues={{
          code: "",
          name: "",
          unit: "",
          status: "available",
          issuedDate: "",
          note: "",
        }}
        submitLabel="Lưu tài sản"
        cancelTo="/dashboard/assets"
        onSubmit={onSubmit}
      />
    </div>
  );
}
