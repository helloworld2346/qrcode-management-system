import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

export interface FormSelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: FormSelectOption[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
}

const DROPDOWN_MAX_HEIGHT = 240; // khớp max-h-60 (15rem)

export function FormSelect({
  value,
  options,
  onChange,
  onBlur,
  placeholder = "-- Chọn --",
  invalid = false,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // Nếu dưới không đủ chỗ mà trên rộng hơn thì lật lên trên
    setDropUp(spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-lg border bg-bg px-3 py-2 text-sm text-text outline-none transition-colors focus:border-primary ${
          invalid ? "border-accent" : "border-border"
        }`}
      >
        <span
          className={`truncate ${selected ? "" : "text-text text-opacity-40"}`}
        >
          {selected?.label ?? placeholder}
        </span>
        <FiChevronDown
          size={16}
          className={`ml-2 shrink-0 text-text text-opacity-50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className={`absolute left-0 right-0 z-30 max-h-60 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    onBlur?.();
                  }}
                  className={`flex w-full items-center px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary bg-opacity-10 font-medium text-primary"
                      : "text-text hover:bg-primary hover:bg-opacity-5"
                  }`}
                >
                  <span className="mr-6 whitespace-nowrap">{opt.label}</span>
                  <FiCheck
                    size={14}
                    className={`ml-auto ${active ? "text-primary" : "text-transparent"}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
