import { useState } from "react"
import { Plus, AlertCircle, CreditCard, DollarSign, TrendingDown, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { DebtItem, DebtFilter, CalendarEvent } from "@/types/debt"
import {
  debtData,
  debtCategoriesData,
  monthlyDebtData,
  calculateTotalDebt,
  calculateTotalMonthlyPayments,
  calculateTotalMonthlyInterest,
  getRecentPayments,
  getDebtPayments,
  calendarEvents,
} from "@/data/debt-data"
import { DebtPieChart } from "./DebtPieChart"
import { DebtLineChart } from "./DebtLineChart"
import { AddDebtDialog } from "./AddDebtDialog"
import { DebtDetailsDialog } from "./DebtDetailsDialog"
import { MakePaymentDialog } from "./MakePaymentDialog"
import { DebtFilters } from "./DebtFilter"
import { DebtCategorySection } from "./DebtCategorySection"
import { DebtCalendar } from "./DebtCalendar"
import { CalendarEventDialog } from "./CalendarEventDialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function DebtDashboard() {
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false)
  const [isDebtDetailsOpen, setIsDebtDetailsOpen] = useState(false)
  const [isMakePaymentOpen, setIsMakePaymentOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCalendarEventOpen, setIsCalendarEventOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState<DebtItem | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [activeView, setActiveView] = useState<"list" | "calendar">("list")
  const [filter, setFilter] = useState<DebtFilter>({
    categories: [],
    types: [],
    status: [],
    search: "",
    sortBy: "paymentDueDay",
    sortDirection: "asc",
  })

  const totalDebt = calculateTotalDebt()
  const totalMonthlyPayments = calculateTotalMonthlyPayments()
  const totalMonthlyInterest = calculateTotalMonthlyInterest()
  const recentPayments = getRecentPayments(5)

  // Filter and sort debts
  const filteredDebts = debtData
    .filter((debt) => {
      // Filter by search
      if (
        filter.search &&
        !debt.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !debt.creditor.toLowerCase().includes(filter.search.toLowerCase())
      ) {
        return false
      }

      // Filter by categories
      if (filter.categories.length > 0 && !filter.categories.includes(debt.category)) {
        return false
      }

      // Filter by types
      if (filter.types.length > 0 && !filter.types.includes(debt.type)) {
        return false
      }

      // Filter by status
      if (filter.status.length > 0 && !filter.status.includes(debt.paymentStatus)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      const aValue = a[filter.sortBy as keyof DebtItem]
      const bValue = b[filter.sortBy as keyof DebtItem]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return filter.sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return filter.sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return filter.sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      return 0
    })

  // Get debts by category
  const serviciosDebts = filteredDebts.filter((debt) => debt.category === "Servicios")
  const tarjetasDebts = filteredDebts.filter((debt) => debt.category === "Tarjetas de Crédito")
  const prestamosDebts = filteredDebts.filter((debt) => debt.category === "Préstamos")
  const otrosDebts = filteredDebts.filter(
    (debt) => !["Servicios", "Tarjetas de Crédito", "Préstamos"].includes(debt.category),
  )

  const handleViewDebtDetails = (debt: DebtItem) => {
    setSelectedDebt(debt)
    setIsDebtDetailsOpen(true)
  }

  const handleMakePayment = (debt?: DebtItem) => {
    if (debt) {
      setSelectedDebt(debt)
    }
    setIsMakePaymentOpen(true)
  }

  const handleDeleteDebt = (debt: DebtItem) => {
    setSelectedDebt(debt)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteDebt = () => {
    // Here you would delete the debt from your data
    console.log("Deleting debt:", selectedDebt?.id)
    setIsDeleteDialogOpen(false)
  }

  const handleCalendarEventClick = (event: CalendarEvent) => {
    const debt = debtData.find((d) => d.id === event.debtId)
    if (debt) {
      setSelectedDebt(debt)
      setSelectedEvent(event)
      setIsCalendarEventOpen(true)
    }
  }

  // Get upcoming payments (next 7 days)
  const upcomingPayments = calendarEvents
    .filter((event) => event.type === "payment" && event.status !== "pagado")
    .slice(0, 5)

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 md:p-6">
      {/* Deuda Total Section */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <CreditCard className="h-12 w-12 text-red-600 mr-4" />
                <div>
                  <h2 className="text-xl font-medium text-muted-foreground">Deuda Total</h2>
                  <p className="text-4xl font-bold">
                    {totalDebt.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleMakePayment()} className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Registrar Pago
                </Button>
                <Button onClick={() => setIsAddDebtOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Deuda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Análisis de Deudas and Actividad Reciente side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Análisis de Deudas Section - Left side (wider) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Análisis de Deudas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resumen de deuda */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Deuda</CardTitle>
                <CardDescription>Estadísticas clave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Interés Mensual Total</p>
                      <p className="text-xl font-bold text-red-600">
                        {totalMonthlyInterest.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(totalMonthlyInterest * 12).toLocaleString("es-MX", { style: "currency", currency: "MXN" })} al
                        año
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Ratio Deuda/Ingresos</p>
                      <div className="flex items-center">
                        <p className="text-xl font-bold text-blue-600">36%</p>
                        <TrendingDown className="h-4 w-4 ml-2 text-green-600" />
                        <span className="text-xs text-green-600 ml-1">-2% este mes</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Recomendado: menos del 36%</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">Tiempo estimado para estar libre de deudas</p>
                    <p className="text-lg font-bold">5 años y 3 meses</p>
                    <p className="text-xs text-muted-foreground">Con pagos mínimos actuales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen de pagos */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Pagos</CardTitle>
                <CardDescription>Pagos mensuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pagos Mensuales Totales</span>
                      <span className="font-medium">
                        {totalMonthlyPayments.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Intereses Mensuales</span>
                      <span className="font-medium text-red-600">
                        {totalMonthlyInterest.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Principal Mensual</span>
                      <span className="font-medium text-green-600">
                        {(totalMonthlyPayments - totalMonthlyInterest).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Próximos Pagos</p>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto">
                      {upcomingPayments.length > 0 ? (
                        upcomingPayments.map((event) => {
                          const debt = debtData.find((d) => d.id === event.debtId)
                          if (!debt) return null

                          return (
                            <div
                              key={event.id}
                              className="flex justify-between items-center text-sm cursor-pointer hover:bg-muted p-1 rounded"
                              onClick={() => handleCalendarEventClick(event)}
                            >
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className="mr-2"
                                  style={{ borderColor: debt.color, color: debt.color }}
                                >
                                  {format(event.date, "dd", { locale: es })}
                                </Badge>
                                <span>{debt.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="block font-medium">
                                  {event.amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {format(event.date, "dd MMM", { locale: es })}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay pagos próximos en los siguientes 7 días.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribución de deudas */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Deudas</CardTitle>
                <CardDescription>Por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <DebtPieChart data={debtCategoriesData} />
                </div>
              </CardContent>
            </Card>

            {/* Tendencia de deudas */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Deudas</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <DebtLineChart data={monthlyDebtData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actividad reciente - Right side (narrower) */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Últimos Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => {
                  const debt = debtData.find((d) => d.id === payment.debtId)

                  return (
                    <div key={payment.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                        <Avatar className="bg-green-100">
                          <AvatarFallback className="text-green-700">P</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(payment.date, "dd MMM yyyy", { locale: es })} • {debt?.name}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {payment.amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todos los pagos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Main Content - Debts */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Mis Deudas</h2>
          <div className="flex gap-2">
            <Button
              variant={activeView === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("list")}
            >
              Lista
            </Button>
            <Button
              variant={activeView === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Calendario
            </Button>
          </div>
        </div>

        <DebtFilters
          filter={filter}
          onFilterChange={setFilter}
          totalCount={debtData.length}
          filteredCount={filteredDebts.length}
        />

        {activeView === "list" ? (
          <div className="space-y-6">
            <DebtCategorySection
              title="Servicios"
              debts={serviciosDebts}
              onViewDetails={handleViewDebtDetails}
              onMakePayment={handleMakePayment}
              onDeleteDebt={handleDeleteDebt}
            />

            <DebtCategorySection
              title="Tarjetas de Crédito"
              debts={tarjetasDebts}
              onViewDetails={handleViewDebtDetails}
              onMakePayment={handleMakePayment}
              onDeleteDebt={handleDeleteDebt}
            />

            <DebtCategorySection
              title="Préstamos"
              debts={prestamosDebts}
              onViewDetails={handleViewDebtDetails}
              onMakePayment={handleMakePayment}
              onDeleteDebt={handleDeleteDebt}
            />

            <DebtCategorySection
              title="Otros"
              debts={otrosDebts}
              onViewDetails={handleViewDebtDetails}
              onMakePayment={handleMakePayment}
              onDeleteDebt={handleDeleteDebt}
            />

            {filteredDebts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron deudas con los filtros seleccionados.</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        ) : (
          <DebtCalendar events={calendarEvents} onEventClick={handleCalendarEventClick} />
        )}
      </div>

      {/* Dialogs */}
      <AddDebtDialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen} />
      <MakePaymentDialog
        open={isMakePaymentOpen}
        onOpenChange={setIsMakePaymentOpen}
        debts={debtData}
        selectedDebtId={selectedDebt?.id}
      />

      {selectedDebt && (
        <>
          <DebtDetailsDialog
            debt={selectedDebt}
            payments={getDebtPayments(selectedDebt.id)}
            isOpen={isDebtDetailsOpen}
            onOpenChange={setIsDebtDetailsOpen}
            onMakePayment={handleMakePayment}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará la deuda "{selectedDebt.name}" y no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteDebt} className="bg-destructive text-destructive-foreground">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {selectedEvent && (
            <CalendarEventDialog
              event={selectedEvent}
              debt={selectedDebt}
              isOpen={isCalendarEventOpen}
              onOpenChange={setIsCalendarEventOpen}
              onMakePayment={handleMakePayment}
              onViewDetails={handleViewDebtDetails}
            />
          )}
        </>
      )}
    </div>
  )

  function resetFilters() {
    setFilter({
      categories: [],
      types: [],
      status: [],
      search: "",
      sortBy: "paymentDueDay",
      sortDirection: "asc",
    })
  }
}
