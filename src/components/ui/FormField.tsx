import type { ReactNode } from "react";

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  required = false,
  error,
  className = "",
  children,
}: Props) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-text">
        {label}
        {required ? <span className="ml-0.5 text-accent">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-accent">{error}</p> : null}
    </div>
  );
}
