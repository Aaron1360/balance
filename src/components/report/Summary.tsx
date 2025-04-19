import SummaryItems from "./SummaryItems";
import {
  Landmark,
  CircleDollarSign,
  HandCoins,
  ReceiptText,
} from "lucide-react";
// This is sample data.
const summaryData = [
  {
    key: "Corte",
    title: "Corte",
    items: [
      {
        icon: Landmark,
        title: "Corte",
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

function Summary() {
  return (
    <div className="flex flex-col items-end gap-3">
      {/* Render summary items, passing selectedPeriod as prop */}
      <div className="flex w-full justify-between items-center min-w-0">
        {summaryData.map(({ key, items }) => (
          <section key={key}>
            <SummaryItems
              items={items}
            />
          </section>
        ))}
      </div>
    </div>
  );
}

export default Summary;
