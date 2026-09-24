import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { statusData } from "@/features/dashboard/data/mock";
import { useChartColors } from "@/features/dashboard/hooks/useChartColors";

export function StatusDonutCard() {
  const { series, tooltipBg } = useChartColors();
  const total = statusData.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-text">
        Phân bổ tình trạng tài sản
      </h2>
      <div className="flex items-center">
        <div className="relative mr-4 h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={2}
                stroke="none"
              >
                {statusData.map((entry, idx) => (
                  <Cell key={entry.name} fill={series[idx % series.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  background: tooltipBg,
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-text">{total}</span>
            <span className="text-xs text-text text-opacity-60">Tổng</span>
          </div>
        </div>

        <div className="flex-1">
          {statusData.map((s, idx) => (
            <div key={s.name} className="mb-3 flex items-center">
              <span
                className="mr-3 inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: series[idx % series.length] }}
              />
              <span className="flex-1 text-sm text-text text-opacity-70">
                {s.name}
              </span>
              <span className="text-sm font-semibold text-text">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
