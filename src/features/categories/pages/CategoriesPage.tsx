import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/categories/categories.hooks";

export function CategoriesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories, isLoading, isError, error } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = () => {
    const categoryName = name.trim();
    if (!categoryName) return;
    createCategory.mutate(
      { categoryName, description: description.trim() },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
        },
      },
    );
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-center">
          <div className="mr-auto">
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Danh mục
            </h1>
            <p className="mt-1 text-sm text-text text-opacity-60">
              Quản lý loại tài sản và bộ thuộc tính.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-end">
          <div className="mb-3 mr-3 w-full sm:mb-0 sm:w-64">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên danh mục"
            />
          </div>
          <div className="mb-3 mr-3 w-full sm:mb-0 sm:w-80">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả"
            />
          </div>
          <Button
            type="button"
            className="flex items-center rounded-lg"
            disabled={!name.trim() || createCategory.isPending}
            onClick={handleCreate}
          >
            <FiPlus className="mr-2" size={15} />
            Thêm danh mục
          </Button>
        </div>
        {createCategory.isError ? (
          <p className="mt-2 text-xs text-accent">
            {createCategory.error.message}
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text text-opacity-60">
              <th className="px-4 py-3 font-medium">Tên danh mục</th>
              <th className="px-4 py-3 font-medium">Mô tả</th>
              <th className="px-4 py-3 font-medium">Thuộc tính</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-accent">
                  {error.message}
                </td>
              </tr>
            ) : !categories || categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  Chưa có danh mục nào.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr
                  key={c.idCategory}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-text">
                    {c.categoryName}
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-80">
                    {c.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary">
                      {c.attributes?.length ?? 0} thuộc tính
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-label="Xóa"
                      disabled={deleteCategory.isPending}
                      onClick={() => deleteCategory.mutate(c.idCategory)}
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
