import { useMemo, useState } from "react";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { useAttributes } from "@/features/attributes/attributes.hooks";
import {
  useAddCategoryAttribute,
  useCategory,
  useRemoveCategoryAttribute,
} from "@/features/categories/categories.hooks";
import { errorMessage } from "@/types/api.types";

export function CategoryDetailPage() {
  const { id = "" } = useParams();
  const { data: category, isLoading, isError, error } = useCategory(id);
  const { data: attributes, isLoading: loadingAttrs } = useAttributes();
  const addAttribute = useAddCategoryAttribute(id);
  const removeAttribute = useRemoveCategoryAttribute(id);

  const [attributeId, setAttributeId] = useState("");
  const [required, setRequired] = useState(false);
  const [sortOrder, setSortOrder] = useState("1");
  const [defaultValue, setDefaultValue] = useState("");
  const [formError, setFormError] = useState("");

  const attached = useMemo(
    () => new Set((category?.attributes ?? []).map((a) => a.attribute_id)),
    [category],
  );
  const attributeOptions = useMemo(
    () =>
      (attributes ?? [])
        .filter((a) => !attached.has(a.id))
        .map((a) => ({
          value: a.id,
          label: `${a.name} (${a.code})`,
        })),
    [attributes, attached],
  );

  const handleAdd = () => {
    setFormError("");
    if (!attributeId) {
      setFormError("Vui lòng chọn thuộc tính.");
      return;
    }
    addAttribute.mutate(
      {
        attribute_id: attributeId,
        is_required: required,
        sort_order: Number(sortOrder) || 0,
        default_value: defaultValue.trim() || undefined,
      },
      {
        onSuccess: () => {
          setAttributeId("");
          setRequired(false);
          setSortOrder("1");
          setDefaultValue("");
        },
        onError: (e) => setFormError(errorMessage(e)),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-sm text-text text-opacity-60">
        Đang tải...
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center">
        <p className="mb-3 text-sm text-accent">
          {(error as Error)?.message || `Không tìm thấy danh mục "${id}".`}
        </p>
        <Link
          to="/dashboard/categories"
          className="text-sm font-medium text-primary hover:underline"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <Link
          to="/dashboard/categories"
          className="mb-2 inline-flex items-center text-sm text-text text-opacity-60 transition-colors hover:text-primary"
        >
          <FiArrowLeft className="mr-1" size={15} />
          Danh mục
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          {category.name}
        </h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Mã danh mục: {category.code}
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text text-opacity-60">
          Thêm thuộc tính vào danh mục
        </h2>
        <div className="flex flex-wrap items-end">
          <div className="mb-3 w-full pr-0 sm:w-1/2 sm:pr-2 lg:w-1/3">
            <FormField label="Thuộc tính" required>
              <FormSelect
                value={attributeId}
                options={attributeOptions}
                onChange={setAttributeId}
                placeholder={loadingAttrs ? "Đang tải..." : "Chọn thuộc tính"}
              />
            </FormField>
          </div>
          <div className="mb-3 w-full pl-0 sm:w-1/4 sm:pl-2 lg:w-1/6">
            <FormField label="Thứ tự">
              <Input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </FormField>
          </div>
          <div className="mb-3 w-full pr-0 sm:w-1/4 sm:pr-2 lg:w-1/4">
            <FormField label="Giá trị mặc định">
              <Input
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
                placeholder="Tùy chọn"
              />
            </FormField>
          </div>
          <div className="mb-3 flex items-center">
            <button
              type="button"
              aria-pressed={required}
              onClick={() => setRequired((v) => !v)}
              className={`flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                required
                  ? "border-primary bg-primary bg-opacity-10 text-primary"
                  : "border-border text-text text-opacity-60 hover:border-primary"
              }`}
            >
              <span
                className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                  required ? "bg-primary" : "bg-text bg-opacity-30"
                }`}
              />
              Bắt buộc
            </button>
            <Button
              type="button"
              className="ml-3 flex items-center rounded-lg"
              disabled={!attributeId || addAttribute.isPending}
              onClick={handleAdd}
            >
              <FiPlus className="mr-2" size={15} />
              {addAttribute.isPending ? "Đang thêm..." : "Thêm"}
            </Button>
          </div>
        </div>
        {formError && <p className="mt-1 text-xs text-accent">{formError}</p>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text text-opacity-60">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Mã</th>
              <th className="px-4 py-3 font-medium">Tên thuộc tính</th>
              <th className="px-4 py-3 font-medium">Kiểu</th>
              <th className="px-4 py-3 font-medium">Bắt buộc</th>
              <th className="px-4 py-3 font-medium">Mặc định</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {!category.attributes || category.attributes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text text-opacity-60">
                  Chưa có thuộc tính nào.
                </td>
              </tr>
            ) : (
              category.attributes
                .slice()
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((attr, i) => (
                  <tr key={attr.attribute_id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-text text-opacity-60">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-text">{attr.code}</td>
                    <td className="px-4 py-3 text-text text-opacity-80">{attr.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary">
                        {attr.data_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {attr.is_required ? (
                        <span className="inline-flex items-center rounded-full bg-accent bg-opacity-10 px-2 py-0.5 text-xs font-medium text-accent">
                          Bắt buộc
                        </span>
                      ) : (
                        <span className="text-text text-opacity-40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text text-opacity-60">
                      {attr.default_value || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-label="Gỡ"
                        disabled={removeAttribute.isPending}
                        onClick={() => removeAttribute.mutate(attr.attribute_id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-accent hover:bg-opacity-10 hover:text-accent disabled:opacity-50"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
