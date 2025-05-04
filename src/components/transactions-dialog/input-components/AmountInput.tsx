import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";

interface AmountInputProps {
  id: string;
  placeholder: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function AmountInput({
  id,
  placeholder,
  value,
  onChange,
  disabled = false,
}: AmountInputProps) {
  const [stringValue, setStringValue] = useState<string>(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let rawValue = e.target.value;
    
    // Allow only numbers and a single dot
    if (!/^\d*\.?\d*$/.test(rawValue.replace(/[$%]/g, ""))) {
      return; // Ignore invalid input
    }

    // Format the input
    if (id === "interest_rate") {
      // Add % at the end if not already present
      if (!rawValue.endsWith("%")) {
        rawValue = rawValue.replace(/%/g, "") + "%";
      }
    } else {
      // Add $ at the start if not already present
      if (!rawValue.startsWith("$")) {
        rawValue = "$" + rawValue.replace(/\$/g, "");
      }
    }

    // Remove formatting to extract the numeric value
    const numericValue = parseFloat(rawValue.replace(/[^0-9.]/g, "")) || 0;

    // If the numeric value is 0, set the string to an empty string
    if (numericValue === 0) {
      setStringValue("");
      onChange(0);
      return;
    }

    // Update the state and call the onChange callback with the numeric value
    setStringValue(rawValue);
    onChange(numericValue);
  }

  // Sync the stringValue with the numeric value when the prop changes
  useEffect(() => {
    if (value === 0) {
      setStringValue(""); // Set to empty string if value is 0
    } else if (id === "interest_rate") {
      setStringValue(value.toString() + "%");
    } else {
      setStringValue("$" + value.toString());
    }
  }, [value, id]);

  // Ensure the cursor is positioned before the % sign
  useEffect(() => {
    if (id === "interest_rate" && inputRef.current) {
      const input = inputRef.current;
      const cursorPosition = stringValue.length - 1; // Position cursor before the "%"
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [stringValue, id]);

  return (
    <div className="grid items-center gap-1.5">
      <Input
        ref={inputRef} // Attach the ref to the input
        id={id}
        type="text"
        placeholder={placeholder}
        value={stringValue}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}