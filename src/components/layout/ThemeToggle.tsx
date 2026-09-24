import { FiMoon, FiSun } from "react-icons/fi";

import { useThemeStore } from "@/store/theme.store";

interface Props {
  className?: string;
}

export function ThemeToggle({ className = "" }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Chuyển giao diện sáng/tối"
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:border-primary hover:text-primary ${className}`}
    >
      {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}
