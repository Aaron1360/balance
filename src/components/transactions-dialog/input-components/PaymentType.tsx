import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentTypeProps {
  id: string;
  value: "unica" | "diferido"; 
  onChange: (value: "unica" | "diferido") => void; 
}

function PaymentType({ id, value, onChange }: PaymentTypeProps) {
  return (
    <RadioGroup
      aria-labelledby={id}
      defaultValue="unica"
      className="col-span-3 flex gap-4"
      value={value}
      onValueChange={onChange}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="unica" id="unica" />
        <Label htmlFor="unica" className="font-normal">
          Única exhibición
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="diferido" id="diferido" />
        <Label htmlFor="diferido" className="font-normal">
          Diferido
        </Label>
      </div>
    </RadioGroup>
  );
}

export default PaymentType;
