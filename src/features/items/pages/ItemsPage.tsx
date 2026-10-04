import { useMemo, useState, type FormEvent } from "react";
import { FiPlus, FiTrash2, FiX, FiPrinter } from "react-icons/fi";

import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { useAttributes } from "@/features/attributes/attributes.hooks";
import { useCategories } from "@/features/categories/categories.hooks";
import { AttributeValueField } from "@/features/items/components/AttributeValueField";
import {
  useCreateItem,
  useDeleteItem,
  useItemQr,
  useItems,
} from "@/features/items/items.hooks";
import { itemStatusColor, itemStatusLabel } from "@/features/items/items.types";
import { usePagination } from "@/hooks/usePagination";

export function ItemsPage() {
  const { data: items, isLoading, isError, error, refetch } = useItems();
  const { data: categories } = useCategories();
  const { data: attributes } = useAttributes();
  const createItem = useCreateItem();
  const deleteItem = useDeleteItem();
  const itemQr = useItemQr();

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [attrValues, setAttrValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.idCategory === categoryId),
    [categories, categoryId],
  );

  const categoryOptions = useMemo(
    () =>
      (categories ?? []).map((c) => ({
        value: c.idCategory,
        label: c.categoryName,
      })),
    [categories],
  );

  /** Map attributeId -> master Attribute để lấy dataType/options */
  const masterById = useMemo(() => {
    const map: Record<
      string,
      typeof attributes extends (infer T)[] | undefined ? T : never
    > = {};
    (attributes ?? []).forEach((a) => {
      map[a.idAttribute] = a;
    });
    return map;
  }, [attributes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items ?? [];
    return (items ?? []).filter(
      (i) =>
        i.itemName.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q),
    );
  }, [items, query]);

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    pageItems,
    totalItems,
  } = usePagination(filtered, 10);

  const resetForm = () => {
    setItemName("");
    setDescription("");
    setCategoryId("");
    setAttrValues({});
    setFormError("");
    setShowForm(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setFormError("Vui lòng nhập tên đồ vật");
      return;
    }
    if (!categoryId) {
      setFormError("Vui lòng chọn danh mục");
      return;
    }
    const missing = (selectedCategory?.attributes ?? []).find(
      (a) => a.required && !attrValues[a.attributeId]?.trim(),
    );
    if (missing) {
      setFormError(`Vui lòng nhập "${missing.attributeName}"`);
      return;
    }
    createItem.mutate(
      {
        itemName: itemName.trim(),
        description: description.trim(),
        categoryId,
        attributeValues: attrValues,
      },
      { onSuccess: resetForm },
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-2 md:mb-0">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Đồ vật
          </h1>
          <p className="mt-0.5 text-sm text-text text-opacity-60">
            Quản lý đồ vật và mã QR
          </p>
        </div>
        <div className="flex items-center">
          <div className="mr-3 w-64">
            <SearchInput
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="Tìm theo tên hoặc mã..."
            />
          </div>
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {showForm ? (
              <FiX className="mr-2" size={16} />
            ) : (
              <FiPlus className="mr-2" size={16} />
            )}
            {showForm ? "Đóng" : "Thêm đồ vật"}
          </button>
        </div>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4"
        >
          <div className="-mx-2 flex flex-wrap">
            <div className="mb-3 w-full px-2 md:w-1/3">
              <FormField label="Tên đồ vật" required>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="VD: Bàn làm việc"
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/3">
              <FormField label="Danh mục" required>
                <FormSelect
                  value={categoryId}
                  options={categoryOptions}
                  onChange={(v) => {
                    setCategoryId(v);
                    setAttrValues({});
                  }}
                  placeholder="-- Chọn danh mục --"
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/3">
              <FormField label="Mô tả">
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả ngắn"
                />
              </FormField>
            </div>

            {(selectedCategory?.attributes ?? []).map((a) => (
              <div
                key={a.idCategoryAttribute}
                className="mb-3 w-full px-2 md:w-1/3"
              >
                <FormField label={a.attributeName} required={a.required}>
                  <AttributeValueField
                    attribute={a}
                    master={masterById[a.attributeId]}
                    value={attrValues[a.attributeId] ?? a.defaultValue ?? ""}
                    onChange={(v) =>
                      setAttrValues((prev) => ({
                        ...prev,
                        [a.attributeId]: v,
                      }))
                    }
                  />
                </FormField>
              </div>
            ))}
          </div>

          {formError ? (
            <p className="mb-3 text-sm text-accent">{formError}</p>
          ) : null}
          {createItem.isError ? (
            <p className="mb-3 text-sm text-accent">
              {(createItem.error as Error).message}
            </p>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="mr-3 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createItem.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {createItem.isPending ? "Đang lưu..." : "Tạo đồ vật"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-sm text-text text-opacity-60">
            Đang tải...
          </p>
        ) : isError ? (
          <div className="px-5 py-10 text-center">
            <p className="mb-3 text-sm text-accent">
              {(error as Error)?.message ?? "Không tải được dữ liệu"}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text transition-colors hover:border-primary hover:text-primary"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text text-opacity-60">
                <th className="px-5 py-3 font-medium">Mã</th>
                <th className="px-5 py-3 font-medium">Tên đồ vật</th>
                <th className="px-5 py-3 font-medium">Danh mục</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Đã in</th>
                <th className="px-5 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-text text-opacity-60"
                  >
                    Chưa có đồ vật nào.
                  </td>
                </tr>
              ) : (
                pageItems.map((i) => (
                  <tr
                    key={i.idItem}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-3 font-medium text-text">
                      {i.code}
                    </td>
                    <td className="px-5 py-3 text-text">{i.itemName}</td>
                    <td className="px-5 py-3 text-text text-opacity-70">
                      {categories?.find((c) => c.idCategory === i.categoryId)
                        ?.categoryName ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          color: itemStatusColor(i.status),
                          backgroundColor: `${itemStatusColor(i.status)}1a`,
                        }}
                      >
                        <span
                          className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: itemStatusColor(i.status) }}
                        />
                        {itemStatusLabel(i.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text text-opacity-70">
                      {i.printed ? "Đã in" : "Chưa in"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center">
                        <button
                          type="button"
                          aria-label="Tải QR"
                          disabled={itemQr.isPending}
                          onClick={() =>
                            itemQr.mutate({ id: i.idItem, code: i.code })
                          }
                          className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary disabled:opacity-50"
                        >
                          <FiPrinter size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Xóa"
                          disabled={deleteItem.isPending}
                          onClick={() => {
                            if (window.confirm(`Xóa đồ vật "${i.itemName}"?`)) {
                              deleteItem.mutate(i.idItem);
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-accent hover:bg-opacity-10 hover:text-accent disabled:opacity-50"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : null}
      </div>

      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
