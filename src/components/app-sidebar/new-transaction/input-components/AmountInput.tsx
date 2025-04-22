import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface AmountInputProps {
  id: string;
  placeholder: string;
  value: number;
  onChange: (value: number) => void;
}

export default function AmountInput({ id, placeholder, value, onChange }: AmountInputProps) {
  const [stringValue, setStringValue] = useState(formatValue(value));

  useEffect(() => {
    setStringValue(formatValue(value));
  }, [value]);

  function formatValue(num: number): string {
    return `$${num.toFixed(0)}`; // Format to whole numbers
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    const parsedValue = parseInt(rawValue, 10);

    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
      setStringValue(formatValue(parsedValue)); // Update string value
    } else {
      onChange(0);
      setStringValue("$0");
    }
  }

  return (
    <div className="grid items-center gap-1.5">
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={stringValue}
        onChange={handleChange}
      />
    </div>
  );
}