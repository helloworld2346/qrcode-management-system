import { useMemo, useState, type FormEvent } from "react";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { useAttributes } from "@/features/attributes/attributes.hooks";
import {
  useAddCategoryAttribute,
  useCategory,
  useRemoveCategoryAttribute,
} from "@/features/categories/categories.hooks";
import { errorMessage } from "@/utils/errorMessages";

export function CategoryDetailPage() {
  const { id = "" } = useParams();
  const { data: category, isLoading, isError, error } = useCategory(id);
  const { data: attributes, isLoading: loadingAttrs } = useAttributes();
  const addAttribute = useAddCategoryAttribute(id);
  const removeAttribute = useRemoveCategoryAttribute(id);

  const [modalOpen, setModalOpen] = useState(false);
  const [attributeId, setAttributeId] = useState("");
  const [required, setRequired] = useState(false);
  const [sortOrder, setSortOrder] = useState("1");
  const [defaultValue, setDefaultValue] = useState("");
  const [formError, setFormError] = useState("");

  const attached = useMemo(
    () => new Set((category?.attributes ?? []).map((a) => a.attribute_id)),
    [category],
  );
  const available = useMemo(
    () => (attributes ?? []).filter((a) => !attached.has(a.id)),
    [attributes, attached],
  );
  const attributeOptions = useMemo(
    () =>
      available.map((a) => ({
        value: a.id,
        label: `${a.name} (${a.code})`,
      })),
    [available],
  );
  const selected = useMemo(
    () => available.find((a) => a.id === attributeId),
    [available, attributeId],
  );

  const nextOrder =
    Math.max(
      0,
      ...(category?.attributes ?? []).map((a) => a.sort_order),
    ) + 1;

  const openModal = () => {
    setAttributeId("");
    setRequired(false);
    setSortOrder(String(nextOrder));
    setDefaultValue("");
    setFormError("");
    setModalOpen(true);
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
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
        onSuccess: () => setModalOpen(false),
        onError: (e2) => setFormError(errorMessage(e2)),
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

  const attrs = (category.attributes ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-3 md:mb-0">
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
            Mã danh mục: {category.code} · {attrs.length} thuộc tính
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          disabled={available.length === 0 && !loadingAttrs}
          className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          title={available.length === 0 ? "Đã gắn hết thuộc tính" : ""}
        >
          <FiPlus className="mr-2" size={16} />
          Thêm thuộc tính
        </button>
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
            {attrs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  Chưa có thuộc tính nào — bấm "Thêm thuộc tính" để gắn.
                </td>
              </tr>
            ) : (
              attrs.map((attr, i) => (
                <tr
                  key={attr.attribute_id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 text-text text-opacity-60">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-text">
                    {attr.code}
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-80">
                    {attr.name}
                  </td>
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

      {modalOpen && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
          onClick={() => setModalOpen(false)}
        >
          <form
            onSubmit={handleAdd}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-text">
                Thêm thuộc tính vào "{category.name}"
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 hover:bg-primary hover:bg-opacity-10"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mb-3">
              <FormField label="Thuộc tính" required>
                <FormSelect
                  value={attributeId}
                  options={attributeOptions}
                  onChange={setAttributeId}
                  placeholder={loadingAttrs ? "Đang tải..." : "Chọn thuộc tính"}
                />
              </FormField>
            </div>

            {selected && (
              <div className="mb-3 rounded-xl border border-border bg-primary bg-opacity-5 px-3 py-2 text-xs text-text text-opacity-70">
                <span className="mr-2 inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2 py-0.5 font-medium text-primary">
                  {selected.data_type}
                </span>
                {Array.isArray(selected.options) && selected.options.length ? (
                  <span>Options: {selected.options.join(", ")}</span>
                ) : selected.options && !Array.isArray(selected.options) ? (
                  <span>Nhóm: {Object.keys(selected.options).join(", ")}</span>
                ) : selected.validation_regex ? (
                  <span>
                    Kiểm tra: <code>{selected.validation_regex}</code>
                  </span>
                ) : (
                  <span>Không có ràng buộc</span>
                )}
              </div>
            )}

            <div className="mb-3 flex flex-wrap">
              <div className="w-1/2 pr-2">
                <FormField label="Thứ tự hiển thị">
                  <div className="flex items-stretch overflow-hidden rounded-lg border border-border">
                    <button
                      type="button"
                      aria-label="Giảm"
                      onClick={() =>
                        setSortOrder(
                          String(Math.max(0, (Number(sortOrder) || 0) - 1)),
                        )
                      }
                      className="flex w-10 items-center justify-center bg-primary bg-opacity-5 text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                    >
                      <FiMinus size={14} />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full border-0 bg-surface px-3 py-2 text-center text-sm text-text outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      aria-label="Tăng"
                      onClick={() =>
                        setSortOrder(String((Number(sortOrder) || 0) + 1))
                      }
                      className="flex w-10 items-center justify-center bg-primary bg-opacity-5 text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </FormField>
              </div>
              <div className="w-1/2 pl-2">
                <FormField label="Giá trị mặc định">
                  <Input
                    value={defaultValue}
                    onChange={(e) => setDefaultValue(e.target.value)}
                    placeholder="Tùy chọn"
                  />
                </FormField>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={required}
              onClick={() => setRequired((v) => !v)}
              className="mb-4 flex items-center"
            >
              <span
                className={`relative mr-2 inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  required ? "bg-primary" : "bg-text bg-opacity-25"
                }`}
              >
                <span
                  className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    required ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="text-sm text-text">
                Bắt buộc nhập khi tạo tài sản
              </span>
            </button>

            {formError && (
              <p className="mb-3 text-xs text-accent">{formError}</p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-text text-opacity-70 transition-colors hover:bg-primary hover:bg-opacity-10"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!attributeId || addAttribute.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {addAttribute.isPending ? "Đang thêm..." : "Thêm thuộc tính"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
