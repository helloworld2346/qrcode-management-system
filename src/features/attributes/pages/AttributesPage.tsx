import { useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
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
  type DataType,
} from "@/features/attributes/attributes.types";
import { errorMessage } from "@/types/api.types";

const dataTypeOptions = DATA_TYPES.map((t) => ({ value: t, label: t }));

const REGEX_PRESETS = [
  { value: "", label: "Không kiểm tra" },
  { value: "^[A-Za-z0-9-]+$", label: "Chỉ chữ và số (không dấu, cho phép gạch)" },
  { value: "^[0-9]+$", label: "Chỉ số" },
  { value: "^[A-Z0-9-]+$", label: "Số seri (IN HOA + số + gạch)" },
  { value: "^\\d{4}$", label: "Năm 4 chữ số" },
  { value: "^\\d{2}/\\d{2}/\\d{4}$", label: "Ngày dd/mm/yyyy" },
  { value: "^0\\d{9,10}$", label: "Số điện thoại (0 + 9-10 số)" },
  { value: "__custom__", label: "Tự nhập regex..." },
];

const regexOptions = REGEX_PRESETS.map((p) => ({
  value: p.value,
  label: p.label,
}));

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export function AttributesPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [dataType, setDataType] = useState<DataType>("TEXT");
  const [description, setDescription] = useState("");
  const [optionsInput, setOptionsInput] = useState("");
  const [regexPreset, setRegexPreset] = useState("");
  const [regex, setRegex] = useState("");
  const isCustomRegex = regexPreset === "__custom__";
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteErr, setDeleteErr] = useState("");

  const { data: attributes, isLoading, isError, error } = useAttributes();
  const createAttribute = useCreateAttribute();
  const deleteAttribute = useDeleteAttribute();

  const needsOptions = OPTION_TYPES.includes(dataType);
  const needsRegex = dataType === "TEXT";

  const parsedOptions = useMemo(() => {
    if (!needsOptions) return undefined;
    const items = optionsInput.split(",").map((s) => s.trim()).filter(Boolean);
    return items.length ? items : undefined;
  }, [needsOptions, optionsInput]);

  const handleCreate = () => {
    setFormError("");
    const trimmedName = name.trim();
    const trimmedCode = (codeTouched ? code : slugify(trimmedName)).trim();
    if (!trimmedName || !trimmedCode) {
      setFormError("Vui lòng nhập tên và mã thuộc tính.");
      return;
    }
    if (needsOptions && !parsedOptions) {
      setFormError("Kiểu SELECT / MULTI_SELECT cần ít nhất 1 option.");
      return;
    }
    createAttribute.mutate(
      {
        code: trimmedCode,
        name: trimmedName,
        data_type: dataType,
        description: description.trim() || undefined,
        validation_regex:
          (isCustomRegex ? regex.trim() : regexPreset) || undefined,
        options: parsedOptions,
      },
      {
        onSuccess: () => {
          setName("");
          setCode("");
          setCodeTouched(false);
          setDataType("TEXT");
          setDescription("");
          setOptionsInput("");
          setRegexPreset("");
          setRegex("");
        },
        onError: (e) => setFormError(errorMessage(e)),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleteErr("");
    deleteAttribute.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (e) => {
        const msg = errorMessage(e);
        setDeleteErr(
          msg.includes("used by categories")
            ? "Thuộc tính đang được dùng trong danh mục — gỡ khỏi danh mục trước."
            : msg,
        );
      },
    });
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-text">Thuộc tính</h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Kho thuộc tính tái sử dụng cho các danh mục.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text text-opacity-60">
          Thêm thuộc tính
        </h2>
        <div className="flex flex-wrap">
          <div className="mb-3 w-full pr-0 sm:w-1/2 sm:pr-2 lg:w-1/4">
            <FormField label="Tên thuộc tính" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Chủng loại"
              />
            </FormField>
          </div>
          <div className="mb-3 w-full pl-0 sm:w-1/2 sm:pl-2 lg:w-1/4">
            <FormField label="Mã (code)" required>
              <Input
                value={codeTouched ? code : slugify(name)}
                onChange={(e) => {
                  setCodeTouched(true);
                  setCode(e.target.value);
                }}
                placeholder="chung_loai"
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
          <div className="mb-3 w-full lg:w-1/4">
            <FormField label="Mô tả">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn"
              />
            </FormField>
          </div>

          {needsOptions && (
            <div className="mb-3 w-full">
              <FormField label="Options (phân tách bởi dấu phẩy)" required>
                <Input
                  value={optionsInput}
                  onChange={(e) => setOptionsInput(e.target.value)}
                  placeholder="Súng ngắn, Súng trường, Súng máy"
                />
              </FormField>
            </div>
          )}
          {needsRegex && (
            <div className="mb-3 w-full sm:w-1/2">
              <FormField label="Kiểm tra định dạng (tùy chọn)">
                <FormSelect
                  value={regexPreset}
                  options={regexOptions}
                  onChange={setRegexPreset}
                />
              </FormField>
            </div>
          )}
          {needsRegex && isCustomRegex && (
            <div className="mb-3 w-full sm:w-1/2">
              <FormField label="Regex tự nhập" required>
                <Input
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder="^[A-Z0-9-]+$"
                />
              </FormField>
            </div>
          )}
        </div>

        {formError && <p className="mb-2 text-xs text-accent">{formError}</p>}

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
                <td colSpan={6} className="px-4 py-8 text-center text-text text-opacity-60">
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-accent">
                  {(error as Error).message}
                </td>
              </tr>
            ) : !attributes || attributes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text text-opacity-60">
                  Chưa có thuộc tính nào.
                </td>
              </tr>
            ) : (
              attributes.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-medium text-text">{a.code}</td>
                  <td className="px-4 py-3 text-text text-opacity-80">{a.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary">
                      {a.data_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {a.options?.length
                      ? a.options.map((o) => (
                          <span
                            key={o}
                            className="mb-1 mr-1 inline-block rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {o}
                          </span>
                        ))
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-text text-opacity-60">
                    {a.validation_regex || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-label="Xóa"
                      disabled={deleteAttribute.isPending}
                      onClick={() => setDeleteTarget({ id: a.id, name: a.name })}
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa thuộc tính"
        message={deleteTarget ? `Xóa thuộc tính "${deleteTarget.name}"?` : ""}
        confirmLabel="Xóa"
        loading={deleteAttribute.isPending}
        error={deleteErr}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
