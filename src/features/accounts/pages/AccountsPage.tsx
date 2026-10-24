import { useState, type FormEvent } from "react";
import { FiKey, FiLock, FiPlus, FiTrash2, FiUnlock, FiX } from "react-icons/fi";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useLockAccount,
  useResetPassword,
  useUnlockAccount,
} from "@/features/accounts/accounts.hooks";
import type { Account, AccountRole } from "@/features/accounts/accounts.types";
import { useDepartmentOptions } from "@/features/departments/departments.hooks";
import { errorMessage } from "@/types/api.types";

const ROLE_OPTIONS = [
  { value: "viewer", label: "Viewer (chỉ đọc)" },
  { value: "editor", label: "Editor (theo đơn vị)" },
  { value: "admin", label: "Admin (toàn quyền)" },
];

const roleLabel: Record<AccountRole, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export function AccountsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useAccounts({
    q: query || undefined,
    page,
    size: pageSize,
  });
  const accounts = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleQuery = (v: string) => {
    setQuery(v);
    setPage(1);
  };

  const createAccount = useCreateAccount();
  const lockMut = useLockAccount();
  const unlockMut = useUnlockAccount();
  const resetMut = useResetPassword();
  const deleteMut = useDeleteAccount();

  const { data: departments } = useDepartmentOptions();

  const [formOpen, setFormOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<Account | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetErr, setResetErr] = useState("");
  const [lockTarget, setLockTarget] = useState<Account | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [deleteErr, setDeleteErr] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("editor");
  const [departmentId, setDepartmentId] = useState("");
  const [err, setErr] = useState("");

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setPassword("");
    setRole("editor");
    setDepartmentId("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (role !== "admin" && !departmentId) {
      setErr("Vui lòng chọn đơn vị cho tài khoản editor/viewer.");
      return;
    }
    createAccount.mutate(
      {
        username: username.trim(),
        full_name: fullName.trim(),
        password,
        role,
        department_id: role === "admin" ? undefined : departmentId || undefined,
      },
      {
        onSuccess: () => {
          resetForm();
          setFormOpen(false);
        },
        onError: (e2) => setErr(errorMessage(e2)),
      },
    );
  };

  const openReset = (a: Account) => {
    setResetTarget(a);
    setNewPassword("");
    setResetErr("");
  };

  const submitReset = (e: FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    if (newPassword.length < 6) {
      setResetErr("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    resetMut.mutate(
      { id: resetTarget.id, newPassword },
      {
        onSuccess: () => setResetTarget(null),
        onError: (e2) => setResetErr(errorMessage(e2)),
      },
    );
  };

  const submitLock = () => {
    if (!lockTarget) return;
    const done = () => setLockTarget(null);
    if (lockTarget.is_locked)
      unlockMut.mutate(lockTarget.id, { onSettled: done });
    else lockMut.mutate(lockTarget.id, { onSettled: done });
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-3 md:mb-0">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Tài khoản
          </h1>
          <p className="mt-1 text-sm text-text text-opacity-60">
            {total} tài khoản trong hệ thống
          </p>
        </div>
        <div className="flex items-center">
          <SearchInput
            value={query}
            onChange={handleQuery}
            placeholder="Tìm theo tên đăng nhập hoặc họ tên..."
            className="mr-3 w-64"
          />
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {formOpen ? (
              <FiX className="mr-2" size={16} />
            ) : (
              <FiPlus className="mr-2" size={16} />
            )}
            {formOpen ? "Đóng" : "Thêm tài khoản"}
          </button>
        </div>
      </div>

      {formOpen && (
        <form
          onSubmit={onSubmit}
          className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4"
        >
          <h2 className="mb-3 text-base font-semibold text-text">
            Tài khoản mới
          </h2>
          <div className="-mx-2 flex flex-wrap">
            <div className="mb-3 w-full px-2 md:w-1/2">
              <FormField label="Tên đăng nhập" required>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nguyenvana"
                  required
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/2">
              <FormField label="Họ tên" required>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/2">
              <FormField label="Mật khẩu" required>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/4">
              <FormField label="Vai trò" required>
                <FormSelect
                  value={role}
                  onChange={(v) => setRole(v as AccountRole)}
                  options={ROLE_OPTIONS}
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/4">
              <FormField label="Đơn vị" required={role !== "admin"}>
                <FormSelect
                  value={departmentId}
                  onChange={setDepartmentId}
                  placeholder="-- Chọn đơn vị --"
                  options={(departments ?? []).map((d) => ({
                    value: d.id,
                    label: `${d.name} (${d.code})`,
                  }))}
                />
              </FormField>
            </div>
          </div>
          {err && <p className="mb-3 text-xs text-accent">{err}</p>}
          <button
            type="submit"
            disabled={createAccount.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {createAccount.isPending ? "Đang lưu..." : "Tạo tài khoản"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Tên đăng nhập
              </th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Họ tên
              </th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Vai trò
              </th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Đơn vị
              </th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Trạng thái
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text text-opacity-50"
                >
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-accent">
                  {error instanceof Error
                    ? error.message
                    : "Không tải được dữ liệu"}
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text text-opacity-50"
                >
                  {query
                    ? "Không tìm thấy tài khoản nào"
                    : "Chưa có tài khoản nào"}
                </td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-text">
                    {a.username}
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-70">
                    {a.full_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary bg-opacity-10 px-2.5 py-1 text-xs font-medium text-primary">
                      {roleLabel[a.role] ?? a.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-70">
                    {a.department_name ?? a.department_id ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {a.is_locked ? (
                      <span className="rounded-full bg-accent bg-opacity-10 px-2.5 py-1 text-xs font-medium text-accent">
                        Đã khóa
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-500 bg-opacity-10 px-2.5 py-1 text-xs font-medium text-green-600">
                        Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        aria-label="Đặt lại mật khẩu"
                        title="Đặt lại mật khẩu"
                        onClick={() => openReset(a)}
                        disabled={resetMut.isPending}
                        className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary disabled:opacity-50"
                      >
                        <FiKey size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={a.is_locked ? "Mở khóa" : "Khóa"}
                        title={a.is_locked ? "Mở khóa" : "Khóa"}
                        onClick={() => setLockTarget(a)}
                        disabled={lockMut.isPending || unlockMut.isPending}
                        className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-accent hover:bg-opacity-10 hover:text-accent disabled:opacity-50"
                      >
                        {a.is_locked ? (
                          <FiUnlock size={15} />
                        ) : (
                          <FiLock size={15} />
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa tài khoản"
                        title="Xóa tài khoản"
                        onClick={() => {
                          setDeleteErr("");
                          setDeleteTarget(a);
                        }}
                        disabled={deleteMut.isPending}
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

      {resetTarget && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
          onClick={() => setResetTarget(null)}
        >
          <form
            onSubmit={submitReset}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl"
          >
            <h2 className="mb-1 text-base font-semibold text-text">
              Đặt lại mật khẩu
            </h2>
            <p className="mb-4 text-sm text-text text-opacity-60">
              Tài khoản{" "}
              <span className="font-medium text-text">
                {resetTarget.username}
              </span>
            </p>
            <FormField label="Mật khẩu mới" required>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
                required
              />
            </FormField>
            {resetErr && <p className="mt-2 text-xs text-accent">{resetErr}</p>}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                className="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-text text-opacity-70 transition-colors hover:bg-primary hover:bg-opacity-10"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={resetMut.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {resetMut.isPending ? "Đang lưu..." : "Đặt lại"}
              </button>
            </div>
          </form>
        </div>
      )}

      {lockTarget && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
          onClick={() => setLockTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl"
          >
            <h2 className="mb-1 text-base font-semibold text-text">
              {lockTarget.is_locked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
            </h2>
            <p className="mb-4 text-sm text-text text-opacity-60">
              {lockTarget.is_locked
                ? `Mở khóa cho "${lockTarget.username}"?`
                : `Khóa tài khoản "${lockTarget.username}"? Người này sẽ không đăng nhập được.`}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLockTarget(null)}
                className="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-text text-opacity-70 transition-colors hover:bg-primary hover:bg-opacity-10"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={submitLock}
                disabled={lockMut.isPending || unlockMut.isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {lockMut.isPending || unlockMut.isPending
                  ? "Đang xử lý..."
                  : lockTarget.is_locked
                    ? "Mở khóa"
                    : "Khóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa tài khoản"
        message={
          deleteTarget
            ? `Xóa tài khoản "${deleteTarget.username}"? Tài khoản sẽ bị vô hiệu hóa.`
            : ""
        }
        confirmLabel="Xóa"
        loading={deleteMut.isPending}
        error={deleteErr}
        onConfirm={() => {
          if (!deleteTarget) return;
          setDeleteErr("");
          deleteMut.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
            onError: (e) => setDeleteErr(errorMessage(e)),
          });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
