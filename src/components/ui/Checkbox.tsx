import { useEffect, useRef } from "react";
import { FiCheck, FiMinus } from "react-icons/fi";

interface Props {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  "aria-label": ariaLabel,
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const active = checked || indeterminate;

  return (
    <label
      className={`relative inline-flex h-4 w-4 cursor-pointer items-center justify-center ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={ariaLabel}
        className="peer sr-only"
      />
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
          active
            ? "border-primary bg-primary text-white"
            : "border-border bg-bg text-transparent"
        } peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-opacity-40`}
      >
        {indeterminate ? (
          <FiMinus size={12} strokeWidth={3} />
        ) : checked ? (
          <FiCheck size={12} strokeWidth={3} />
        ) : null}
      </span>
    </label>
  );
}
