import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type SummaryItem = {
  icon: LucideIcon;
  title: string;
  amount: number;
  growthPercentage: number;
};

export default function SummaryItems({
  items,
  periods,
  globalPeriod,
}: {
  items: SummaryItem[];
  periods: string[];
  globalPeriod: string;
}) {
  const [localSelectedPeriod, setLocalSelectedPeriod] = useState(globalPeriod); // Default to global period
  // Sync local state with globalPeriod whenever it changes
  useEffect(() => {
    setLocalSelectedPeriod(globalPeriod);
  }, [globalPeriod]);
  
  return (
    <div className="flex justify-evenly items-stretch w-full">
      {items.map(({ icon: Icon, title, amount, growthPercentage }) => (
        <Card key={title} className="flex flex-col flex-1 min-w-[250px]">
          <CardHeader className="flex justify-between items-center border-b max-h-5 pr-2 ">
            <div className="flex flex-row gap-2 items-center">
              <Icon className="w-5 h-5" />
              <Label className="text-md">{title}</Label>
            </div>
            {/* Individual Select synchronized with global state */}
            <Select
              value={localSelectedPeriod}
              onValueChange={setLocalSelectedPeriod}
            >
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
          </CardHeader>
          <CardContent className="flex flex-col mt-0 pt-0">
            <Label className="text-2xl font-semibold">
              ${amount.toLocaleString()}
            </Label>
            <Label>
              <span className="text-green-500">+{growthPercentage}%</span> vs
              last month
            </Label>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
