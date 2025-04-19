export type DebtItem = {
  id: string
  name: string
  totalAmount: number
  remainingAmount: number
  interestRate: number
  minimumPayment: number
  paymentDueDay: number
  startDate: Date
  estimatedPayoffDate: Date
  category: string
  color: string
  creditor: string
  notes?: string
  paymentStatus: "pagado" | "próximo" | "vencido" | "pendiente"
  lastPaymentDate?: Date
  lastPaymentAmount?: number
  type: "servicio" | "tarjeta" | "préstamo" | "otro"
  subcategory?: string
  reminderDays?: number
  autoPayEnabled?: boolean
}

export type DebtPayment = {
  id: string
  date: Date
  amount: number
  debtId: string
  description: string
  isPrincipalOnly?: boolean
  status: "completado" | "pendiente" | "fallido"
  paymentMethod?: string
  confirmationNumber?: string
}

export type DebtCategory = {
  name: string
  amount: number
  color: string
}

export type MonthlyDebtData = {
  month: string
  amount: number
}

export type DebtFilter = {
  categories: string[]
  types: string[]
  status: string[]
  search: string
  sortBy: string
  sortDirection: "asc" | "desc"
}

export type DebtReminder = {
  id: string
  debtId: string
  daysBeforeDue: number
  enabled: boolean
  notificationType: "email" | "push" | "sms"
}

export type CalendarEvent = {
  id: string
  title: string
  date: Date
  type: "payment" | "reminder"
  debtId: string
  status: "pagado" | "próximo" | "vencido" | "pendiente"
  amount: number
}
