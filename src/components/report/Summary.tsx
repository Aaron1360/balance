import { useState } from "react";
import SummaryItems from "./SummaryItems";
import {
  Landmark,
  CircleDollarSign,
  HandCoins,
  ReceiptText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// This is sample data.
const summaryData = [
  {
    key: "Balance",
    title: "Balance",
    items: [
      {
        icon: Landmark,
        title: "Balance",
        amount: 27000,
        growthPercentage: 15,
      },
    ],
  },
  {
    key: "Income",
    title: "Ingresos",
    items: [
      {
        icon: CircleDollarSign,
        title: "Ingresos",
        amount: 9600,
        growthPercentage: 1,
      },
    ],
  },
  {
    key: "Outcome",
    title: "Gastos",
    items: [
      {
        icon: ReceiptText,
        title: "Gastos",
        amount: 6000,
        growthPercentage: 10,
      },
    ],
  },
  {
    key: "Savings",
    title: "Ahorros",
    items: [
      {
        icon: HandCoins,
        title: "Ahorros",
        amount: 25000,
        growthPercentage: 2,
      },
    ],
  },
];

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

function Summary() {
  const [selectedPeriod, setSelectedPeriod] = useState("Abr 2025");

  return (
    <div className="flex flex-col items-end gap-3">
      {/* Global Select controlling all SummaryItems */}
      <Select
        value={selectedPeriod}
        onValueChange={setSelectedPeriod}
        defaultValue={periods[3]}
      >
        <SelectTrigger>
          <SelectValue placeholder="Periodo General" />
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
      {/* Render summary items, passing selectedPeriod as prop */}
      <div className="flex w-full justify-between items-center">
        {summaryData.map(({ key, items }) => (
          <section key={key}>
            <SummaryItems
              items={items}
              periods={periods}
              globalPeriod={selectedPeriod}
            />
          </section>
        ))}
      </div>
    </div>
  );
}

export default Summary;
