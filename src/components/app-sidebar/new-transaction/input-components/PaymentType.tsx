import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentTypeProps {
    value: string;
    onChange: (value: string) => void;
  }

function PaymentType({ value, onChange }: PaymentTypeProps) {
  return (
    <RadioGroup
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
