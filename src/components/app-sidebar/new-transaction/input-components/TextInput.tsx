import { Input } from "@/components/ui/input";

interface TextInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({
  id,
  placeholder,
  value,
  onChange,
}: TextInputProps) {
  return (
    <div className="grid items-center gap-1.5">
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
