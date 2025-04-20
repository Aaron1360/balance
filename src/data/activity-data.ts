import { addDays, isBefore } from "date-fns"
import { transactionsData } from "./transactions-data"
import { debtData, paymentData } from "./debt-data"
import { servicesData, paymentsData } from "./services-data"
import { transactionsData as savingsTransactionsData } from "./savings-data"
import type { ActivityEvent, ActivityCalendarEvent } from "@/types/activity"
import { Service } from "@/types/service"

// Filter savings transactions to get only contributions (deposits)
const contributionsData = savingsTransactionsData.filter((transaction) => transaction.type === "deposit")

// Generate activity events from all data sources
export const generateActivityEvents = (): ActivityEvent[] => {
  const events: ActivityEvent[] = []

  // Add transactions
  transactionsData.forEach((transaction) => {
    events.push({
      id: `transaction-${transaction.id}`,
      title: transaction.description,
      date: new Date(transaction.date),
      amount: transaction.amount,
      category: transaction.category,
      description: `Transacción: ${transaction.description}`,
      type: "transaction",
      status: "completed", // Transactions are always completed
    })
  })

  // Add debt payments
  paymentData.forEach((payment) => {
    const debt = debtData.find((d) => d.id === payment.debtId)
    if (debt) {
      events.push({
        id: `debt-payment-${payment.id}`,
        title: `Pago de ${debt.name}`,
        date: new Date(payment.date),
        amount: payment.amount,
        category: debt.category,
        description: payment.description,
        type: "debt-payment",
        status: payment.status === "completado" ? "completed" : "pending",
      })
    }
  })

  // Add service payments
  paymentsData.forEach((payment) => {
    const service = servicesData.find((s) => s.id === payment.serviceId)
    if (service) {
      events.push({
        id: `service-payment-${payment.id}`,
        title: `Pago de ${service.name}`,
        date: new Date(payment.date),
        amount: payment.amount,
        category: service.category,
        description: payment.notes || `Pago de servicio: ${service.name}`,
        type: "service-payment",
        status: payment.status === "completed" ? "completed" : "pending",
      })
    }
  })

  // Add savings contributions
  contributionsData.forEach((contribution) => {
    events.push({
      id: `savings-contribution-${contribution.id}`,
      title: `Aporte a ${contribution.description || "Ahorro"}`,
      date: new Date(contribution.date),
      amount: contribution.amount,
      category: "Ahorros",
      description: contribution.description || "Aporte a cuenta de ahorro",
      type: "savings-contribution",
      status: "completed", // Contributions are always completed
    })
  })

  // Add upcoming debt payments (next 30 days)
  const today = new Date()
  const nextMonth = addDays(today, 30)

  debtData.forEach((debt) => {
    // Get this month's due date
    const thisMonthDueDate = new Date(today.getFullYear(), today.getMonth(), debt.paymentDueDay)

    // If due date has passed, get next month's due date
    if (isBefore(thisMonthDueDate, today)) {
      thisMonthDueDate.setMonth(thisMonthDueDate.getMonth() + 1)
    }

    // If due date is within the next 30 days, add it
    if (isBefore(thisMonthDueDate, nextMonth)) {
      // Check if payment is already made for this month
      const isAlreadyPaid = paymentData.some(
        (payment) =>
          payment.debtId === debt.id &&
          payment.date.getMonth() === thisMonthDueDate.getMonth() &&
          payment.date.getFullYear() === thisMonthDueDate.getFullYear(),
      )

      if (!isAlreadyPaid) {
        events.push({
          id: `upcoming-debt-${debt.id}`,
          title: `Pago de ${debt.name}`,
          date: thisMonthDueDate,
          amount: debt.minimumPayment,
          category: debt.category,
          description: `Pago programado de ${debt.name}`,
          type: "debt-payment",
          status: isBefore(thisMonthDueDate, today) ? "overdue" : "pending",
        })
      }
    }
  })

  // Add upcoming service payments (next 30 days)
  servicesData.forEach((service) => {
    // Get this month's due date
    const thisMonthDueDate = new Date(today.getFullYear(), today.getMonth(), service.paymentDay)

    // If due date has passed, get next month's due date
    if (isBefore(thisMonthDueDate, today)) {
      thisMonthDueDate.setMonth(thisMonthDueDate.getMonth() + 1)
    }

    // If due date is within the next 30 days, add it
    if (isBefore(thisMonthDueDate, nextMonth)) {
      // Check if payment is already made for this month
      const isAlreadyPaid = (service: Service): boolean => {
        return paymentData.some((payment) => {
          if (payment.debtId !== service.id) return false
          if (!(payment.date instanceof Date)) return false
          return (
            payment.date.getMonth() === thisMonthDueDate.getMonth() &&
            payment.date.getFullYear() === thisMonthDueDate.getFullYear()
          )
        })
      }
    

      if (!isAlreadyPaid) {
        events.push({
          id: `upcoming-service-${service.id}`,
          title: `Pago de ${service.name}`,
          date: thisMonthDueDate,
          amount: service.cost,
          category: service.category,
          description: `Pago programado de ${service.name}`,
          type: "service-payment",
          status: isBefore(thisMonthDueDate, today) ? "overdue" : "pending",
        })
      }
    }
  })

  return events
}

// Get all activity events
export const getActivityEvents = (): ActivityCalendarEvent[] => {
  return generateActivityEvents()
}

// Get activity events for a specific date
export const getActivityEventsByDate = (date: Date): ActivityCalendarEvent[] => {
  const events = generateActivityEvents()
  return events.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  )
}

// Get activity events by type
export const getActivityEventsByType = (type: string): ActivityCalendarEvent[] => {
  const events = generateActivityEvents()
  return events.filter((event) => event.type === type)
}

// Get activity events by status
export const getActivityEventsByStatus = (status: string): ActivityCalendarEvent[] => {
  const events = generateActivityEvents()
  return events.filter((event) => event.status === status)
}

// Get activity events by date range
export const getActivityEventsByDateRange = (startDate: Date, endDate: Date): ActivityCalendarEvent[] => {
  const events = generateActivityEvents()
  return events.filter((event) => event.date >= startDate && event.date <= endDate)
}
