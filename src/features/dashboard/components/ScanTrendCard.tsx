import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
          <BarChart
            data={scanTrend}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
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
              cursor={{ fill: `${series[0]}14` }}
              content={<ChartTooltip />}
            />
            <Bar dataKey="scans" name="Lượt quét" radius={[6, 6, 0, 0]}>
              {scanTrend.map((entry, idx) => (
                <Cell key={entry.day} fill={series[idx % series.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
