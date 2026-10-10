import { useState, type FormEvent } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
} from "@/features/accounts/accounts.hooks";
import type { Account } from "@/features/accounts/accounts.types";

export function AccountsPage() {
  const { data: accounts = [], isLoading, isError, error } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();

  const [formOpen, setFormOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const resetForm = () => {
    setAccountName("");
    setUserName("");
    setPassword("");
    setRole("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    createAccount.mutate(
      {
        accountName: accountName.trim(),
        userName: userName.trim(),
        password,
        role: role.trim(),
      },
      {
        onSuccess: () => {
          resetForm();
          setFormOpen(false);
        },
      },
    );
  };

  const onDelete = (a: Account) => {
    if (window.confirm(`Xóa tài khoản "${a.userName}"?`)) {
      deleteAccount.mutate(a.idAccount);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-3 md:mb-0">
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Tài khoản
          </h1>
          <p className="mt-1 text-sm text-text text-opacity-60">
            {accounts.length} tài khoản trong hệ thống
          </p>
        </div>
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

      {formOpen ? (
        <form
          onSubmit={onSubmit}
          className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4"
        >
          <h2 className="mb-3 text-base font-semibold text-text">
            Tài khoản mới
          </h2>
          <div className="-mx-2 flex flex-wrap">
            <div className="mb-3 w-full px-2 md:w-1/2">
              <FormField label="Tên tài khoản" required>
                <Input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </FormField>
            </div>
            <div className="mb-3 w-full px-2 md:w-1/2">
              <FormField label="Tên đăng nhập" required>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="nguyenvana"
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
            <div className="mb-3 w-full px-2 md:w-1/2">
              <FormField label="Vai trò (ID role)" required>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="idRole"
                  required
                />
              </FormField>
            </div>
          </div>
          {createAccount.isError ? (
            <p className="mb-3 text-xs text-accent">
              {createAccount.error instanceof Error
                ? createAccount.error.message
                : "Tạo tài khoản thất bại"}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={createAccount.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {createAccount.isPending ? "Đang lưu..." : "Tạo tài khoản"}
          </button>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Tên tài khoản
              </th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Tên đăng nhập
              </th>
              <th className="px-4 py-3 font-medium text-text text-opacity-60">
                Vai trò
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-text text-opacity-50"
                >
                  Đang tải...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-accent">
                  {error instanceof Error
                    ? error.message
                    : "Không tải được dữ liệu"}
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-text text-opacity-50"
                >
                  Chưa có tài khoản nào
                </td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr
                  key={a.idAccount}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-text">
                    {a.accountName}
                  </td>
                  <td className="px-4 py-3 text-text text-opacity-70">
                    {a.userName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary bg-opacity-10 px-2.5 py-1 text-xs font-medium text-primary">
                      {a.roleEntity?.roleName ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label="Xóa"
                      onClick={() => onDelete(a)}
                      disabled={deleteAccount.isPending}
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
