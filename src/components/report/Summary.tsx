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
  

function Summary() {
  return (
    <div className="flex justify-between items-center">
      {summaryData.map(({ key, items }) => (
        <section key={key}>
          <SummaryItems items={items} />
        </section>
      ))}
    </div>
  )
}

export default Summary
