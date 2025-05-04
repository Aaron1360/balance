import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setStringValue(value.toString());
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;

    if (inputValue === "") {
      // Handle empty input by setting the value to 0
      setStringValue("");
      onChange(1);
      return;
    }

    const parsedValue = parseInt(inputValue, 10);

    // Ensure the value is a valid number and clamp it between 1 and 60
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.min(Math.max(parsedValue, 1), 60);
      setStringValue(clampedValue.toString());
      onChange(clampedValue);
    }
  }

  return (
    <div className="grid items-center gap-1.5">
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        value={stringValue}
        onChange={handleChange}
        min={1} // Minimum value
        max={60} // Maximum value
      />
    </div>
  );
}