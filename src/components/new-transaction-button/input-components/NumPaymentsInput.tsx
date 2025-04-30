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

  if (stringValue === "0") {setStringValue("")}

  useEffect(() => {
    setStringValue(value.toString());
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanedValue = e.target.value.replace(/[^0-9]/g, "");
    setStringValue(cleanedValue);

    const parsedValue = cleanedValue ? parseInt(cleanedValue) : 0;
    onChange(parsedValue);
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
