export type Transaction = {
    id: string
    date: Date
    description: string
    amount: number
    category: string
    paymentMethod: string
    type: "income" | "expense"
    paymentType: "unica" | "diferido" | null
    msi: number | null
    notes?: string
    reference?: string
    merchant?: string
    status?: "completed" | "pending" | "cancelled"
    tags?: string[]
  }
  