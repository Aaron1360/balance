import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CreditCard, DollarSign, Wallet, PiggyBank, CalendarIcon, List } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityCalendar } from "@/components/calendar/ActivityCalendar"
import { ActivityEventDialog } from "@/components/calendar/ActivityEventDialog"
import { getActivityEvents } from "@/data/activity-data"
import type { ActivityCalendarEvent, ActivityType, ActivityStatus } from "@/types/activity"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<ActivityCalendarEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([
    "transaction",
    "debt-payment",
    "service-payment",
    "savings-contribution",
  ])
  const [selectedStatuses, setSelectedStatuses] = useState<ActivityStatus[]>(["completed", "pending", "overdue"])

  const activityEvents = getActivityEvents()

  const handleEventClick = (event: ActivityCalendarEvent) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const handleMarkAsCompleted = (event: ActivityCalendarEvent) => {
    // In a real app, this would update the database
    console.log("Marked as completed:", event)
    setIsDialogOpen(false)
  }

  const getEventIcon = (type: ActivityType) => {
    switch (type) {
      case "transaction":
        return <CreditCard className="h-5 w-5 text-purple-500" />
      case "debt-payment":
        return <DollarSign className="h-5 w-5 text-amber-500" />
      case "service-payment":
        return <Wallet className="h-5 w-5 text-green-500" />
      case "savings-contribution":
        return <PiggyBank className="h-5 w-5 text-blue-500" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />
    }
  }

  // Filter events based on selected types and statuses
  const filteredEvents = activityEvents.filter(
    (event) => selectedTypes.includes(event.type) && selectedStatuses.includes(event.status),
  )

  // Count events by type
  const transactionCount = activityEvents.filter((e) => e.type === "transaction").length
  const debtPaymentCount = activityEvents.filter((e) => e.type === "debt-payment").length
  const servicePaymentCount = activityEvents.filter((e) => e.type === "service-payment").length
  const savingsContributionCount = activityEvents.filter((e) => e.type === "savings-contribution").length

  // Count events by status
  const completedCount = activityEvents.filter((e) => e.status === "completed").length
  const pendingCount = activityEvents.filter((e) => e.status === "pending").length
  const overdueCount = activityEvents.filter((e) => e.status === "overdue").length

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Calendario de Actividad</h1>
        <p className="text-muted-foreground">Visualiza todas tus actividades financieras en un solo lugar</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Filtros</CardTitle>
              <CardDescription>Filtra por tipo y estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Tipo de Actividad</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="transaction"
                        checked={selectedTypes.includes("transaction")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, "transaction"])
                          } else {
                            setSelectedTypes(selectedTypes.filter((t) => t !== "transaction"))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="transaction" className="flex items-center text-sm">
                        <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
                        Transacciones ({transactionCount})
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="debt-payment"
                        checked={selectedTypes.includes("debt-payment")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, "debt-payment"])
                          } else {
                            setSelectedTypes(selectedTypes.filter((t) => t !== "debt-payment"))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="debt-payment" className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 text-amber-500 mr-2" />
                        Pagos de Deuda ({debtPaymentCount})
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="service-payment"
                        checked={selectedTypes.includes("service-payment")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, "service-payment"])
                          } else {
                            setSelectedTypes(selectedTypes.filter((t) => t !== "service-payment"))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="service-payment" className="flex items-center text-sm">
                        <Wallet className="h-4 w-4 text-green-500 mr-2" />
                        Pagos de Servicio ({servicePaymentCount})
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="savings-contribution"
                        checked={selectedTypes.includes("savings-contribution")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, "savings-contribution"])
                          } else {
                            setSelectedTypes(selectedTypes.filter((t) => t !== "savings-contribution"))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="savings-contribution" className="flex items-center text-sm">
                        <PiggyBank className="h-4 w-4 text-blue-500 mr-2" />
                        Aportes a Ahorro ({savingsContributionCount})
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Estado</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="completed"
                        checked={selectedStatuses.includes("completed")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStatuses([...selectedStatuses, "completed"])
                          } else {
                            setSelectedStatuses(selectedStatuses.filter((s) => s !== "completed"))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="completed" className="text-sm">
                        Completado ({completedCount})
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pending"
                        checked={selectedStatuses.includes("pending")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStatuses([...selectedStatuses, "pending"])
                          } else {
                            setSelectedStatuses(selectedStatuses.filter((s) => s !== "pending"))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="pending" className="text-sm">
                        Pendiente ({pendingCount})
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="overdue"
                        checked={selectedStatuses.includes("overdue")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStatuses([...selectedStatuses, "overdue"])
                          } else {
                            setSelectedStatuses(selectedStatuses.filter((s) => s !== "overdue"))
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="overdue" className="text-sm">
                        Vencido ({overdueCount})
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resumen de Actividad</CardTitle>
              <CardDescription>Total de actividades por tipo y estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Por Tipo</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Transacciones</span>
                      </div>
                      <span className="text-sm font-medium">{transactionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Pagos de Deuda</span>
                      </div>
                      <span className="text-sm font-medium">{debtPaymentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Pagos de Servicio</span>
                      </div>
                      <span className="text-sm font-medium">{servicePaymentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PiggyBank className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Aportes a Ahorro</span>
                      </div>
                      <span className="text-sm font-medium">{savingsContributionCount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Por Estado</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completado</span>
                      <span className="text-sm font-medium">{completedCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pendiente</span>
                      <span className="text-sm font-medium">{pendingCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vencido</span>
                      <span className="text-sm font-medium">{overdueCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="calendar">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Calendario</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Lista</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="calendar">
              <ActivityCalendar
                events={filteredEvents}
                onEventClick={handleEventClick}
                selectedTypes={selectedTypes}
                selectedStatuses={selectedStatuses}
              />
            </TabsContent>
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Actividades</CardTitle>
                  <CardDescription>Todas tus actividades financieras en formato de lista</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredEvents.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No hay actividades que coincidan con los filtros seleccionados
                        </p>
                      ) : (
                        filteredEvents
                          .sort((a, b) => b.date.getTime() - a.date.getTime())
                          .map((event) => (
                            <div
                              key={event.id}
                              className="flex items-start space-x-4 p-3 rounded-lg border cursor-pointer hover:bg-muted"
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex-shrink-0">{getEventIcon(event.type)}</div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{event.title}</p>
                                  <Badge
                                    variant={
                                      event.status === "completed"
                                        ? "default"
                                        : event.status === "pending"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                  >
                                    {event.status === "completed"
                                      ? "Completado"
                                      : event.status === "pending"
                                        ? "Pendiente"
                                        : "Vencido"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <div className="flex justify-between items-center">
                                  <p className="text-sm font-medium">${event.amount.toLocaleString("es-MX")}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(event.date, "d 'de' MMMM, yyyy", { locale: es })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ActivityEventDialog
        event={selectedEvent}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onMarkAsCompleted={handleMarkAsCompleted}
      />
    </div>
  )
}
