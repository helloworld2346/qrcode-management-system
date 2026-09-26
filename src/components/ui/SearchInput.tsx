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
  placeholder = "Tìm kiếm...",
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch
        size={16}
        className="pointer-events-none absolute left-3 top-2.5 text-text text-opacity-40"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder-text placeholder-opacity-40 transition-colors focus:border-primary focus:outline-none"
      />
    </div>
  );
}
