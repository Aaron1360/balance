import { Input } from "../ui/input";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AmountInput({ value, onChange }: AmountInputProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Input
        type="text"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
