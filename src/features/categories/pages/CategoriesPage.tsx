import { useState } from "react";
import { FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/categories/categories.hooks";
import { errorMessage } from "@/types/api.types";

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);

export function CategoriesPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [err, setErr] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteErr, setDeleteErr] = useState("");

  const { data: categories, isLoading, isError, error } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = () => {
    setErr("");
    const n = name.trim();
    const c = (codeTouched ? code : slugify(n)).trim();
    if (!n || !c) return;
    createCategory.mutate(
      { name: n, code: c },
      {
        onSuccess: () => {
          setName("");
          setCode("");
          setCodeTouched(false);
        },
        onError: (e) => setErr(errorMessage(e)),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleteErr("");
    deleteCategory.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (e) => {
        const msg = errorMessage(e);
        setDeleteErr(
          msg.includes("still has assets")
            ? "Danh mục vẫn còn tài sản — chuyển hoặc xóa tài sản trước."
            : msg,
        );
      },
    });
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-text">Danh mục</h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Quản lý loại tài sản và bộ thuộc tính.
        </p>
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
          <div className="mb-3 mr-3 w-full sm:mb-0 sm:w-48">
            <Input
              value={codeTouched ? code : slugify(name)}
              onChange={(e) => {
                setCodeTouched(true);
                setCode(e.target.value);
              }}
              placeholder="Mã (VD: VK)"
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
        {err && <p className="mt-2 text-xs text-accent">{err}</p>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text text-opacity-60">
              <th className="px-4 py-3 font-medium">Mã</th>
              <th className="px-4 py-3 font-medium">Tên danh mục</th>
              <th className="px-4 py-3 font-medium">Thuộc tính</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text text-opacity-60">
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-accent">
                  {(error as Error).message}
                </td>
              </tr>
            ) : !categories || categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text text-opacity-60">
                  Chưa có danh mục nào.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-medium text-text">{c.code}</td>
                  <td className="px-4 py-3 text-text text-opacity-80">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2 py-0.5 text-xs font-medium text-primary">
                      {c.attributes?.length ?? 0} thuộc tính
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Link
                        to={`/dashboard/categories/${c.id}`}
                        aria-label="Xem"
                        className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                      >
                        <FiEye size={15} />
                      </Link>
                      <button
                        type="button"
                        aria-label="Xóa"
                        disabled={deleteCategory.isPending}
                        onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                        className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-accent hover:bg-opacity-10 hover:text-accent disabled:opacity-50"
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
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa danh mục"
        message={deleteTarget ? `Xóa danh mục "${deleteTarget.name}"?` : ""}
        confirmLabel="Xóa"
        loading={deleteCategory.isPending}
        error={deleteErr}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
