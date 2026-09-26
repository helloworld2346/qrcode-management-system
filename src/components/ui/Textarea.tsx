import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  function Textarea({ invalid = false, className = "", ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={`w-full resize-none rounded-lg border bg-bg px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text placeholder:text-opacity-40 focus:border-primary ${
          invalid ? "border-accent" : "border-border"
        } ${className}`}
        {...rest}
      />
    );
  },
);
