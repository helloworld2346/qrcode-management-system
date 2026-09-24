import type { TooltipProps } from "recharts";

interface Props extends TooltipProps<number, string> {
  unit?: string;
}

export function ChartTooltip({ active, payload, label, unit }: Props) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const color = (item.payload?.fill as string) || (item.color as string);

  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lg">
      {label ? (
        <p className="mb-1 text-xs font-medium text-text text-opacity-60">
          {label}
        </p>
      ) : null}
      <div className="flex items-center">
        <span
          className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="mr-2 text-sm text-text text-opacity-70">
          {item.name}
        </span>
        <span className="text-sm font-bold text-text">
          {item.value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
    </div>
  );
}
