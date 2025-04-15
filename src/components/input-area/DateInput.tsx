import { Input } from "../ui/input";

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function DateInput({value, onChange}: DateInputProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

