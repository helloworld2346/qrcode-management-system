import {
  FiBox,
  FiCheckCircle,
  FiPlusCircle,
  FiMaximize,
  FiPrinter,
  FiTool,
  FiTrendingUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";

const stats = [
  { label: "Tổng tài sản", value: "0", icon: FiBox, hint: "Toàn đơn vị" },
  { label: "Đang sử dụng", value: "0", icon: FiCheckCircle, hint: "Khả dụng" },
  { label: "Bảo trì", value: "0", icon: FiTool, hint: "Cần xử lý" },
  { label: "Đã quét hôm nay", value: "0", icon: FiTrendingUp, hint: "24 giờ" },
];

const actions = [
  { to: "/dashboard/assets/create", label: "Thêm tài sản", icon: FiPlusCircle },
  { to: "/dashboard/scanner", label: "Quét mã QR", icon: FiMaximize },
  { to: "/dashboard/assets/print-queue", label: "In tem QR", icon: FiPrinter },
];

export function DashboardPage() {
  const username = useAuthStore((s) => s.user?.username);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">
          Xin chào, {username ?? "bạn"}
        </h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Tổng quan hoạt động quản lý mã QR của đơn vị.
        </p>
      </div>

      {/* Stat cards — negative margin thay cho gap */}
      <div className="-mx-2 mb-8 flex flex-wrap">
        {stats.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="mb-4 w-full px-2 sm:w-1/2 lg:w-1/4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white">
                <Icon size={20} />
              </span>
              <p className="text-sm text-text text-opacity-60">{label}</p>
              <p className="mt-1 text-3xl font-bold text-text">{value}</p>
              <p className="mt-1 text-xs text-text text-opacity-40">{hint}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mb-3 text-lg font-semibold text-text">Thao tác nhanh</h2>
      <div className="-mx-2 mb-8 flex flex-wrap">
        {actions.map(({ to, label, icon: Icon }) => (
          <div key={to} className="mb-4 w-full px-2 sm:w-1/2 lg:w-1/3">
            <Link
              to={to}
              className="flex items-center rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary bg-opacity-10 text-primary">
                <Icon size={22} />
              </span>
              <span className="font-medium text-text">{label}</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent activity (placeholder — trạng thái Empty) */}
      <h2 className="mb-3 text-lg font-semibold text-text">
        Hoạt động gần đây
      </h2>
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <p className="text-sm text-text text-opacity-50">
          Chưa có hoạt động nào được ghi nhận.
        </p>
      </div>
    </div>
  );
}
