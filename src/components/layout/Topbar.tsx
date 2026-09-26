import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import logo from "@/assets/images/logo.png";
import { useAuthStore } from "@/store/auth.store";

import { UserMenu } from "./UserMenu";

interface NavItemDef {
  to: string;
  label: string;
  end?: boolean;
  adminOnly?: boolean;
}

const navItems: NavItemDef[] = [
  { to: "/dashboard", label: "Tổng quan", end: true },
  { to: "/dashboard/assets", label: "Tài sản" },
  { to: "/dashboard/weapons", label: "Vũ khí" },
  { to: "/dashboard/scanner", label: "Quét mã" },
  { to: "/dashboard/units", label: "Đơn vị", adminOnly: true },
  { to: "/dashboard/users", label: "Người dùng", adminOnly: true },
  { to: "/dashboard/roles", label: "Vai trò", adminOnly: true },
  { to: "/dashboard/audit-log", label: "Nhật ký", adminOnly: true },
];

export function Topbar() {
  const role = useAuthStore((s) => s.user?.role);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || role === "admin",
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative mx-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-transform duration-150 hover:-translate-y-0.5",
      isActive
        ? "text-primary"
        : "text-text text-opacity-60 hover:text-primary",
    ].join(" ");

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary bg-opacity-10 text-primary"
        : "text-text text-opacity-70 hover:bg-primary hover:bg-opacity-10 hover:text-primary",
    ].join(" ");

  return (
    <header className="relative sticky top-0 z-20 bg-bg no-print">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-8">
        <div className="flex flex-shrink-0 items-center">
          <img
            src={logo}
            alt="SƯ ĐOÀN 5"
            className="mr-2 h-12 w-12 rounded-lg object-cover"
          />
          <span className="whitespace-nowrap text-xl font-bold text-primary">
            SƯ ĐOÀN 5
          </span>
        </div>

        <nav className="mx-4 hidden min-w-0 flex-1 items-center justify-center lg:flex">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 origin-center bg-primary transition-transform duration-300 ease-out ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center">
          <UserMenu />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Mở menu điều hướng"
            aria-expanded={menuOpen}
            className="ml-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-primary hover:text-primary lg:hidden"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="absolute left-0 right-0 top-full z-20 border-t border-border bg-bg px-4 py-2 shadow-lg lg:hidden">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
