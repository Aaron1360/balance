import type { Service, ServicePayment } from "@/types/service"
import { addDays, addMonths, subDays, subMonths } from "date-fns"

// Sample services data
export const servicesData: Service[] = [
  {
    id: "1",
    name: "Netflix",
    category: "streaming",
    cost: 219,
    minimumPayment: 90,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 12),
    paymentMethod: "tarjeta de crédito",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Netflix",
    note: "Suscripción al plan premium familiar",
    paymentDay: 12, // Added paymentDay
    description: "Plan Premium",
    logo: "netflix",
    color: "#E50914",
    autoRenewal: true,
    reminderDays: 3,
    tags: ["entretenimiento", "streaming"],
  },
  {
    id: "2",
    name: "Amazon Prime",
    category: "streaming",
    cost: 99,
    minimumPayment: 700,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 5),
    paymentMethod: "tarjeta de crédito",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Amazon",
    note: "Incluye Prime Video, Prime Music y envíos gratis",
    paymentDay: 5, // Added paymentDay
    description: "Incluye Prime Video, Prime Music y envíos gratis",
    logo: "amazon-prime",
    color: "#00A8E1",
    autoRenewal: true,
    tags: ["entretenimiento", "streaming", "compras"],
  },
  {
    id: "3",
    name: "YouTube Premium",
    category: "streaming",
    cost: 179,
    minimumPayment: 500,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 18),
    paymentMethod: "tarjeta de débito",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Google",
    note: "Suscripción al plan familiar",
    paymentDay: 18, // Added paymentDay
    description: "Plan Familiar",
    logo: "youtube",
    color: "#FF0000",
    autoRenewal: true,
    reminderDays: 2,
    tags: ["entretenimiento", "streaming", "música"],
  },
  {
    id: "4",
    name: "ChatGPT Plus",
    category: "software",
    cost: 380,
    minimumPayment: 985,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 3),
    paymentMethod: "tarjeta de crédito",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "OpenAI",
    note: "Suscripción mensual a ChatGPT Plus",
    paymentDay: 3, // Added paymentDay
    description: "Suscripción premium a ChatGPT",
    logo: "chatgpt",
    color: "#10A37F",
    autoRenewal: true,
    tags: ["productividad", "ia"],
  },
  {
    id: "5",
    name: "Electricidad",
    category: "servicio básico",
    cost: 850,
    minimumPayment: 200,
    frequency: "bimonthly",
    nextPaymentDate: addDays(new Date(), 8),
    paymentMethod: "transferencia",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Comisión Federal de Electricidad",
    note: "Pago del servicio de electricidad",
    paymentDay: 8, // Added paymentDay
    description: "Comisión Federal de Electricidad",
    logo: "electricity",
    color: "#FFC107",
    autoRenewal: false,
    reminderDays: 5,
    tags: ["hogar", "utilidad"],
  },
  {
    id: "6",
    name: "Agua",
    category: "servicio básico",
    cost: 450,
    minimumPayment: 900,
    frequency: "bimonthly",
    nextPaymentDate: addDays(new Date(), 15),
    paymentMethod: "efectivo",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Servicio Municipal de Agua",
    note: "Pago del servicio de agua potable",
    paymentDay: 15, // Added paymentDay
    description: "Servicio Municipal de Agua",
    logo: "water",
    color: "#2196F3",
    autoRenewal: false,
    reminderDays: 5,
    tags: ["hogar", "utilidad"],
  },
  {
    id: "7",
    name: "Renta",
    category: "servicio básico",
    cost: 8500,
    minimumPayment: 90,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 1),
    paymentMethod: "transferencia",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Propietario",
    note: "Pago mensual de la renta del apartamento",
    paymentDay: 1, // Added paymentDay
    description: "Apartamento",
    logo: "rent",
    color: "#4CAF50",
    autoRenewal: false,
    reminderDays: 7,
    tags: ["hogar", "vivienda"],
  },
  {
    id: "8",
    name: "Spotify",
    category: "streaming",
    cost: 149,
    minimumPayment: 900,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 22),
    paymentMethod: "tarjeta de crédito",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Spotify",
    note: "Suscripción al plan individual de Spotify",
    paymentDay: 22, // Added paymentDay
    description: "Plan Individual",
    logo: "spotify",
    color: "#1DB954",
    autoRenewal: true,
    tags: ["entretenimiento", "música"],
  },
  {
    id: "9",
    name: "Internet",
    category: "servicio básico",
    cost: 599,
    minimumPayment: 900,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 7),
    paymentMethod: "domiciliación",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Telmex",
    note: "Servicio de internet de fibra óptica",
    paymentDay: 7, // Added paymentDay
    description: "Fibra óptica 200 Mbps",
    logo: "internet",
    color: "#673AB7",
    autoRenewal: true,
    reminderDays: 3,
    tags: ["hogar", "conectividad"],
  },
  {
    id: "10",
    name: "Seguro de Auto",
    category: "seguro",
    cost: 7800,
    minimumPayment: 900,
    frequency: "annual",
    nextPaymentDate: addMonths(new Date(), 5),
    paymentMethod: "tarjeta de crédito",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "AXA",
    note: "Póliza de seguro de auto con cobertura amplia",
    paymentDay: 10, // Added paymentDay
    description: "Cobertura amplia",
    logo: "car-insurance",
    color: "#F44336",
    autoRenewal: false,
    reminderDays: 14,
    tags: ["vehículo", "seguro"],
  },
  {
    id: "11",
    name: "Gimnasio",
    category: "membresía",
    cost: 650,
    minimumPayment: 900,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 4),
    paymentMethod: "tarjeta de débito",
    status: "active",
    paymentStatus: "pendiente",
    creditor: "Smart Fit",
    note: "Membresía mensual al gimnasio",
    paymentDay: 4, // Added paymentDay
    description: "Membresía completa",
    logo: "gym",
    color: "#FF9800",
    autoRenewal: true,
    tags: ["salud", "fitness"],
  },
  {
    id: "12",
    name: "Disney+",
    category: "streaming",
    cost: 159,
    minimumPayment: 900,
    frequency: "monthly",
    nextPaymentDate: addDays(new Date(), 9),
    paymentMethod: "tarjeta de crédito",
    status: "paused",
    paymentStatus: "pendiente",
    creditor: "Disney",
    note: "Suscripción al plan estándar de Disney+",
    paymentDay: 9, // Added paymentDay
    description: "Plan Estándar",
    logo: "disney",
    color: "#0063E5",
    autoRenewal: false,
    tags: ["entretenimiento", "streaming"],
  },
]


// Sample payment history
export const paymentsData: ServicePayment[] = [
  {
    id: "p1",
    serviceId: "1",
    date: subDays(new Date(), 18),
    amount: 219,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "NF-2023-10-01",
  },
  {
    id: "p2",
    serviceId: "2",
    date: subDays(new Date(), 25),
    amount: 99,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "AP-2023-10-01",
  },
  {
    id: "p3",
    serviceId: "3",
    date: subDays(new Date(), 12),
    amount: 179,
    status: "completed",
    paymentMethod: "tarjeta de débito",
    reference: "YT-2023-10-01",
  },
  {
    id: "p4",
    serviceId: "4",
    date: subDays(new Date(), 27),
    amount: 380,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "GPT-2023-10-01",
  },
  {
    id: "p5",
    serviceId: "5",
    date: subMonths(new Date(), 1),
    amount: 850,
    status: "completed",
    paymentMethod: "transferencia",
    reference: "ELEC-2023-09-01",
  },
  {
    id: "p6",
    serviceId: "6",
    date: subMonths(new Date(), 1),
    amount: 450,
    status: "completed",
    paymentMethod: "efectivo",
    reference: "AGUA-2023-09-01",
  },
  {
    id: "p7",
    serviceId: "7",
    date: subDays(new Date(), 30),
    amount: 8500,
    status: "completed",
    paymentMethod: "transferencia",
    reference: "RENT-2023-10-01",
  },
  {
    id: "p8",
    serviceId: "8",
    date: subDays(new Date(), 8),
    amount: 149,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "SP-2023-10-01",
  },
  {
    id: "p9",
    serviceId: "9",
    date: subDays(new Date(), 23),
    amount: 599,
    status: "completed",
    paymentMethod: "domiciliación",
    reference: "INT-2023-10-01",
  },
  {
    id: "p10",
    serviceId: "10",
    date: subMonths(new Date(), 7),
    amount: 7800,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "CAR-2023-03-01",
  },
  {
    id: "p11",
    serviceId: "11",
    date: subDays(new Date(), 26),
    amount: 650,
    status: "completed",
    paymentMethod: "tarjeta de débito",
    reference: "GYM-2023-10-01",
  },
  {
    id: "p12",
    serviceId: "12",
    date: subMonths(new Date(), 2),
    amount: 159,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "DIS-2023-08-01",
    notes: "Último pago antes de pausar",
  },
  // Previous payments
  {
    id: "p13",
    serviceId: "1",
    date: subMonths(new Date(), 1).setDate(13),
    amount: 219,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "NF-2023-09-01",
  },
  {
    id: "p14",
    serviceId: "2",
    date: subMonths(new Date(), 1).setDate(6),
    amount: 99,
    status: "completed",
    paymentMethod: "tarjeta de crédito",
    reference: "AP-2023-09-01",
  },
  {
    id: "p15",
    serviceId: "3",
    date: subMonths(new Date(), 1).setDate(19),
    amount: 179,
    status: "completed",
    paymentMethod: "tarjeta de débito",
    reference: "YT-2023-09-01",
  },
]

// Helper functions
export const getServicePayments = (serviceId: string): ServicePayment[] => {
  return paymentsData
    .filter((payment) => payment.serviceId === serviceId)
    .sort((a, b) => {
      // Ensure a.date and b.date are valid Date objects before getTime()
      const aTime = a.date instanceof Date ? a.date.getTime() : 0;
      const bTime = b.date instanceof Date ? b.date.getTime() : 0;
      return bTime - aTime;
    });
}


export const getActiveServices = (): Service[] => {
  return servicesData.filter((service) => service.status === "active")
}

export const getServicesByCategory = (category: string): Service[] => {
  return servicesData.filter((service) => service.category === category)
}

export const getServicesByStatus = (status: string): Service[] => {
  return servicesData.filter((service) => service.status === status)
}

export const getNextPayment = (): Service | null => {
  const activeServices = getActiveServices()
  if (activeServices.length === 0) return null

  return activeServices.reduce((next, current) => (current.nextPaymentDate < next.nextPaymentDate ? current : next))
}

export const calculateTotalMonthlyCost = (): number => {
  return getActiveServices().reduce((total, service) => {
    switch (service.frequency) {
      case "monthly":
        return total + service.cost
      case "bimonthly":
        return total + service.cost / 2
      case "quarterly":
        return total + service.cost / 3
      case "semiannual":
        return total + service.cost / 6
      case "annual":
        return total + service.cost / 12
      case "custom":
        if (service.customFrequencyDays) {
          return total + (service.cost * 30) / service.customFrequencyDays
        }
        return total
      default:
        return total
    }
  }, 0)
}

export const getCategoryDistribution = () => {
  const activeServices = getActiveServices()
  const categories = Array.from(new Set(activeServices.map((service) => service.category)))

  return categories
    .map((category) => {
      const services = activeServices.filter((service) => service.category === category)
      const monthlyCost = services.reduce((total, service) => {
        switch (service.frequency) {
          case "monthly":
            return total + service.cost
          case "bimonthly":
            return total + service.cost / 2
          case "quarterly":
            return total + service.cost / 3
          case "semiannual":
            return total + service.cost / 6
          case "annual":
            return total + service.cost / 12
          case "custom":
            if (service.customFrequencyDays) {
              return total + (service.cost * 30) / service.customFrequencyDays
            }
            return total
          default:
            return total
        }
      }, 0)

      return {
        category,
        monthlyCost,
        count: services.length,
        color: getCategoryColor(category),
      }
    })
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
}

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "servicio básico":
      return "#4CAF50" // Green
    case "streaming":
      return "#E91E63" // Pink
    case "software":
      return "#2196F3" // Blue
    case "suscripción":
      return "#FF9800" // Orange
    case "membresía":
      return "#9C27B0" // Purple
    case "seguro":
      return "#F44336" // Red
    default:
      return "#607D8B" // Blue Grey
  }
}

export const getUpcomingPayments = (days = 30): Service[] => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + days)

  return getActiveServices()
    .filter((service) => service.nextPaymentDate <= cutoffDate)
    .sort((a, b) => a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime())
}

export const getRecentPayments = (count = 5): ServicePayment[] => {
  return [...paymentsData].sort((a, b) => {
    const aTime = a.date instanceof Date ? a.date.getTime() : 0;
    const bTime = b.date instanceof Date ? b.date.getTime() : 0;
    return bTime - aTime;
  }).slice(0, count);
};
