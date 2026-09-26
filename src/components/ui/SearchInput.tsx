import { FiSearch } from "react-icons/fi";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text text-opacity-40"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm text-text outline-none transition-colors placeholder:text-text placeholder:text-opacity-40 focus:border-primary"
      />
    </div>
  );
}
