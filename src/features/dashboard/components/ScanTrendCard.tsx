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
import { ChartTooltip } from "./ChartTooltip";

export function ScanTrendCard() {
  const { series, axis, track } = useChartColors();

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm"
      style={{
        backgroundImage: `linear-gradient(135deg, ${series[0]}14 0%, ${series[1]}0a 55%, transparent 100%)`,
      }}
    >
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
              <linearGradient id="scanArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={series[0]} stopOpacity={0.4} />
                <stop offset="100%" stopColor={series[0]} stopOpacity={0} />
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
              cursor={{ stroke: series[0], strokeWidth: 1 }}
              content={<ChartTooltip />}
            />
            <Area
              type="monotone"
              dataKey="scans"
              name="Lượt quét"
              stroke={series[0]}
              strokeWidth={2.5}
              fill="url(#scanArea)"
              dot={{ r: 3, fill: series[0], strokeWidth: 0 }}
              activeDot={{ r: 5, fill: series[0], strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
