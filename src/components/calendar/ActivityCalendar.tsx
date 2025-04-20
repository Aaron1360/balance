import { useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, CreditCard, DollarSign, Wallet, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActivityCalendarEvent, ActivityType, ActivityStatus } from "@/types/activity"

interface ActivityCalendarProps {
  events: ActivityCalendarEvent[]
  onEventClick: (event: ActivityCalendarEvent) => void
  selectedTypes: ActivityType[]
  selectedStatuses: ActivityStatus[]
}

export function ActivityCalendar({ events, onEventClick, selectedTypes, selectedStatuses }: ActivityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get days of the week in Spanish
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  // Function to get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(
      (event) =>
        isSameDay(new Date(event.date), day) &&
        selectedTypes.includes(event.type) &&
        selectedStatuses.includes(event.status),
    )
  }

  // Function to get event icon based on type
  const getEventIcon = (type: ActivityType) => {
    switch (type) {
      case "transaction":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      case "debt-payment":
        return <DollarSign className="h-4 w-4 text-amber-500" />
      case "service-payment":
        return <Wallet className="h-4 w-4 text-green-500" />
      case "savings-contribution":
        return <PiggyBank className="h-4 w-4 text-blue-500" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />
    }
  }

  // Function to get event border color based on status
  const getEventBorderColor = (status: ActivityStatus) => {
    switch (status) {
      case "completed":
        return "border-green-500"
      case "pending":
        return "border-blue-500"
      case "overdue":
        return "border-red-500"
      default:
        return "border-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{format(currentMonth, "MMMM yyyy", { locale: es })}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Mes anterior</span>
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Mes siguiente</span>
            </Button>
          </div>
        </div>
        <CardDescription>Calendario de actividades financieras</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-sm font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the start of the month */}
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-24 p-1 border rounded-md bg-muted/20" />
          ))}

          {/* Calendar days */}
          {monthDays.map((day) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)

            return (
              <div
                key={day.toString()}
                className={`h-24 p-1 border rounded-md overflow-hidden ${
                  isToday(day) ? "bg-blue-50 border-blue-200" : isCurrentMonth ? "bg-white" : "bg-muted/20"
                }`}
              >
                <div className="text-right mb-1">
                  <span
                    className={`text-sm inline-block rounded-full w-6 h-6 text-center leading-6 ${
                      isToday(day) ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)]">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`text-xs p-1 rounded cursor-pointer flex items-center gap-1 border-l-2 ${getEventBorderColor(
                        event.status,
                      )} hover:bg-muted`}
                    >
                      {getEventIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} más</div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Empty cells for days after the end of the month */}
          {Array.from({ length: (7 - ((monthStart.getDay() + monthDays.length) % 7)) % 7 }).map((_, i) => (
            <div key={`empty-end-${i}`} className="h-24 p-1 border rounded-md bg-muted/20" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CreditCard className="h-3 w-3 text-purple-500" />
          <span>Transacciones</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-amber-500" />
          <span>Pagos de Deuda</span>
        </div>
        <div className="flex items-center gap-1">
          <Wallet className="h-3 w-3 text-green-500" />
          <span>Pagos de Servicio</span>
        </div>
        <div className="flex items-center gap-1">
          <PiggyBank className="h-3 w-3 text-blue-500" />
          <span>Aportes a Ahorro</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Pendiente</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Vencido</span>
        </div>
      </CardFooter>
    </Card>
  )
}
