import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAlertTriangle,
  FiBox,
  FiCrosshair,
} from "react-icons/fi";

import { useDashboardStats } from "@/features/dashboard/dashboard.hooks";
import { useChartColors } from "@/features/dashboard/hooks/useChartColors";

interface StatItem {
  label: string;
  value: string;
  icon: IconType;
  hint: string;
}

export function StatCards() {
  const { series } = useChartColors();
  const { data } = useDashboardStats();

  const stats: StatItem[] = [
    {
      label: "Tổng tài sản",
      value: String(data?.total ?? "—"),
      icon: FiBox,
      hint: "Toàn đơn vị",
    },
    {
      label: "Đang sử dụng",
      value: String(data?.in_use ?? "—"),
      icon: FiCrosshair,
      hint: "Toàn đơn vị",
    },
    {
      label: "Đã quét hôm nay",
      value: String(data?.scanned_today ?? "—"),
      icon: FiActivity,
      hint: "24 giờ",
    },
    {
      label: "Cần chú ý",
      value: String(data?.attention ?? "—"),
      icon: FiAlertTriangle,
      hint: "Hỏng + chờ thanh lý",
    },
  ];

  return (
    <div className="-mx-2 mb-8 flex flex-wrap">
      {stats.map(({ label, value, icon: Icon, hint }, idx) => {
        const color = series[idx % series.length];
        return (
          <div key={label} className="mb-4 w-full px-2 sm:w-1/2 lg:w-1/4">
            <div
              className="relative overflow-hidden rounded-2xl border border-border p-5"
              style={{
                backgroundImage: `linear-gradient(135deg, ${color}1f 0%, ${color}08 60%, transparent 100%)`,
              }}
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-text text-opacity-60">
                  {label}
                </p>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    color,
                    backgroundColor: `${color}12`,
                    boxShadow: `inset 0 0 0 1.5px ${color}66`,
                  }}
                >
                  <Icon size={20} />
                </span>
              </div>

              <p className="mt-4 text-4xl font-bold leading-none text-text">
                {value}
              </p>

              <div className="mt-3 flex items-end justify-between">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  {hint}
                </span>
                <div className="flex h-8 items-end">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <span
                      key={i}
                      className="mr-0.5 w-1 rounded-full"
                      style={{
                        height: `${h}%`,
                        backgroundColor: color,
                        opacity: 0.25 + (i / 7) * 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
