import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: Props) {
  const base =
    "px-4 py-2 rounded font-medium disabled:opacity-50 transition-colors";
  const color =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-hover"
      : "bg-surface text-text border border-border hover:bg-primary hover:text-white";
  return <button className={`${base} ${color} ${className}`} {...rest} />;
}
