import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { AssetFormValues } from "@/features/assets/assets.schema";
import { useAssetByCode, useUpdateAsset } from "@/features/assets/assets.hooks";
import { AssetForm } from "@/features/assets/components/AssetForm";
import { categoriesApi } from "@/features/categories/categories.api";
import { departmentsApi } from "@/features/departments/departments.api";
import { pickData, errorMessage } from "@/types/api.types";

export function AssetEditPage() {
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const { data: asset, isLoading } = useAssetByCode(code);
  const updateMut = useUpdateAsset();
  const [submitErr, setSubmitErr] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => pickData(await categoriesApi.list(1, 100))?.items ?? [],
  });
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => pickData(await departmentsApi.list(1, 100))?.items ?? [],
  });

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

  const onSubmit = (values: AssetFormValues) => {
    setSubmitErr("");
    updateMut.mutate(
      {
        id: asset.id,
        payload: {
          name: values.name,
          category_id: values.category_id || undefined,
          attributes: values.attributes,
        },
      },
      {
        onSuccess: () => navigate(`/dashboard/assets/${asset.code}`),
        onError: (e) => setSubmitErr(errorMessage(e)),
      },
    );
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

      {submitErr && (
        <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-sm text-red-600">
          {submitErr}
        </div>
      )}

      <AssetForm
        defaultValues={{
          name: asset.name,
          category_id: asset.category_id,
          department_id: asset.department_id,
          attributes: (asset.attributes ?? {}) as Record<string, unknown>,
          note: "",
        }}
        submitLabel={updateMut.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        cancelTo={`/dashboard/assets/${asset.code}`}
        onSubmit={onSubmit}
        categories={categories ?? []}
        departments={departments ?? []}
      />
    </div>
  );
}
