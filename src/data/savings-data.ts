import type { SavingsProject, SavingsTransaction, SavingsCategory, MonthlyData } from "@/types/savings"
import { addDays, format, subMonths } from "date-fns"
import { es } from "date-fns/locale"

// Sample projects data
export const projectsData: SavingsProject[] = [
  {
    id: "1",
    name: "Vacaciones",
    targetAmount: 15000,
    currentAmount: 9750,
    deadline: addDays(new Date(), 60),
    category: "Viajes",
    color: "hsl(142, 76%, 36%)",
    note: "Viaje a la playa con la familia",
  },
  {
    id: "2",
    name: "Fondo de Emergencia",
    targetAmount: 30000,
    currentAmount: 18000,
    deadline: addDays(new Date(), 120),
    category: "Seguridad",
    color: "hsl(217, 91%, 60%)",
    note: "Fondo para gastos imprevistos",
  },
  {
    id: "3",
    name: "Nuevo Coche",
    targetAmount: 50000,
    currentAmount: 12500,
    deadline: addDays(new Date(), 365),
    category: "Transporte",
    color: "hsl(38, 92%, 50%)",
    note: "Ahorro para el enganche de un coche nuevo",
  },
  {
    id: "4",
    name: "Educación",
    targetAmount: 20000,
    currentAmount: 5000,
    deadline: addDays(new Date(), 180),
    category: "Desarrollo Personal",
    color: "hsl(280, 87%, 65%)",
    note: "Curso de especialización profesional",
  },
]

// Sample transactions data
export const transactionsData: SavingsTransaction[] = [
  {
    id: "t1",
    date: new Date(),
    amount: 1500,
    type: "deposit",
    description: "Depósito mensual",
    projectId: "1",
  },
  {
    id: "t2",
    date: subMonths(new Date(), 0.1),
    amount: 2000,
    type: "deposit",
    description: "Bono laboral",
    projectId: "2",
  },
  {
    id: "t3",
    date: subMonths(new Date(), 0.2),
    amount: -500,
    type: "withdrawal",
    description: "Reparación de emergencia",
    projectId: "2",
  },
  {
    id: "t4",
    date: subMonths(new Date(), 0.3),
    amount: 3000,
    type: "deposit",
    description: "Ahorro extra",
    projectId: "3",
  },
  {
    id: "t5",
    date: subMonths(new Date(), 0.4),
    amount: 1000,
    type: "deposit",
    description: "Depósito programado",
    projectId: "4",
  },
  {
    id: "t6",
    date: subMonths(new Date(), 0.5),
    amount: 500,
    type: "deposit",
    description: "Ahorro quincenal",
    projectId: "1",
  },
  {
    id: "t7",
    date: subMonths(new Date(), 0.6),
    amount: -200,
    type: "withdrawal",
    description: "Retiro para gastos",
    projectId: "1",
  },
  {
    id: "t8",
    date: subMonths(new Date(), 0.7),
    amount: 1200,
    type: "deposit",
    description: "Depósito mensual",
    projectId: "2",
  },
]

// Calculate categories data for pie chart
export const categoriesData: SavingsCategory[] = projectsData.map((project) => ({
  name: project.category,
  amount: project.currentAmount,
  color: project.color,
}))

// Generate monthly data for line chart
export const generateMonthlyData = (): MonthlyData[] => {
  const data: MonthlyData[] = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i)
    const monthName = format(date, "MMM", { locale: es })

    // Generate a somewhat realistic progression
    const baseAmount = 8000
    const growthFactor = (5 - i) * 800
    const randomVariation = Math.random() * 1000 - 500

    data.push({
      month: monthName,
      amount: baseAmount + growthFactor + randomVariation,
    })
  }

  return data
}

export const monthlyData = generateMonthlyData()

// Calculate total savings
export const calculateTotalSavings = (): number => {
  return projectsData.reduce((total, project) => total + project.currentAmount, 0)
}

// Get transactions for a specific project
export const getProjectTransactions = (projectId: string): SavingsTransaction[] => {
  return transactionsData.filter((transaction) => transaction.projectId === projectId)
}

// Get recent transactions (most recent first)
export const getRecentTransactions = (limit = 5): SavingsTransaction[] => {
  return [...transactionsData].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit)
}
