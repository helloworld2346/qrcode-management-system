import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  assetRows,
  statusColor,
  statusMeta,
  type AssetStatus,
} from "@/features/assets/data/mock";

interface Props {
  defaultValues: AssetFormValues;
  submitLabel: string;
  cancelTo: string;
  onSubmit: (values: AssetFormValues) => void;
}

export function AssetForm({
  defaultValues,
  submitLabel,
  cancelTo,
  onSubmit,
}: Props) {
  const unitOptions = useMemo(
    () =>
      Array.from(new Set(assetRows.map((a) => a.unit))).map((u) => ({
        value: u,
        label: u,
      })),
    [],
  );

  const statusOptions = useMemo(
    () => statusMeta.map((s) => ({ value: s.value, label: s.label })),
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues,
  });

  const watchCode = watch("code");
  const watchName = watch("name");
  const watchStatus = watch("status") as AssetStatus;

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
                label="Mã tài sản"
                required
                error={errors.code?.message}
                className="mb-4 w-full md:w-1/2 md:pr-2"
              >
                <Input
                  {...register("code")}
                  invalid={!!errors.code}
                  placeholder="VD: TS-2024-0001"
                />
              </FormField>

              <FormField
                label="Ngày cấp"
                required
                error={errors.issuedDate?.message}
                className="mb-4 w-full md:w-1/2 md:pl-2"
              >
                <Controller
                  name="issuedDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      invalid={!!errors.issuedDate}
                    />
                  )}
                />
              </FormField>

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
                label="Đơn vị"
                required
                error={errors.unit?.message}
                className="mb-4 w-full md:w-1/2 md:pr-2"
              >
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      invalid={!!errors.unit}
                      placeholder="-- Chọn đơn vị --"
                      options={unitOptions}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Trạng thái"
                required
                error={errors.status?.message}
                className="mb-4 w-full md:w-1/2 md:pl-2"
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      invalid={!!errors.status}
                      options={statusOptions}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Ghi chú"
                error={errors.note?.message}
                className="w-full"
              >
                <Textarea
                  {...register("note")}
                  invalid={!!errors.note}
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
            <p className="mb-2 text-xs text-text text-opacity-50">
              {watchCode || "Mã tài sản"}
            </p>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${statusColor[watchStatus]}1a`,
                color: statusColor[watchStatus],
              }}
            >
              <span
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: statusColor[watchStatus] }}
              />
              {statusMeta.find((s) => s.value === watchStatus)?.label}
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
