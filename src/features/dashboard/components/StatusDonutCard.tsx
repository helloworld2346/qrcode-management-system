import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { statusData } from "@/features/dashboard/data/mock";
import { useChartColors } from "@/features/dashboard/hooks/useChartColors";

import { ChartTooltip } from "./ChartTooltip";

export function StatusDonutCard() {
  const { series } = useChartColors();
  const total = statusData.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="relative mb-6 rounded-2xl p-5">
      <h2 className="mb-4 text-base font-semibold text-text">
        Phân bổ tình trạng tài sản
      </h2>

      <div className="relative mx-auto h-56 w-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={64}
              outerRadius={90}
              paddingAngle={3}
              cornerRadius={8}
              stroke="none"
            >
              {statusData.map((entry, idx) => (
                <Cell key={entry.name} fill={series[idx % series.length]} />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltip />}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 20 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center">
          <span className="text-xs text-text text-opacity-60">Tổng cộng</span>
          <span className="text-3xl font-bold text-text">{total}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center">
        {statusData.map((s, idx) => {
          const color = series[idx % series.length];
          return (
            <div key={s.name} className="mb-2 mr-4 flex items-center">
              <span
                className="mr-2 inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-text text-opacity-70">
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
