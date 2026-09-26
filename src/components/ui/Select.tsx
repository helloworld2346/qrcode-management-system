import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

interface Option {
  value: number;
  label: string;
}

interface Props {
  value: number;
  options: Option[];
  onChange: (value: number) => void;
  className?: string;
}

export function Select({ value, options, onChange, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text transition-colors hover:border-primary focus:border-primary focus:outline-none"
      >
        <span className="mr-2">{selected?.label ?? ""}</span>
        <FiChevronDown
          size={15}
          className={`text-text text-opacity-50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute bottom-full left-0 z-30 mb-1 min-w-full overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
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
                  }}
                  className={`flex w-full items-center px-3 py-1.5 text-sm transition-colors ${
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
