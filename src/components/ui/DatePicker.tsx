import { useEffect, useMemo, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (y: number, m: number, d: number) =>
  `${y}-${pad(m + 1)}-${pad(d)}`;
const formatVN = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "dd/mm/yyyy",
  invalid = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedDate = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split("-").map(Number);
    return { y, m: m - 1, d };
  }, [value]);

  const [view, setView] = useState(() => {
    const base = selectedDate ?? {
      y: new Date().getFullYear(),
      m: new Date().getMonth(),
    };
    return { y: base.y, m: base.m };
  });

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onBlur]);

  const cells = useMemo(() => {
    const firstDay = new Date(view.y, view.m, 1).getDay(); // 0=CN
    const offset = (firstDay + 6) % 7; // chuyển CN=6, T2=0
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < offset; i += 1) arr.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) arr.push(d);
    return arr;
  }, [view]);

  const today = new Date();
  const isToday = (d: number) =>
    today.getFullYear() === view.y &&
    today.getMonth() === view.m &&
    today.getDate() === d;
  const isSelected = (d: number) =>
    selectedDate?.y === view.y &&
    selectedDate?.m === view.m &&
    selectedDate?.d === d;

  const prevMonth = () =>
    setView((v) =>
      v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 },
    );
  const nextMonth = () =>
    setView((v) =>
      v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 },
    );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg border bg-bg px-3 py-2 text-sm outline-none transition-colors focus:border-primary ${
          invalid ? "border-accent" : "border-border"
        }`}
      >
        <span className={value ? "text-text" : "text-text text-opacity-40"}>
          {value ? formatVN(value) : placeholder}
        </span>
        <FiCalendar size={16} className="text-text text-opacity-50" />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-lg border border-border bg-surface p-3 shadow-lg">
          {/* Điều hướng tháng */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-text">
              {MONTHS[view.m]} {view.y}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text text-opacity-60 transition-colors hover:bg-primary hover:bg-opacity-10 hover:text-primary"
            >
              <FiChevronRight size={16} />
            </button>
          </div>

          {/* Tiêu đề thứ */}
          <div className="grid grid-cols-7">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="flex h-8 items-center justify-center text-xs font-medium text-text text-opacity-40"
              >
                {w}
              </div>
            ))}
          </div>

          {/* Các ngày */}
          <div className="grid grid-cols-7">
            {cells.map((d, i) =>
              d === null ? (
                <div key={`e-${i}`} className="h-8" />
              ) : (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    onChange(toISO(view.y, view.m, d));
                    setOpen(false);
                    onBlur?.();
                  }}
                  className={`flex h-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    isSelected(d)
                      ? "bg-primary font-medium text-white"
                      : isToday(d)
                        ? "text-primary hover:bg-primary hover:bg-opacity-10"
                        : "text-text hover:bg-primary hover:bg-opacity-5"
                  }`}
                >
                  {d}
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
