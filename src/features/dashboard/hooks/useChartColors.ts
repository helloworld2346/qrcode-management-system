import { useThemeStore } from "@/store/theme.store";

export interface ChartColors {
  primary: string;
  accent: string;
  track: string;
  axis: string;
  tooltipBg: string;
  series: string[];
}

export function useChartColors(): ChartColors {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  return {
    primary: isDark ? "#3182ce" : "#0f4c81",
    accent: isDark ? "#f87171" : "#c62839",
    track: isDark ? "#475569" : "#e2e8f0",
    axis: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#1e293b" : "#1a202c",
    series: isDark
      ? ["#3182ce", "#38bdf8", "#f59e0b", "#f87171"]
      : ["#0f4c81", "#0ea5e9", "#d97706", "#c62839"],
  };
}
