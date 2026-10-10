import { useEffect, useMemo, useRef, useState } from "react";
import { FiCalendar } from "react-icons/fi";

import { FormSelect } from "@/components/ui/FormSelect";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const pad = (n: number) => String(n).padStart(2, "0");

const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => ({
  value: pad(h),
  label: pad(h),
}));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, m) => ({
  value: pad(m),
  label: pad(m),
}));
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i),
  label: `Tháng ${i + 1}`,
}));
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 121 }, (_, i) => {
  const y = 1950 + i;
  return { value: String(y), label: String(y) };
});

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
    if (!value || !DATETIME_RE.test(value)) return null;
    const [datePart, timePart = "00:00"] = value.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm] = timePart.split(":").map(Number);
    return { y, m: m - 1, d, hh: hh || 0, mm: mm || 0 };
  }, [value]);

  const [view, setView] = useState(() => {
    const base = selected ?? { y: CURRENT_YEAR, m: new Date().getMonth() };
    return { y: base.y, m: base.m };
  });

  useEffect(() => {
    if (selected) {
      setView({ y: selected.y, m: selected.m });
    }
  }, [selected]);

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

  const emit = (d: number, hh: number, mm: number) => {
    onChange(`${view.y}-${pad(view.m + 1)}-${pad(d)}T${pad(hh)}:${pad(mm)}`);
  };

  const formatDisplay = (v: string) => {
    if (!DATETIME_RE.test(v)) return placeholder;
    const [datePart, timePart = "00:00"] = v.split("T");
    const [y, m, d] = datePart.split("-");
    return `${d}/${m}/${y} ${timePart}`;
  };

  const hasValue = DATETIME_RE.test(value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg border bg-bg px-3 py-2 text-sm outline-none transition-colors focus:border-primary ${
          invalid ? "border-accent" : "border-border"
        }`}
      >
        <span className={hasValue ? "text-text" : "text-text text-opacity-40"}>
          {hasValue ? formatDisplay(value) : placeholder}
        </span>
        <FiCalendar size={16} className="text-text text-opacity-50" />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-30 mt-1 w-72 rounded-lg border border-border bg-surface p-3 shadow-lg">
          <div className="mb-2 flex items-center">
            <div className="w-1/2 pr-1">
              <FormSelect
                value={String(view.m)}
                options={MONTH_OPTIONS}
                onChange={(v) => setView((prev) => ({ ...prev, m: Number(v) }))}
              />
            </div>
            <div className="w-1/2 pl-1">
              <FormSelect
                value={String(view.y)}
                options={YEAR_OPTIONS}
                onChange={(v) => setView((prev) => ({ ...prev, y: Number(v) }))}
              />
            </div>
          </div>

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

          <div className="grid grid-cols-7">
            {cells.map((d, i) =>
              d === null ? (
                <div key={`e-${i}`} className="h-8" />
              ) : (
                <button
                  key={d}
                  type="button"
                  onClick={() => emit(d, selected?.hh ?? 0, selected?.mm ?? 0)}
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

          <div className="mt-2 flex items-center border-t border-border pt-2">
            <div className="flex-1">
              <FormSelect
                value={pad(selected?.hh ?? 0)}
                options={HOUR_OPTIONS}
                onChange={(v) =>
                  emit(
                    selected?.d ?? today.getDate(),
                    Number(v),
                    selected?.mm ?? 0,
                  )
                }
              />
            </div>
            <span className="mx-2 text-sm font-medium text-text">:</span>
            <div className="flex-1">
              <FormSelect
                value={pad(selected?.mm ?? 0)}
                options={MINUTE_OPTIONS}
                onChange={(v) =>
                  emit(
                    selected?.d ?? today.getDate(),
                    selected?.hh ?? 0,
                    Number(v),
                  )
                }
              />
            </div>
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
