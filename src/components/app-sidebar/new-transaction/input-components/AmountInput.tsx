import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";

interface AmountInputProps {
  id: string;
  placeholder: string;
  value: number;
  onChange: (value: number) => void;
}

function formatCurrencyInput(rawValue: string | number): string {
  let valueStr = typeof rawValue === "number" ? rawValue.toString() : rawValue;
  valueStr = valueStr.replace(/[^0-9.]/g, "");

  const dotCount = (valueStr.match(/\./g) || []).length;
  if (dotCount > 1) {
    const firstDotIndex = valueStr.indexOf(".");
    valueStr =
      valueStr.slice(0, firstDotIndex + 1) +
      valueStr.slice(firstDotIndex + 1).replace(/\./g, "");
  }

  return valueStr ? `$${valueStr}` : "";
}

export default function AmountInput({
  id,
  placeholder,
  value,
  onChange,
}: AmountInputProps) {
  const [stringValue, setStringValue] = useState(formatCurrencyInput(value));

  if(stringValue === "$0"){setStringValue("")}

  useEffect(() => {
    setStringValue(formatCurrencyInput(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let rawValue = e.target.value;

    // Allow only one dot
    if ((rawValue.match(/\./g) || []).length > 1) {
      rawValue = rawValue.slice(0, -1);
    }

    rawValue = rawValue.replace(/[^0-9.]/g, "");

    if (rawValue !== "") {
      const parsedValue = parseFloat(rawValue);
      onChange(parsedValue);
      setStringValue(`$${rawValue}`);
    } else {
      onChange(0);
      setStringValue(formatCurrencyInput(0));
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
