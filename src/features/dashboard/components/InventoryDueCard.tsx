import { inventoryDue } from "@/features/dashboard/data/mock";
import { useChartColors } from "@/features/dashboard/hooks/useChartColors";

function severityColor(days: number, series: string[]): string {
  if (days >= 10) return series[3];
  if (days >= 5) return series[2];
  return series[1];
}

export function InventoryDueCard() {
  const { series } = useChartColors();

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-text">
        Cần kiểm kê / quá hạn
      </h2>

      {inventoryDue.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-text text-opacity-50">
            Không có tài sản nào quá hạn kiểm kê.
          </p>
        </div>
      ) : (
        <div>
          {inventoryDue.map((item) => {
            const color = severityColor(item.overdueDays, series);
            return (
              <div
                key={item.code}
                className="relative mb-3 flex items-center overflow-hidden rounded-xl border border-border p-3 pl-4"
              >
                <span
                  className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">{item.name}</p>
                  <p className="text-xs text-text text-opacity-50">
                    {item.code} · {item.unit}
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  Quá hạn {item.overdueDays} ngày
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
