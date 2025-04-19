export type SavingsProject = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: string
  color: string
  note?: string
}

export type SavingsTransaction = {
  id: string
  date: Date
  amount: number
  type: "deposit" | "withdrawal"
  description: string
  projectId: string
}

export type SavingsCategory = {
  name: string
  amount: number
  color: string
}

export type MonthlyData = {
  month: string
  amount: number
}
