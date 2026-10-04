import { useEffect, useMemo, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  value: string; // "YYYY-MM-DDTHH:mm"
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

export function DateTimePicker({
  value,
  onChange,
  onBlur,
  placeholder = "dd/mm/yyyy hh:mm",
  invalid = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => {
    if (!value) return null;
    const [datePart, timePart = "00:00"] = value.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm] = timePart.split(":").map(Number);
    return { y, m: m - 1, d, hh: hh || 0, mm: mm || 0 };
  }, [value]);

  const [view, setView] = useState(() => {
    const base = selected ?? {
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
    const firstDay = new Date(view.y, view.m, 1).getDay();
    const offset = (firstDay + 6) % 7;
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
    selected?.y === view.y && selected?.m === view.m && selected?.d === d;

  const prevMonth = () =>
    setView((v) =>
      v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 },
    );
  const nextMonth = () =>
    setView((v) =>
      v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 },
    );

  const emit = (d: number, hh: number, mm: number) => {
    onChange(`${view.y}-${pad(view.m + 1)}-${pad(d)}T${pad(hh)}:${pad(mm)}`);
  };

  const formatDisplay = (v: string) => {
    const [datePart, timePart = "00:00"] = v.split("T");
    const [y, m, d] = datePart.split("-");
    return `${d}/${m}/${y} ${timePart}`;
  };

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
          {value ? formatDisplay(value) : placeholder}
        </span>
        <FiCalendar size={16} className="text-text text-opacity-50" />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-lg border border-border bg-surface p-3 shadow-lg">
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
                    emit(d, selected?.hh ?? 0, selected?.mm ?? 0);
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

          {/* Giờ : phút */}
          <div className="mt-2 flex items-center justify-center border-t border-border pt-2">
            <select
              value={pad(selected?.hh ?? 0)}
              onChange={(e) =>
                emit(
                  selected?.d ?? today.getDate(),
                  Number(e.target.value),
                  selected?.mm ?? 0,
                )
              }
              className="rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text outline-none focus:border-primary"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={pad(h)}>
                  {pad(h)}
                </option>
              ))}
            </select>
            <span className="mx-2 text-sm font-medium text-text">:</span>
            <select
              value={pad(selected?.mm ?? 0)}
              onChange={(e) =>
                emit(
                  selected?.d ?? today.getDate(),
                  selected?.hh ?? 0,
                  Number(e.target.value),
                )
              }
              className="rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text outline-none focus:border-primary"
            >
              {Array.from({ length: 60 }, (_, m) => (
                <option key={m} value={pad(m)}>
                  {pad(m)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onBlur?.();
              }}
              className="ml-3 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Xong
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
