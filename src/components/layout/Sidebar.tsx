import { FiBox, FiGrid, FiLayers, FiMaximize, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";

interface NavItem {
  to: string;
  label: string;
  icon: typeof FiGrid;
  adminOnly?: boolean;
  end?: boolean;
}

const items: NavItem[] = [
  { to: "/dashboard", label: "Tổng quan", icon: FiGrid, end: true },
  { to: "/dashboard/assets", label: "Tài sản", icon: FiBox },
  { to: "/dashboard/weapons", label: "Vũ khí", icon: FiLayers },
  { to: "/dashboard/scanner", label: "Quét mã", icon: FiMaximize },
  { to: "/dashboard/units", label: "Đơn vị", icon: FiUsers, adminOnly: true },
];

export function Sidebar() {
  const role = useAuthStore((s) => s.user?.role);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `mb-1 flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-white"
        : "text-text text-opacity-70 hover:bg-primary hover:bg-opacity-10 hover:text-opacity-100"
    }`;

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-border bg-surface no-print lg:flex">
      <div className="flex h-20 items-center border-b border-border px-6">
        <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-lg font-bold text-white">
          Q
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-text">QUẢN LÝ QR</span>
          <span className="text-xs text-text text-opacity-50">SƯ ĐOÀN 5</span>
        </div>
      </div>

      <nav className="flex flex-col p-4">
        {items
          .filter((it) => !it.adminOnly || role === "admin")
          .map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="mr-3" size={18} />
              {label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
