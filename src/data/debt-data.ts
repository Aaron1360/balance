import type { DebtItem, DebtPayment, DebtCategory, MonthlyDebtData, CalendarEvent } from "@/types/debt"
import { format, subMonths, addDays, subDays, isBefore, isAfter } from "date-fns"
import { es } from "date-fns/locale"

// Sample debt data
export const debtData: DebtItem[] = [
  {
    id: "1",
    name: "Préstamo Hipotecario",
    totalAmount: 1200000,
    remainingAmount: 950000,
    interestRate: 7.5,
    minimumPayment: 8500,
    paymentDueDay: 15,
    startDate: new Date(2022, 3, 10),
    estimatedPayoffDate: new Date(2042, 3, 10),
    category: "Préstamos",
    color: "hsl(0, 84%, 60%)",
    creditor: "Banco Nacional",
    notes: "Préstamo para la casa principal",
    paymentStatus: "próximo",
    lastPaymentDate: subDays(new Date(), 15),
    lastPaymentAmount: 8500,
    type: "préstamo",
    subcategory: "hipotecario",
    reminderDays: 5,
    autoPayEnabled: true,
  },
  {
    id: "2",
    name: "Préstamo Automotriz",
    totalAmount: 320000,
    remainingAmount: 180000,
    interestRate: 9.2,
    minimumPayment: 6200,
    paymentDueDay: 5,
    startDate: new Date(2023, 1, 20),
    estimatedPayoffDate: new Date(2028, 1, 20),
    category: "Préstamos",
    color: "hsl(215, 90%, 58%)",
    creditor: "Financiera Automotriz",
    notes: "Financiamiento para el coche familiar",
    paymentStatus: "pagado",
    lastPaymentDate: subDays(new Date(), 3),
    lastPaymentAmount: 6200,
    type: "préstamo",
    subcategory: "auto",
    reminderDays: 3,
  },
  {
    id: "3",
    name: "Tarjeta de Crédito Principal",
    totalAmount: 45000,
    remainingAmount: 32000,
    interestRate: 24.9,
    minimumPayment: 1600,
    paymentDueDay: 20,
    startDate: new Date(2023, 5, 15),
    estimatedPayoffDate: new Date(2025, 8, 15),
    category: "Tarjetas de Crédito",
    color: "hsl(43, 89%, 55%)",
    creditor: "Banco Universal",
    notes: "Tarjeta principal para gastos cotidianos",
    paymentStatus: "próximo",
    lastPaymentDate: subDays(new Date(), 25),
    lastPaymentAmount: 2000,
    type: "tarjeta",
    reminderDays: 7,
  },
  {
    id: "4",
    name: "Préstamo Personal",
    totalAmount: 80000,
    remainingAmount: 65000,
    interestRate: 16.5,
    minimumPayment: 3200,
    paymentDueDay: 10,
    startDate: new Date(2023, 8, 5),
    estimatedPayoffDate: new Date(2026, 8, 5),
    category: "Préstamos",
    color: "hsl(275, 80%, 60%)",
    creditor: "Cooperativa Financiera",
    notes: "Préstamo para remodelación del hogar",
    paymentStatus: "vencido",
    lastPaymentDate: subDays(new Date(), 35),
    lastPaymentAmount: 3200,
    type: "préstamo",
    subcategory: "personal",
  },
  {
    id: "5",
    name: "Tarjeta de Crédito Secundaria",
    totalAmount: 25000,
    remainingAmount: 18000,
    interestRate: 28.5,
    minimumPayment: 900,
    paymentDueDay: 25,
    startDate: new Date(2023, 9, 10),
    estimatedPayoffDate: new Date(2025, 3, 10),
    category: "Tarjetas de Crédito",
    color: "hsl(43, 89%, 55%)",
    creditor: "Banco Comercial",
    notes: "Tarjeta para compras en línea",
    paymentStatus: "pendiente",
    lastPaymentDate: subDays(new Date(), 20),
    lastPaymentAmount: 1200,
    type: "tarjeta",
  },
  {
    id: "6",
    name: "Electricidad",
    totalAmount: 850,
    remainingAmount: 850,
    interestRate: 0,
    minimumPayment: 850,
    paymentDueDay: 18,
    startDate: new Date(2023, new Date().getMonth(), 1),
    estimatedPayoffDate: new Date(2023, new Date().getMonth(), 18),
    category: "Servicios",
    color: "hsl(180, 70%, 45%)",
    creditor: "Compañía Eléctrica",
    notes: "Factura mensual de electricidad",
    paymentStatus: "pendiente",
    type: "servicio",
    subcategory: "electricidad",
  },
  {
    id: "7",
    name: "Internet y Telefonía",
    totalAmount: 1200,
    remainingAmount: 1200,
    interestRate: 0,
    minimumPayment: 1200,
    paymentDueDay: 22,
    startDate: new Date(2023, new Date().getMonth(), 1),
    estimatedPayoffDate: new Date(2023, new Date().getMonth(), 22),
    category: "Servicios",
    color: "hsl(180, 70%, 45%)",
    creditor: "Proveedor de Internet",
    notes: "Plan familiar de internet y telefonía",
    paymentStatus: "pendiente",
    type: "servicio",
    subcategory: "internet",
  },
  {
    id: "8",
    name: "Agua",
    totalAmount: 450,
    remainingAmount: 450,
    interestRate: 0,
    minimumPayment: 450,
    paymentDueDay: 12,
    startDate: new Date(2023, new Date().getMonth(), 1),
    estimatedPayoffDate: new Date(2023, new Date().getMonth(), 12),
    category: "Servicios",
    color: "hsl(180, 70%, 45%)",
    creditor: "Servicio Municipal de Agua",
    notes: "Factura bimestral de agua",
    paymentStatus: "próximo",
    type: "servicio",
    subcategory: "agua",
  },
  {
    id: "9",
    name: "Suscripción Streaming",
    totalAmount: 299,
    remainingAmount: 299,
    interestRate: 0,
    minimumPayment: 299,
    paymentDueDay: 5,
    startDate: new Date(2023, new Date().getMonth(), 1),
    estimatedPayoffDate: new Date(2023, new Date().getMonth(), 5),
    category: "Servicios",
    color: "hsl(180, 70%, 45%)",
    creditor: "StreamFlix",
    notes: "Plan premium familiar",
    paymentStatus: "pagado",
    lastPaymentDate: subDays(new Date(), 2),
    lastPaymentAmount: 299,
    type: "servicio",
    subcategory: "suscripciones",
    autoPayEnabled: true,
  },
  {
    id: "10",
    name: "Préstamo Estudiantil",
    totalAmount: 150000,
    remainingAmount: 120000,
    interestRate: 5.8,
    minimumPayment: 2800,
    paymentDueDay: 28,
    startDate: new Date(2021, 8, 1),
    estimatedPayoffDate: new Date(2031, 8, 1),
    category: "Préstamos",
    color: "hsl(275, 80%, 60%)",
    creditor: "Financiera Educativa",
    notes: "Préstamo para maestría",
    paymentStatus: "pendiente",
    lastPaymentDate: subDays(new Date(), 30),
    lastPaymentAmount: 2800,
    type: "préstamo",
    subcategory: "estudiantil",
    reminderDays: 5,
  },
]

// Sample payment data with more details
export const paymentData: DebtPayment[] = [
  {
    id: "p1",
    date: new Date(),
    amount: 8500,
    debtId: "1",
    description: "Pago mensual hipoteca",
    status: "completado",
    paymentMethod: "Transferencia bancaria",
    confirmationNumber: "TRF-2023-001",
  },
  {
    id: "p2",
    date: subDays(new Date(), 3),
    amount: 6200,
    debtId: "2",
    description: "Pago mensual automóvil",
    status: "completado",
    paymentMethod: "Débito automático",
    confirmationNumber: "AUT-2023-002",
  },
  {
    id: "p3",
    date: subDays(new Date(), 25),
    amount: 2500,
    debtId: "3",
    description: "Pago tarjeta principal",
    status: "completado",
    paymentMethod: "Pago en línea",
    confirmationNumber: "ONL-2023-003",
  },
  {
    id: "p4",
    date: subDays(new Date(), 35),
    amount: 3200,
    debtId: "4",
    description: "Pago préstamo personal",
    status: "completado",
    paymentMethod: "Transferencia bancaria",
    confirmationNumber: "TRF-2023-004",
  },
  {
    id: "p5",
    date: subDays(new Date(), 20),
    amount: 1200,
    debtId: "5",
    description: "Pago tarjeta secundaria",
    status: "completado",
    paymentMethod: "Pago en línea",
    confirmationNumber: "ONL-2023-005",
  },
  {
    id: "p6",
    date: subDays(new Date(), 2),
    amount: 299,
    debtId: "9",
    description: "Pago suscripción streaming",
    status: "completado",
    paymentMethod: "Cargo automático",
    confirmationNumber: "AUT-2023-006",
  },
  {
    id: "p7",
    date: subDays(new Date(), 30),
    amount: 2800,
    debtId: "10",
    description: "Pago préstamo estudiantil",
    status: "completado",
    paymentMethod: "Transferencia bancaria",
    confirmationNumber: "TRF-2023-007",
  },
  {
    id: "p8",
    date: subDays(new Date(), 33),
    amount: 8500,
    debtId: "1",
    description: "Pago mensual hipoteca",
    status: "completado",
    paymentMethod: "Transferencia bancaria",
    confirmationNumber: "TRF-2023-008",
  },
  {
    id: "p9",
    date: subDays(new Date(), 35),
    amount: 6200,
    debtId: "2",
    description: "Pago mensual automóvil",
    status: "completado",
    paymentMethod: "Débito automático",
    confirmationNumber: "AUT-2023-009",
  },
  {
    id: "p10",
    date: subDays(new Date(), 55),
    amount: 2000,
    debtId: "3",
    description: "Pago tarjeta principal",
    status: "completado",
    paymentMethod: "Pago en línea",
    confirmationNumber: "ONL-2023-010",
  },
  {
    id: "p11",
    date: subDays(new Date(), 65),
    amount: 3200,
    debtId: "4",
    description: "Pago préstamo personal",
    status: "completado",
    paymentMethod: "Transferencia bancaria",
    confirmationNumber: "TRF-2023-011",
  },
  {
    id: "p12",
    date: subDays(new Date(), 50),
    amount: 1000,
    debtId: "5",
    description: "Pago tarjeta secundaria",
    status: "completado",
    paymentMethod: "Pago en línea",
    confirmationNumber: "ONL-2023-012",
  },
]

// Calculate categories data for pie chart
export const debtCategoriesData: DebtCategory[] = Array.from(
  debtData.reduce((map, debt) => {
    const existing = map.get(debt.category)
    if (existing) {
      existing.amount += debt.remainingAmount
    } else {
      map.set(debt.category, {
        name: debt.category,
        amount: debt.remainingAmount,
        color: debt.color,
      })
    }
    return map
  }, new Map<string, DebtCategory>()),
).map(([_, value]) => value)

// Generate monthly data for line chart
export const generateMonthlyDebtData = (): MonthlyDebtData[] => {
  const data: MonthlyDebtData[] = []
  const now = new Date()

  // Start with total current debt
  const currentDebt = debtData.reduce((sum, debt) => sum + debt.remainingAmount, 0)

  // Generate data for past 6 months
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i)
    const monthName = format(date, "MMM", { locale: es })

    // Add some random variation to simulate past debt levels (higher in the past)
    const monthsAgo = i
    const additionalDebt = monthsAgo * 15000 + Math.random() * 10000

    data.push({
      month: monthName,
      amount: currentDebt + additionalDebt,
    })
  }

  return data
}

export const monthlyDebtData = generateMonthlyDebtData()

// Calculate total debt
export const calculateTotalDebt = (): number => {
  return debtData.reduce((total, debt) => total + debt.remainingAmount, 0)
}

// Calculate total monthly payments
export const calculateTotalMonthlyPayments = (): number => {
  return debtData.reduce((total, debt) => total + debt.minimumPayment, 0)
}

// Calculate total interest paid per month
export const calculateTotalMonthlyInterest = (): number => {
  return debtData.reduce((total, debt) => {
    // Simple interest calculation (this is simplified)
    const monthlyInterestRate = debt.interestRate / 100 / 12
    return total + debt.remainingAmount * monthlyInterestRate
  }, 0)
}

// Get recent payments (most recent first)
export const getRecentPayments = (limit = 5): DebtPayment[] => {
  return [...paymentData].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit)
}

// Get payments for a specific debt
export const getDebtPayments = (debtId: string): DebtPayment[] => {
  return paymentData.filter((payment) => payment.debtId === debtId)
}

// Calculate debt payoff date based on minimum payments
export const calculatePayoffDate = (debt: DebtItem): Date => {
  // This is a simplified calculation
  const monthlyInterestRate = debt.interestRate / 100 / 12
  const monthlyPayment = debt.minimumPayment

  // Number of months to pay off the debt
  // Using the formula for a fixed payment loan
  const numberOfMonths = Math.ceil(
    Math.log(monthlyPayment / (monthlyPayment - monthlyInterestRate * debt.remainingAmount)) /
      Math.log(1 + monthlyInterestRate),
  )

  const payoffDate = new Date()
  payoffDate.setMonth(payoffDate.getMonth() + numberOfMonths)

  return payoffDate
}

// Calculate debt-to-income ratio (assuming a monthly income)
export const calculateDebtToIncomeRatio = (monthlyIncome: number): number => {
  const totalMonthlyDebtPayments = calculateTotalMonthlyPayments()
  return (totalMonthlyDebtPayments / monthlyIncome) * 100
}

// Get debts by category
export const getDebtsByCategory = (category: string): DebtItem[] => {
  return debtData.filter((debt) => debt.category === category)
}

// Get debts by type
export const getDebtsByType = (type: string): DebtItem[] => {
  return debtData.filter((debt) => debt.type === type)
}

// Get debts by payment status
export const getDebtsByStatus = (status: string): DebtItem[] => {
  return debtData.filter((debt) => debt.paymentStatus === status)
}

// Generate calendar events for the next 30 days
export const generateCalendarEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = []
  const today = new Date()
  const nextMonth = addDays(today, 30)

  // Add payment due dates
  debtData.forEach((debt) => {
    // Get this month's due date
    const thisMonthDueDate = new Date(today.getFullYear(), today.getMonth(), debt.paymentDueDay)

    // If due date has passed, get next month's due date
    if (isBefore(thisMonthDueDate, today)) {
      thisMonthDueDate.setMonth(thisMonthDueDate.getMonth() + 1)
    }

    // If due date is within the next 30 days, add it
    if (isBefore(thisMonthDueDate, nextMonth)) {
      events.push({
        id: `due-${debt.id}`,
        title: `Pago de ${debt.name}`,
        date: thisMonthDueDate,
        type: "payment",
        debtId: debt.id,
        status: debt.paymentStatus,
        amount: debt.minimumPayment,
      })
    }

    // Add reminder if configured
    if (debt.reminderDays) {
      const reminderDate = new Date(thisMonthDueDate)
      reminderDate.setDate(reminderDate.getDate() - debt.reminderDays)

      // If reminder date is in the future and within 30 days
      if (isAfter(reminderDate, today) && isBefore(reminderDate, nextMonth)) {
        events.push({
          id: `reminder-${debt.id}`,
          title: `Recordatorio: ${debt.name}`,
          date: reminderDate,
          type: "reminder",
          debtId: debt.id,
          status: "pendiente",
          amount: debt.minimumPayment,
        })
      }
    }
  })

  return events.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Get calendar events
export const calendarEvents = generateCalendarEvents()
