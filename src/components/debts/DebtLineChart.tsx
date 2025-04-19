import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { MonthlyDebtData } from "@/types/debt"

interface DebtLineChartProps {
  data: MonthlyDebtData[]
}

export function DebtLineChart({ data }: DebtLineChartProps) {
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
          formatter={(value) => [value.toLocaleString("es-MX", { style: "currency", currency: "MXN" }), "Deuda Total"]}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="hsl(0, 84%, 60%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
