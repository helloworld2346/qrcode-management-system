import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import { Link } from "react-router-dom";

import { DatePicker } from "@/components/ui/DatePicker";
import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  assetSchema,
  type AssetFormValues,
} from "@/features/assets/assets.schema";
import { statusColor, statusMeta } from "@/features/assets/assets.types";
import { useCategory } from "@/features/categories/categories.hooks";
import type {
  Category,
  CategoryAttribute,
} from "@/features/categories/categories.types";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  defaultValues: AssetFormValues;
  submitLabel: string;
  cancelTo: string;
  onSubmit: (values: AssetFormValues) => void;
  categories: Category[];
  departments: { id: string; name: string }[];
}

function AttributeInput({
  attr,
  value,
  onChange,
}: {
  attr: CategoryAttribute;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const v = (value ?? "") as string;
  switch (attr.data_type) {
    case "SELECT":
      return (
        <FormSelect
          value={v}
          onChange={onChange}
          placeholder="-- Chọn --"
          options={(attr.options ?? []).map((o) => ({ value: o, label: o }))}
        />
      );
    case "NUMBER":
    case "DECIMAL":
      return (
        <Input
          type="number"
          value={v}
          onChange={(e) =>
            onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
        />
      );
    case "BOOLEAN":
      return (
        <FormSelect
          value={value === true ? "true" : value === false ? "false" : ""}
          onChange={(s) => onChange(s === "" ? undefined : s === "true")}
          placeholder="-- Chọn --"
          options={[
            { value: "true", label: "Có" },
            { value: "false", label: "Không" },
          ]}
        />
      );
    case "DATE":
      return (
        <DatePicker value={v} onChange={(iso) => onChange(iso || undefined)} />
      );
    case "TEXTAREA":
      return (
        <Textarea
          value={v}
          onChange={(e) => onChange(e.target.value || undefined)}
          rows={3}
        />
      );
    case "MULTI_SELECT":
      return (
        <select
          multiple
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(e) =>
            onChange(Array.from(e.target.selectedOptions).map((o) => o.value))
          }
        >
          {(attr.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <Input
          value={v}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
      );
  }
}

export function AssetForm({
  defaultValues,
  submitLabel,
  cancelTo,
  onSubmit,
  categories,
  departments,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin";

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues,
  });

  const watchName = watch("name");
  const watchCategoryId = watch("category_id");
  const watchAttributes = watch("attributes") ?? {};

  const { data: categoryDetail, isLoading: loadingAttrs } = useCategory(
    watchCategoryId ?? "",
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` })),
    [categories],
  );
  const deptOptions = useMemo(
    () => departments.map((d) => ({ value: d.id, label: d.name })),
    [departments],
  );
  const schema = useMemo(
    () =>
      (categoryDetail?.attributes ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order),
    [categoryDetail],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap">
        <div className="mb-4 w-full lg:w-2/3 lg:pr-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Thông tin cơ bản
            </h2>

            <div className="flex flex-wrap">
              <FormField
                label="Tên tài sản"
                required
                error={errors.name?.message}
                className="mb-4 w-full"
              >
                <Input
                  {...register("name")}
                  invalid={!!errors.name}
                  placeholder="VD: Máy phát điện 5kVA"
                />
              </FormField>

              <FormField
                label="Danh mục"
                required
                error={errors.category_id?.message}
                className={`mb-4 w-full ${isAdmin ? "md:w-1/2 md:pr-2" : ""}`}
              >
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        setValue("attributes", {}, { shouldDirty: true });
                      }}
                      onBlur={field.onBlur}
                      invalid={!!errors.category_id}
                      placeholder="-- Chọn danh mục --"
                      options={categoryOptions}
                    />
                  )}
                />
              </FormField>

              {isAdmin && (
                <FormField
                  label="Đơn vị"
                  className="mb-4 w-full md:w-1/2 md:pl-2"
                  error={errors.department_id?.message}
                >
                  <Controller
                    name="department_id"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        invalid={!!errors.department_id}
                        placeholder="-- Chọn đơn vị --"
                        options={deptOptions}
                      />
                    )}
                  />
                </FormField>
              )}

              {watchCategoryId && loadingAttrs && (
                <p className="mb-4 w-full text-sm text-text text-opacity-60">
                  Đang tải thuộc tính...
                </p>
              )}

              {schema.map((attr, i) => (
                <FormField
                  key={attr.attribute_id}
                  label={attr.name}
                  required={attr.is_required}
                  className={`mb-4 w-full md:w-1/2 ${i % 2 === 0 ? "md:pr-2" : "md:pl-2"}`}
                >
                  <AttributeInput
                    attr={attr}
                    value={watchAttributes[attr.code]}
                    onChange={(v) => {
                      const next = { ...watchAttributes };
                      if (v === undefined || v === "") delete next[attr.code];
                      else next[attr.code] = v;
                      setValue("attributes", next, { shouldDirty: true });
                    }}
                  />
                </FormField>
              ))}

              <FormField label="Ghi chú" className="w-full">
                <Textarea
                  {...register("note")}
                  rows={3}
                  placeholder="Thông tin bổ sung (không bắt buộc)"
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="mb-4 w-full lg:w-1/3 lg:pl-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text text-opacity-50">
              Xem trước
            </h2>
            <div className="mb-4 flex items-center justify-center rounded-xl border border-dashed border-border bg-bg py-8">
              <div className="text-center">
                <div className="mx-auto mb-2 h-24 w-24 rounded-lg bg-primary bg-opacity-5" />
                <span className="text-xs text-text text-opacity-40">
                  QR sẽ tạo sau khi lưu
                </span>
              </div>
            </div>
            <p className="mb-1 truncate text-sm font-medium text-text">
              {watchName || "Tên tài sản"}
            </p>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${statusColor.IN_STOCK}1a`,
                color: statusColor.IN_STOCK,
              }}
            >
              {statusMeta[0].label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end rounded-2xl border border-border bg-surface px-5 py-4">
        <Link
          to={cancelTo}
          className="mr-3 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary"
        >
          Hủy
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          <FiSave className="mr-2" size={16} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
