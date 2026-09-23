import { useState } from "react";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";

export function UserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full border border-border bg-bg px-2 py-1 transition-colors hover:border-primary"
      >
        <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          <FiUser size={16} />
        </span>
        <span className="mr-1 text-sm font-medium text-text">
          {user?.username ?? "Người dùng"}
        </span>
        <FiChevronDown className="text-text text-opacity-60" size={16} />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-border bg-surface py-2 shadow-lg">
          <div className="border-b border-border px-4 pb-2">
            <p className="text-sm font-semibold text-text">{user?.username}</p>
            <p className="text-xs text-text text-opacity-50">
              {user?.role === "admin" ? "Quản trị viên" : "Đơn vị"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:bg-opacity-10"
          >
            <FiLogOut className="mr-2" size={16} />
            Đăng xuất
          </button>
        </div>
      ) : null}
    </div>
  );
}
