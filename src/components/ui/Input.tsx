import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { invalid = false, className = "", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border bg-bg px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text placeholder:text-opacity-40 focus:border-primary ${
        invalid ? "border-accent" : "border-border"
      } ${className}`}
      {...rest}
    />
  );
});
