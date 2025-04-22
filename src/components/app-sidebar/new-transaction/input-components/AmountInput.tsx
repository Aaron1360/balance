import { Input } from "@/components/ui/input";

interface AmountInputProps {
  id: string;
  placeholder: string;
  value: string | number;
  onChange: (value: number) => void;
}

export default function AmountInput({ id, placeholder, value, onChange }: AmountInputProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        min="0"
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}
