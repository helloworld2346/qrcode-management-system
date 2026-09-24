import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { scanTrend } from "@/features/dashboard/data/mock";
import { useChartColors } from "@/features/dashboard/hooks/useChartColors";

export function ScanTrendCard() {
  const { primary, axis, track, tooltipBg } = useChartColors();

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text">Lượt quét mã QR</h2>
          <p className="text-xs text-text text-opacity-50">7 ngày gần nhất</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={scanTrend}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="scanFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={primary} stopOpacity={0.3} />
                <stop offset="100%" stopColor={primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={track}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke={axis}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke={axis}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                background: tooltipBg,
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="scans"
              name="Lượt quét"
              stroke={primary}
              strokeWidth={2}
              fill="url(#scanFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
