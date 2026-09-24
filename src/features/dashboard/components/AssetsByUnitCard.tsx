import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { assetsByUnit } from "@/features/dashboard/data/mock";
import { useChartColors } from "@/features/dashboard/hooks/useChartColors";

import { ChartTooltip } from "./ChartTooltip";

export function AssetsByUnitCard() {
  const { series } = useChartColors();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-text">
        Tài sản theo đơn vị
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={assetsByUnit}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="unit"
              stroke={series[0]}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={120}
            />
            <Tooltip
              cursor={{ fill: `${series[0]}14` }}
              content={<ChartTooltip />}
            />
            <Bar
              dataKey="value"
              name="Tài sản"
              radius={[0, 6, 6, 0]}
              barSize={18}
            >
              {assetsByUnit.map((entry, idx) => (
                <Cell key={entry.unit} fill={series[idx % series.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
