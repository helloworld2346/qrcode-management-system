import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  departmentsApi,
  type Department,
} from "@/features/departments/departments.api";
import { pickData, errorMessage } from "@/types/api.types";

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

export function DepartmentsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [err, setErr] = useState("");

  const { data: departments, isLoading, isError, error } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => pickData(await departmentsApi.list(1, 100))?.items ?? [],
  });

  const saveMut = useMutation({
    mutationFn: async (p: { name: string; code: string }) => {
      const res = editing
        ? await departmentsApi.update(editing.id, p)
        : await departmentsApi.create(p);
      const d = pickData(res);
      if (!res.ok || !d) throw new Error(res.error?.message || "Lưu đơn vị thất bại");
      return d;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      setName("");
      setCode("");
      setCodeTouched(false);
      setEditing(null);
      setErr("");
    },
    onError: (e) => setErr(errorMessage(e)),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await departmentsApi.remove(id);
      if (!res.ok) throw new Error(res.error?.message || "Xóa đơn vị thất bại");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });

  const handleSave = () => {
    setErr("");
    const n = name.trim();
    const c = (codeTouched || editing ? code : slugify(n)).trim().toUpperCase();
    if (!n || !c) return;
    saveMut.mutate({ name: n, code: c });
  };

  const startEdit = (d: Department) => {
    setEditing(d);
    setName(d.name);
    setCode(d.code);
    setCodeTouched(true);
  };

  const handleDelete = (d: Department) => {
    if (window.confirm(`Xóa đơn vị "${d.name}"?`)) delMut.mutate(d.id);
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-text">Đơn vị</h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Quản lý các phòng/ban trong đơn vị — user thường thuộc về một đơn vị.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="flex flex-wrap items-end">
          <div className="mb-3 mr-3 w-full sm:mb-0 sm:w-64">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên đơn vị (VD: Phòng ANM)"
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
            {editing ? <FiEdit2 className="mr-2" size={15} /> : <FiPlus className="mr-2" size={15} />}
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
            ) : !departments || departments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text text-opacity-60">
                  Chưa có đơn vị nào.
                </td>
              </tr>
            ) : (
              departments.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-medium text-text">{d.code}</td>
                  <td className="px-4 py-3 text-text text-opacity-80">{d.name}</td>
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
                        onClick={() => handleDelete(d)}
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
    </div>
  );
}
