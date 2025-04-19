import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Bell, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CalendarEvent } from "@/types/debt"

interface DebtCalendarProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function DebtCalendar({ events, onEventClick }: DebtCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Calendario de Pagos</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy", { locale: es })}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {monthDays.map((day, i) => {
            const dayEvents = getEventsForDay(day)
            const hasEvents = dayEvents.length > 0
            const hasDuePayment = dayEvents.some((e) => e.type === "payment")
            const hasReminder = dayEvents.some((e) => e.type === "reminder")
            const hasOverdue = dayEvents.some((e) => e.status === "vencido")

            return (
              <div
                key={i}
                className={cn(
                  "aspect-square p-1 relative",
                  isToday(day) && "bg-primary/10 rounded-md",
                  hasEvents && "cursor-pointer hover:bg-muted",
                )}
                onClick={() => hasEvents && dayEvents.forEach((event) => onEventClick(event))}
              >
                <div
                  className={cn(
                    "h-full w-full flex flex-col items-center justify-start p-1 rounded-md",
                    hasOverdue && "border border-red-500",
                    hasDuePayment && !hasOverdue && "border border-amber-500",
                    hasReminder && !hasDuePayment && !hasOverdue && "border border-blue-500",
                  )}
                >
                  <span className={cn("text-center font-medium", isToday(day) && "text-primary")}>
                    {format(day, "d")}
                  </span>

                  {hasEvents && (
                    <div className="mt-auto flex flex-wrap justify-center gap-0.5">
                      {hasDuePayment && (
                        <Badge
                          variant="outline"
                          className="w-5 h-5 p-0 flex items-center justify-center"
                          style={{ borderColor: "hsl(38, 92%, 50%)" }}
                        >
                          <DollarSign className="h-3 w-3 text-amber-500" />
                        </Badge>
                      )}
                      {hasReminder && (
                        <Badge
                          variant="outline"
                          className="w-5 h-5 p-0 flex items-center justify-center"
                          style={{ borderColor: "hsl(217, 91%, 60%)" }}
                        >
                          <Bell className="h-3 w-3 text-blue-500" />
                        </Badge>
                      )}
                      {hasOverdue && (
                        <Badge
                          variant="outline"
                          className="w-5 h-5 p-0 flex items-center justify-center bg-red-100"
                          style={{ borderColor: "hsl(0, 84%, 60%)" }}
                        >
                          <span className="text-red-500 text-xs">!</span>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center">
            <Badge variant="outline" className="w-4 h-4 p-0 mr-1" style={{ borderColor: "hsl(38, 92%, 50%)" }}>
              <DollarSign className="h-2 w-2 text-amber-500" />
            </Badge>
            <span>Pago</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="w-4 h-4 p-0 mr-1" style={{ borderColor: "hsl(217, 91%, 60%)" }}>
              <Bell className="h-2 w-2 text-blue-500" />
            </Badge>
            <span>Recordatorio</span>
          </div>
          <div className="flex items-center">
            <Badge
              variant="outline"
              className="w-4 h-4 p-0 mr-1 bg-red-100"
              style={{ borderColor: "hsl(0, 84%, 60%)" }}
            >
              <span className="text-red-500 text-[10px]">!</span>
            </Badge>
            <span>Vencido</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
