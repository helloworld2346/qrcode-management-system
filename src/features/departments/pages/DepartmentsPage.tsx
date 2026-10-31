import { useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { type Department } from "@/features/departments/departments.api";
import {
  useDepartments,
  useDeleteDepartment,
  useSaveDepartment,
} from "@/features/departments/departments.hooks";
import { errorMessage } from "@/utils/errorMessages";

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);

export function DepartmentsPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [deleteErr, setDeleteErr] = useState("");
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useDepartments({
    q: query || undefined,
    page,
    size: pageSize,
  });

  const departments = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleQuery = (v: string) => {
    setQuery(v);
    setPage(1);
  };

  const saveMut = useSaveDepartment(editing?.id);
  const delMut = useDeleteDepartment();

  const handleSave = () => {
    setErr("");
    const n = name.trim();
    const c = (codeTouched || editing ? code : slugify(n)).trim().toUpperCase();
    if (!n || !c) return;
    saveMut.mutate(
      { name: n, code: c },
      {
        onSuccess: () => {
          setName("");
          setCode("");
          setCodeTouched(false);
          setEditing(null);
        },
        onError: (e) => setErr(errorMessage(e)),
      },
    );
  };

  const startEdit = (d: Department) => {
    setEditing(d);
    setName(d.name);
    setCode(d.code);
    setCodeTouched(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleteErr("");
    delMut.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (e) => setDeleteErr(errorMessage(e)),
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-2 mr-4">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Đơn vị
          </h1>
          <p className="mt-1 text-sm text-text text-opacity-60">
            Quản lý các phòng/ban trong đơn vị — user thường thuộc về một đơn
            vị.
          </p>
        </div>
        <SearchInput
          value={query}
          onChange={handleQuery}
          placeholder="Tìm theo tên hoặc mã..."
          className="mb-2 w-64"
        />
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-end">
          <div className="mb-3 mr-3 w-full sm:mb-0 sm:w-64">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên đơn vị (VD: Ban Thông tin)"
            />
          </div>
          <div className="mb-3 mr-3 w-full sm:mb-0 sm:w-48">
            <Input
              value={codeTouched || editing ? code : slugify(name)}
              onChange={(e) => {
                setCodeTouched(true);
                setCode(e.target.value);
              }}
              placeholder="Mã (VD: ANM)"
            />
          </div>
          <Button
            type="button"
            className="flex items-center rounded-lg"
            disabled={!name.trim() || saveMut.isPending}
            onClick={handleSave}
          >
            {editing ? (
              <FiEdit2 className="mr-2" size={15} />
            ) : (
              <FiPlus className="mr-2" size={15} />
            )}
            {editing ? "Cập nhật" : "Thêm đơn vị"}
          </Button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setName("");
                setCode("");
                setCodeTouched(false);
              }}
              className="ml-3 rounded-lg border border-border px-4 py-2 text-sm text-text hover:border-primary"
            >
              Hủy
            </button>
          )}
        </div>
        {err && <p className="mt-2 text-xs text-accent">{err}</p>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text text-opacity-60">
              <th className="px-4 py-3 font-medium">Mã</th>
              <th className="px-4 py-3 font-medium">Tên đơn vị</th>
              <th className="px-4 py-3 font-medium">Ngày tạo</th>
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
                  {(error as Error).message}
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-text text-opacity-60"
                >
                  {query ? "Không tìm thấy đơn vị nào." : "Chưa có đơn vị nào."}
                </td>
              </tr>
            ) : (
              departments.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-text">{d.code}</td>
                  <td className="px-4 py-3 text-text text-opacity-80">
                    {d.name}
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-60">
                    {new Date(d.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <button
                        type="button"
                        aria-label="Sửa"
                        onClick={() => startEdit(d)}
                        className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa"
                        disabled={delMut.isPending}
                        onClick={() => setDeleteTarget(d)}
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

      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa đơn vị"
        message={deleteTarget ? `Xóa đơn vị "${deleteTarget.name}"?` : ""}
        confirmLabel="Xóa"
        loading={delMut.isPending}
        error={deleteErr}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
