import { DatePicker } from "@/components/ui/DatePicker";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Attribute } from "@/features/attributes/attributes.types";
import type { CategoryAttribute } from "@/features/categories/categories.types";

interface Props {
  attribute: CategoryAttribute;
  master?: Attribute;
  value: string;
  onChange: (value: string) => void;
}

/** Parse options JSON string từ attribute master: ["Gỗ","Nhựa",...] */
function parseOptions(options?: string | null): string[] {
  if (!options) return [];
  try {
    const parsed: unknown = JSON.parse(options);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function AttributeValueField({
  attribute,
  master,
  value,
  onChange,
}: Props) {
  const dataType = master?.dataType ?? attribute.dataType;
  const options = parseOptions(master?.options);

  switch (dataType) {
    case "TEXTAREA":
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={attribute.defaultValue || attribute.attributeName}
        />
      );

    case "NUMBER":
      return (
        <Input
          type="number"
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={attribute.defaultValue || "Nhập số nguyên"}
        />
      );

    case "DECIMAL":
      return (
        <Input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={attribute.defaultValue || "Nhập số"}
        />
      );

    case "BOOLEAN":
      return (
        <FormSelect
          value={value}
          options={[
            { value: "true", label: "Có" },
            { value: "false", label: "Không" },
          ]}
          onChange={onChange}
          placeholder="-- Chọn --"
        />
      );

    case "DATE":
      return <DatePicker value={value} onChange={onChange} />;

    case "DATETIME":
      return <DateTimePicker value={value} onChange={onChange} />;

    case "SELECT":
      return (
        <FormSelect
          value={value}
          options={options.map((o) => ({ value: o, label: o }))}
          onChange={onChange}
          placeholder={
            options.length === 0 ? "-- Chưa có lựa chọn --" : "-- Chọn --"
          }
        />
      );

    case "MULTI_SELECT": {
      const selected = value ? value.split(",") : [];
      const toggle = (opt: string) => {
        const next = selected.includes(opt)
          ? selected.filter((s) => s !== opt)
          : [...selected, opt];
        onChange(next.join(","));
      };
      return (
        <div className="flex flex-wrap -mb-1">
          {options.length === 0 ? (
            <span className="text-sm text-text text-opacity-40">
              Chưa có lựa chọn
            </span>
          ) : (
            options.map((opt) => {
              const active = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(opt)}
                  className={`mb-1 mr-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-text hover:border-primary"
                  }`}
                >
                  {opt}
                </button>
              );
            })
          )}
        </div>
      );
    }

    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={attribute.defaultValue || attribute.attributeName}
        />
      );
  }
}
