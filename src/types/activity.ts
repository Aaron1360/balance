export type ActivityType = "transaction" | "debt-payment" | "service-payment" | "savings-contribution"
export type ActivityStatus = "completed" | "pending" | "overdue"

export interface ActivityEvent {
  id: string
  title: string
  date: Date
  amount: number
  category: string
  description: string
  type: ActivityType
  status: ActivityStatus
  relatedItemId?: string
  relatedItemType?: string
}

export interface ActivityCalendarEvent {
  id: string
  title: string
  date: Date
  amount: number
  category: string
  description: string
  type: ActivityType
  status: ActivityStatus
}
