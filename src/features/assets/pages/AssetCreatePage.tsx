import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { useCreateAsset } from "@/features/assets/assets.hooks";
import type { AssetFormValues } from "@/features/assets/assets.schema";
import { AssetForm } from "@/features/assets/components/AssetForm";
import { useCategoryOptions } from "@/features/categories/categories.hooks";
import { useDepartmentOptions } from "@/features/departments/departments.hooks";
import { errorMessage } from "@/types/api.types";

export function AssetCreatePage() {
  const navigate = useNavigate();
  const createMut = useCreateAsset();
  const [submitErr, setSubmitErr] = useState("");

  const { data: categories } = useCategoryOptions();
  const { data: departments } = useDepartmentOptions();

  const onSubmit = (values: AssetFormValues) => {
    setSubmitErr("");
    createMut.mutate(
      {
        name: values.name,
        category_id: values.category_id,
        department_id: values.department_id || undefined,
        attributes: values.attributes,
      },
      {
        onSuccess: (a) => navigate(`/dashboard/assets/${a.code}`),
        onError: (e) => setSubmitErr(errorMessage(e)),
      },
    );
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

      {submitErr && (
        <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-sm text-red-600">
          {submitErr}
        </div>
      )}

      <AssetForm
        defaultValues={{
          name: "",
          category_id: "",
          department_id: "",
          attributes: {},
          note: "",
        }}
        submitLabel={createMut.isPending ? "Đang lưu..." : "Lưu tài sản"}
        cancelTo="/dashboard/assets"
        onSubmit={onSubmit}
        categories={categories ?? []}
        departments={departments ?? []}
      />
    </div>
  );
}
