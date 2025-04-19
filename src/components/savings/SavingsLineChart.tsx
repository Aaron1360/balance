"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { MonthlyData } from "@/types/savings"

interface SavingsLineChartProps {
  data: MonthlyData[]
}

export function SavingsLineChart({ data }: SavingsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis
          tickFormatter={(value) =>
            value.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            })
          }
        />
        <Tooltip
          formatter={(value) => [value.toLocaleString("es-MX", { style: "currency", currency: "MXN" }), "Ahorro Total"]}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="hsl(142, 76%, 36%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
