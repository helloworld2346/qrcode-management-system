import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { FiKey, FiLock, FiPlus, FiUnlock, FiX } from "react-icons/fi";

import { FormField } from "@/components/ui/FormField";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import {
  useAccounts,
  useCreateAccount,
  useLockAccount,
  useResetPassword,
  useUnlockAccount,
} from "@/features/accounts/accounts.hooks";
import type { Account } from "@/features/accounts/accounts.types";
import { departmentsApi } from "@/features/departments/departments.api";
import { pickData, errorMessage } from "@/types/api.types";

export function AccountsPage() {
  const { data: accounts = [], isLoading, isError, error } = useAccounts();
  const createAccount = useCreateAccount();
  const lockMut = useLockAccount();
  const unlockMut = useUnlockAccount();
  const resetMut = useResetPassword();

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => pickData(await departmentsApi.list(1, 100))?.items ?? [],
  });

  const [formOpen, setFormOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [departmentId, setDepartmentId] = useState("");
  const [err, setErr] = useState("");

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setPassword("");
    setRole("user");
    setDepartmentId("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (role === "user" && !departmentId) {
      setErr("Vui lòng chọn đơn vị cho tài khoản user.");
      return;
    }
    createAccount.mutate(
      {
        username: username.trim(),
        full_name: fullName.trim(),
        password,
        role,
        department_id: departmentId || undefined,
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

  const toggleLock = (a: Account) => {
    if (a.is_locked) unlockMut.mutate(a.id);
    else lockMut.mutate(a.id);
  };

  const onResetPassword = (a: Account) => {
    const pw = window.prompt(`Mật khẩu mới cho "${a.username}":`);
    if (pw && pw.length >= 6) {
      resetMut.mutate({ id: a.id, newPassword: pw });
    } else if (pw !== null) {
      window.alert("Mật khẩu phải có ít nhất 6 ký tự.");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-3 md:mb-0">
          <h1 className="text-2xl font-bold tracking-tight text-text">Tài khoản</h1>
          <p className="mt-1 text-sm text-text text-opacity-60">
            {accounts.length} tài khoản trong hệ thống
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {formOpen ? <FiX className="mr-2" size={16} /> : <FiPlus className="mr-2" size={16} />}
          {formOpen ? "Đóng" : "Thêm tài khoản"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={onSubmit}
          className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4"
        >
          <h2 className="mb-3 text-base font-semibold text-text">Tài khoản mới</h2>
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
                  onChange={(v) => setRole(v as "admin" | "user")}
                  options={[
                    { value: "user", label: "User (theo đơn vị)" },
                    { value: "admin", label: "Admin" },
                  ]}
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/4">
              <FormField label="Đơn vị" required={role === "user"}>
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
              <th className="px-4 py-3 font-medium text-text text-opacity-60">Tên đăng nhập</th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">Họ tên</th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">Vai trò</th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">Đơn vị</th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text text-opacity-50">
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-accent">
                  {error instanceof Error ? error.message : "Không tải được dữ liệu"}
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text text-opacity-50">
                  Chưa có tài khoản nào
                </td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-medium text-text">{a.username}</td>
                  <td className="px-4 py-3 text-text text-opacity-70">{a.full_name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary bg-opacity-10 px-2.5 py-1 text-xs font-medium text-primary">
                      {a.role}
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
                        onClick={() => onResetPassword(a)}
                        disabled={resetMut.isPending}
                        className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary disabled:opacity-50"
                      >
                        <FiKey size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={a.is_locked ? "Mở khóa" : "Khóa"}
                        title={a.is_locked ? "Mở khóa" : "Khóa"}
                        onClick={() => toggleLock(a)}
                        disabled={lockMut.isPending || unlockMut.isPending}
                        className="mx-1 flex h-8 w-8 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-accent hover:bg-opacity-10 hover:text-accent disabled:opacity-50"
                      >
                        {a.is_locked ? <FiUnlock size={15} /> : <FiLock size={15} />}
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
