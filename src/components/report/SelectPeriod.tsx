import { useAppContext } from "@/context/AppContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectPeriod({
  ...props
}: React.ComponentProps<typeof Select>) {
  const { periods } = useAppContext();

  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Periodo" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {periods.map((period) => (
            <SelectItem key={period} value={period}>
              {period}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
