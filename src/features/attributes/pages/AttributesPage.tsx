import { useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import {
  useAttributes,
  useCreateAttribute,
  useDeleteAttribute,
} from "@/features/attributes/attributes.hooks";
import {
  DATA_TYPES,
  OPTION_TYPES,
  REGEX_TYPES,
  type DataType,
} from "@/features/attributes/attributes.types";
import { logger } from "@/utils/logger";

const dataTypeOptions = DATA_TYPES.map((t) => ({ value: t, label: t }));

export function AttributesPage() {
  const [code, setCode] = useState("");
  const [attributeName, setAttributeName] = useState("");
  const [dataType, setDataType] = useState<DataType>("TEXT");
  const [description, setDescription] = useState("");
  const [validationRegex, setValidationRegex] = useState("");
  const [optionsInput, setOptionsInput] = useState("");
  const [formError, setFormError] = useState("");

  const { data: attributes, isLoading, isError, error } = useAttributes();
  const createAttribute = useCreateAttribute();
  const deleteAttribute = useDeleteAttribute();

  const needsOptions = OPTION_TYPES.includes(dataType);
  const needsRegex = REGEX_TYPES.includes(dataType);

  const parsedOptions = useMemo(() => {
    if (!needsOptions) return null;
    const items = optionsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return items.length ? items : null;
  }, [needsOptions, optionsInput]);

  const handleCreate = () => {
    setFormError("");
    const trimmedCode = code.trim();
    const trimmedName = attributeName.trim();
    if (!trimmedCode || !trimmedName) {
      setFormError("Vui lòng nhập mã và tên thuộc tính.");
      return;
    }
    if (needsOptions && !parsedOptions) {
      setFormError("Kiểu SELECT / MULTI_SELECT cần nhập ít nhất 1 option.");
      return;
    }

    createAttribute.mutate(
      {
        code: trimmedCode,
        attributeName: trimmedName,
        dataType,
        description: description.trim(),
        validationRegex:
          needsRegex && validationRegex.trim() ? validationRegex.trim() : null,
        options: parsedOptions ? JSON.stringify(parsedOptions) : null,
      },
      {
        onSuccess: () => {
          setCode("");
          setAttributeName("");
          setDataType("TEXT");
          setDescription("");
          setValidationRegex("");
          setOptionsInput("");
        },
      },
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Xóa thuộc tính "${name}"?`)) {
      deleteAttribute.mutate(id);
    }
  };

  const renderOptions = (raw: string | null) => {
    if (!raw) return "—";
    try {
      const arr: unknown = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return (
          <span>
            {arr.map((opt, i) => (
              <span
                key={i}
                className="mb-1 mr-1 inline-block rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {String(opt)}
              </span>
            ))}
          </span>
        );
      }
      return <span className="text-xs">{raw}</span>;
    } catch (e) {
      logger.warn("parse attribute options failed", e);
      return <span className="text-xs">{raw}</span>;
    }
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-center">
          <div className="mr-auto">
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Thuộc tính
            </h1>
            <p className="mt-1 text-sm text-text text-opacity-60">
              Kho thuộc tính tái sử dụng cho các danh mục.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text text-opacity-60">
          Thêm thuộc tính
        </h2>
        <div className="flex flex-wrap">
          <div className="mb-3 w-full pr-0 sm:w-1/2 sm:pr-2 lg:w-1/4">
            <FormField label="Mã thuộc tính" required>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: CHAT_LIEU"
              />
            </FormField>
          </div>
          <div className="mb-3 w-full pl-0 sm:w-1/2 sm:pl-2 lg:w-1/4">
            <FormField label="Tên thuộc tính" required>
              <Input
                value={attributeName}
                onChange={(e) => setAttributeName(e.target.value)}
                placeholder="VD: Chất liệu"
              />
            </FormField>
          </div>
          <div className="mb-3 w-full pr-0 sm:w-1/2 sm:pr-2 lg:w-1/4">
            <FormField label="Kiểu dữ liệu" required>
              <FormSelect
                value={dataType}
                options={dataTypeOptions}
                onChange={(v) => setDataType(v as DataType)}
              />
            </FormField>
          </div>
          <div className="mb-3 w-full pl-0 sm:w-1/2 sm:pl-2 lg:w-1/4">
            <FormField label="Mô tả">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn"
              />
            </FormField>
          </div>

          {needsOptions ? (
            <div className="mb-3 w-full pr-0 sm:w-1/2 sm:pr-2">
              <FormField label="Options (phân tách bởi dấu phẩy)" required>
                <Input
                  value={optionsInput}
                  onChange={(e) => setOptionsInput(e.target.value)}
                  placeholder="Gỗ, Nhựa, Kim loại, Vải"
                />
              </FormField>
            </div>
          ) : null}

          {needsRegex ? (
            <div className="mb-3 w-full pl-0 sm:w-1/2 sm:pl-2">
              <FormField label="Validation regex">
                <Input
                  value={validationRegex}
                  onChange={(e) => setValidationRegex(e.target.value)}
                  placeholder="VD: ^\\d+$"
                />
              </FormField>
            </div>
          ) : null}
        </div>

        {formError ? (
          <p className="mb-2 text-xs text-accent">{formError}</p>
        ) : null}
        {createAttribute.isError ? (
          <p className="mb-2 text-xs text-accent">
            {createAttribute.error.message}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="button"
            className="flex items-center rounded-lg"
            disabled={createAttribute.isPending}
            onClick={handleCreate}
          >
            <FiPlus className="mr-2" size={15} />
            {createAttribute.isPending ? "Đang lưu..." : "Thêm thuộc tính"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text text-opacity-60">
              <th className="px-4 py-3 font-medium">Mã</th>
              <th className="px-4 py-3 font-medium">Tên thuộc tính</th>
              <th className="px-4 py-3 font-medium">Kiểu</th>
              <th className="px-4 py-3 font-medium">Options</th>
              <th className="px-4 py-3 font-medium">Regex</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-accent">
                  {error.message}
                </td>
              </tr>
            ) : !attributes || attributes.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  Chưa có thuộc tính nào.
                </td>
              </tr>
            ) : (
              attributes.map((a) => (
                <tr
                  key={a.idAttribute}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-text">{a.code}</td>
                  <td className="px-4 py-3 text-text text-opacity-80">
                    {a.attributeName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary">
                      {a.dataType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{renderOptions(a.options)}</td>
                  <td className="px-4 py-3 text-xs text-text text-opacity-60">
                    {a.validationRegex || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-label="Xóa"
                      disabled={deleteAttribute.isPending}
                      onClick={() =>
                        handleDelete(a.idAttribute, a.attributeName)
                      }
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
