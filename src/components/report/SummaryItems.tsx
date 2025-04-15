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

type SummaryItem = {
  icon: LucideIcon;
  title: string;
  amount: number;
  growthPercentage: number;
};

export default function SummaryItems({ items }: { items: SummaryItem[] }) {
  const year = new Date().getFullYear();

  const months = [
    "Ene",  
    "Feb",  
    "Mar",  
    "Abr",  
    "May",  
    "Jun",  
    "Jul",  
    "Ago",  
    "Sep",  
    "Oct",  
    "Nov",  
    "Dic",  
  ];
  
  const periods = months.map((month) => `${month} ${year}`);

  return (
    <div className="flex justify-evenly items-stretch w-full">
      {items.map(({ icon: Icon, title, amount, growthPercentage }) => (
        <Card key={title} className="flex flex-col flex-1 min-w-[250px]">
          <CardHeader className="flex justify-between items-center border-b max-h-5 pr-2 ">
            <div className="flex flex-row gap-2 items-center">
              <Icon className="w-5 h-5" />
              <Label className="text-md">{title}</Label>
            </div>
            <Select defaultValue={periods[3]}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Months" />
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
