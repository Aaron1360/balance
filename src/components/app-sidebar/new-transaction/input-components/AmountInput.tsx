import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface AmountInputProps {
  id: string;
  placeholder: string;
  value: number;
  onChange: (value: number) => void;
}

export default function AmountInput({
  id,
  placeholder,
  value,
  onChange,
}: AmountInputProps) {
  const [stringValue, setStringValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let rawValue = e.target.value;

    if (id === "amount") {
      // Allow only one dot
      if ((rawValue.match(/\./g) || []).length > 1) {
        rawValue = rawValue.slice(0, -1);
      }

      rawValue = rawValue.replace(/[^0-9.]/g, "");

      if (rawValue !== "") {
        const parsedValue = rawValue === "" ? 0 : parseFloat(rawValue);
        setStringValue(`$${rawValue}`);
        onChange(parsedValue);
      } else {
        const parsedValue = rawValue === "" ? 0 : parseFloat(rawValue);
        setStringValue("");
        onChange(parsedValue);
      }
    } else {
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
  }

  // useEffect(() => {
  //   console.log("Value Changed:", value);
  // }, [value]);

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
