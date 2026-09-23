import { FiMoon, FiSun } from "react-icons/fi";

import { useThemeStore } from "@/store/theme.store";

interface Props {
  className?: string;
}

export function ThemeToggle({ className = "" }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);

  return (
    <div
      className={`flex items-center rounded-full border border-white border-opacity-20 bg-white bg-opacity-10 p-1 backdrop-blur ${className}`}
    >
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Chuyển giao diện sáng/tối"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:text-opacity-70"
      >
        {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>
    </div>
  );
}
