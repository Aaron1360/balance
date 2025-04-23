import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AmountInputProps {
  id: string;
  placeholder: string;
  value: number;
  onChange: (value: number) => void;
}

export default function NumPaymentsInput({
  id,
  placeholder,
  value,
  onChange,
}: AmountInputProps) {
  const [stringValue, setStringValue] = useState(value.toString());

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let rawValue = e.target.value;

    // Allow only numbers
    rawValue = rawValue.replace(/[^0-9]/g, "");

    if (rawValue !== "") {
      const parsedValue = rawValue === "" ? 0 : parseFloat(rawValue);
      setStringValue(rawValue);
      onChange(parsedValue);
    } else {
      const parsedValue = rawValue === "" ? 0 : parseFloat(rawValue);
      setStringValue("");
      onChange(parsedValue);
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
