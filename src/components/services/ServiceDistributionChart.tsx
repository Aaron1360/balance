import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ChartData {
  category: string
  monthlyCost: number
  count: number
  color: string
}

interface ServiceDistributionChartProps {
  data: ChartData[]
}

export function ServiceDistributionChart({ data }: ServiceDistributionChartProps) {
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
          dataKey="monthlyCost"
          nameKey="category"
          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => value.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
          labelFormatter={(label) => `Categoría: ${label}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
