import { useContext } from "react";
import { PurchasesContext } from "@/context/PurchasesContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";

const COLORS = ["#4f46e5", "#22d3ee", "#f59e42", "#10b981", "#ef4444", "#6366f1", "#f43f5e", "#a3e635", "#fbbf24", "#0ea5e9"];

export function MetricsScreen() {
  const ctx = useContext(PurchasesContext);
  if (!ctx || !ctx.profile) {
    return (
      <div className="p-8 rounded-xl bg-card shadow-lg max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-primary">Métricas</h1>
        <div className="text-muted-foreground text-lg">
          No hay perfil activo. Crea un perfil para ver tus métricas y análisis de gastos.
        </div>
      </div>
    );
  }

  const { purchases, totalMonthlyPayment, totalDebt } = ctx;
  if (!purchases || purchases.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-card shadow-lg max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-primary">Métricas</h1>
        <div className="text-muted-foreground text-lg">
          No hay compras registradas. Agrega compras para ver tus métricas y análisis de gastos.
        </div>
      </div>
    );
  }

  // Calculate total spent per category
  const perCategory: { name: string; value: number }[] = [];
  const categoryMap: Record<string, number> = {};
  purchases.forEach(p => {
    const cat = p.category || "Sin categoría";
    categoryMap[cat] = (categoryMap[cat] || 0) + p.amount;
  });
  Object.entries(categoryMap).forEach(([name, value]) => perCategory.push({ name, value }));

  // Calculate total spent per card
  const perCard: { name: string; value: number }[] = [];
  const cardMap: Record<string, number> = {};
  purchases.forEach(p => {
    const card = p.card || "Sin tarjeta";
    cardMap[card] = (cardMap[card] || 0) + p.amount;
  });
  Object.entries(cardMap).forEach(([name, value]) => perCard.push({ name, value }));

  // Calculate monthly spending trend
  const perMonth: { name: string; value: number }[] = [];
  const monthMap: Record<string, number> = {};
  purchases.forEach(p => {
    const month = p.date.slice(0, 7); // YYYY-MM
    monthMap[month] = (monthMap[month] || 0) + p.amount;
  });
  Object.entries(monthMap).sort().forEach(([name, value]) => perMonth.push({ name, value }));

  return (
    <div className="p-8 rounded-xl bg-card shadow-lg max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-primary">Métricas</h1>
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2 text-muted-foreground">Total mensual a pagar</div>
          <div className="text-3xl font-extrabold text-primary">${totalMonthlyPayment.toFixed(2)}</div>
        </div>
        <div className="bg-background rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2 text-muted-foreground">Deuda total</div>
          <div className="text-3xl font-extrabold text-destructive">${totalDebt.toFixed(2)}</div>
        </div>
        <div className="bg-background rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2 text-muted-foreground">Compras registradas</div>
          <div className="text-3xl font-extrabold text-accent">{purchases.length}</div>
        </div>
      </div>
      <div className="mb-10">
        <div className="font-semibold text-xl mb-4 text-muted-foreground">Gasto por categoría</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perCategory} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1">
              {perCategory.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-10">
        <div className="font-semibold text-xl mb-4 text-muted-foreground">Gasto por tarjeta</div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={perCard}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {perCard.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-10">
        <div className="font-semibold text-xl mb-4 text-muted-foreground">Tendencia mensual de gastos</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={perMonth} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}