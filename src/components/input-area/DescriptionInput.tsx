import { Input } from "../ui/input";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DescriptionInput({
  value,
  onChange,
}: DescriptionInputProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Input
        type="text"
        placeholder="Optional"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
