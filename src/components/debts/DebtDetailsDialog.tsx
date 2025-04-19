import type React from "react"
import { useState } from "react"
import { format, addMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, CreditCard, DollarSign, Clock, Info, Landmark, Bell, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import type { DebtItem, DebtPayment } from "@/types/debt"

interface DebtDetailsDialogProps {
  debt: DebtItem | null
  payments: DebtPayment[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onMakePayment: (debt: DebtItem) => void
}

export function DebtDetailsDialog({ debt, payments, isOpen, onOpenChange, onMakePayment }: DebtDetailsDialogProps) {
  const [reminderEnabled, setReminderEnabled] = useState(debt?.reminderDays !== undefined)
  const [autoPayEnabled, setAutoPayEnabled] = useState(debt?.autoPayEnabled || false)

  if (!debt) return null

  const sortedPayments = [...payments].sort((a, b) => b.date.getTime() - a.date.getTime())
  const percentagePaid = Math.round(((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100)

  // Generate payment schedule (simplified)
  const generatePaymentSchedule = () => {
    const schedule = []
    let remainingBalance = debt.remainingAmount
    let currentDate = new Date()

    while (remainingBalance > 0) {
      const monthlyInterest = (remainingBalance * (debt.interestRate / 100)) / 12
      let principalPayment = debt.minimumPayment - monthlyInterest

      if (principalPayment > remainingBalance) {
        principalPayment = remainingBalance
      }

      const totalPayment = principalPayment + monthlyInterest
      remainingBalance -= principalPayment

      schedule.push({
        date: new Date(currentDate),
        payment: totalPayment,
        principal: principalPayment,
        interest: monthlyInterest,
        remainingBalance: remainingBalance,
      })

      if (schedule.length >= 24) break // Limit to 24 months for UI
      currentDate = addMonths(currentDate, 1)
    }

    return schedule
  }

  const paymentSchedule = generatePaymentSchedule()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pagado":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Pagado
          </Badge>
        )
      case "próximo":
        return (
          <Badge className="bg-amber-100 text-amber-800">
            <Clock className="mr-1 h-3 w-3" />
            Próximo
          </Badge>
        )
      case "vencido":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Vencido
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Info className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        )
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{debt.name}</span>
            {getStatusBadge(debt.paymentStatus)}
          </SheetTitle>
          <SheetDescription>{debt.creditor}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Información principal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{debt.name}</h3>
              <Badge variant="outline" style={{ borderColor: debt.color, color: debt.color }}>
                {debt.category}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso de Pago</span>
                <span className="font-medium">{percentagePaid}%</span>
              </div>
              <Progress
                value={percentagePaid}
                className="h-2"
                style={{ "--progress-indicator-color": debt.color } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {(debt.totalAmount - debt.remainingAmount).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </span>
                <span>
                  {debt.totalAmount.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detalles básicos */}
          <div className="space-y-3">
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Saldo Pendiente</p>
                <p className="text-lg font-bold">
                  {debt.remainingAmount.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CreditCard className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Pago Mínimo Mensual</p>
                <p className="text-sm">
                  {debt.minimumPayment.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Info className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Tasa de Interés</p>
                <p className="text-sm">{debt.interestRate}%</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Día de Pago</p>
                <p className="text-sm">{debt.paymentDueDay} de cada mes</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Fecha Estimada de Liquidación</p>
                <p className="text-sm">{format(debt.estimatedPayoffDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Landmark className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Acreedor</p>
                <p className="text-sm">{debt.creditor}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configuración */}
          <div className="space-y-3">
            <h4 className="font-semibold">Configuración</h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Recordatorios</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} id="reminder-switch" />
              </div>
            </div>

            {reminderEnabled && (
              <div className="pl-6 text-sm text-muted-foreground">
                Recordatorio {debt.reminderDays || 5} días antes del vencimiento
              </div>
            )}

            {debt.type !== "servicio" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Pago automático</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} id="autopay-switch" />
                </div>
              </div>
            )}

            {autoPayEnabled && (
              <div className="pl-6 text-sm text-muted-foreground">
                Se realizará el pago mínimo automáticamente en la fecha de vencimiento
              </div>
            )}
          </div>

          <Separator />

          {/* Tabs para diferentes vistas */}
          <Tabs defaultValue="payments">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments">Historial de Pagos</TabsTrigger>
              <TabsTrigger value="schedule">Calendario de Pagos</TabsTrigger>
            </TabsList>

            {/* Historial de pagos */}
            <TabsContent value="payments" className="space-y-4 mt-4">
              {sortedPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No hay pagos registrados para esta deuda.</p>
              ) : (
                <div className="space-y-4">
                  {sortedPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-4">
                        <Avatar className="bg-green-100">
                          <AvatarFallback className="text-green-700">P</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(payment.date, "dd MMM yyyy", { locale: es })}
                          </p>
                          {payment.paymentMethod && (
                            <p className="text-xs text-muted-foreground">{payment.paymentMethod}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-green-600 block">
                          {payment.amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                        </span>
                        {payment.confirmationNumber && (
                          <span className="text-xs text-muted-foreground block">#{payment.confirmationNumber}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Calendario de pagos */}
            <TabsContent value="schedule" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Proyección de Pagos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Pago</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interés</TableHead>
                          <TableHead>Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentSchedule.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{format(payment.date, "dd/MM/yyyy")}</TableCell>
                            <TableCell>
                              {payment.payment.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                maximumFractionDigits: 0,
                              })}
                            </TableCell>
                            <TableCell>
                              {payment.principal.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                maximumFractionDigits: 0,
                              })}
                            </TableCell>
                            <TableCell>
                              {payment.interest.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                maximumFractionDigits: 0,
                              })}
                            </TableCell>
                            <TableCell>
                              {payment.remainingBalance.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                                maximumFractionDigits: 0,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Notas */}
          {debt.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Notas</h4>
                <p className="text-sm text-muted-foreground">{debt.notes}</p>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={() => onMakePayment(debt)}>Registrar Pago</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
