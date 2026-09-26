import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { qrAssignment } from "@/features/dashboard/data/mock";
import { useChartColors } from "@/features/dashboard/hooks/useChartColors";

export function QrGaugeCard() {
  const { series, track } = useChartColors();
  const assigned = qrAssignment.assigned;
  const total = qrAssignment.total;
  const unassigned = Math.max(total - assigned, 0);
  const percent = Math.round((assigned / total) * 100);

  const data = [
    { name: "Đã gán", value: assigned, fill: series[1] },
    { name: "Chưa gán", value: unassigned, fill: track },
  ];

  return (
    <div className="relative mb-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-text">
        Tỉ lệ đã gán QR
      </h2>

      <div className="relative mx-auto h-56 w-full max-w-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="65%"
              startAngle={180}
              endAngle={0}
              innerRadius={75}
              outerRadius={105}
              cornerRadius={6}
              stroke="none"
              paddingAngle={2}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute left-0 right-0 bottom-10 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-text">{percent}%</span>
          <span className="text-xs text-text text-opacity-60">
            {assigned}/{total}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center">
        {data.map((d) => (
          <div key={d.name} className="mx-3 flex items-center">
            <span
              className="mr-2 inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: d.fill }}
            />
            <span className="text-sm text-text text-opacity-70">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
