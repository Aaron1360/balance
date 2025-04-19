import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { DebtCategory } from "@/types/debt"

interface DebtPieChartProps {
  data: DebtCategory[]
}

export function DebtPieChart({ data }: DebtPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="amount"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => value.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
