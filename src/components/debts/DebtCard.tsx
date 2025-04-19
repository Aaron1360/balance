import type React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { differenceInDays } from "date-fns"
import {
  Trash2,
  ArrowRight,
  DollarSign,
  Calendar,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { DebtItem } from "@/types/debt"

interface DebtCardProps {
  debt: DebtItem
  onViewDetails: (debt: DebtItem) => void
  onMakePayment: (debt: DebtItem) => void
  onDeleteDebt: (debt: DebtItem) => void
}

export function DebtCard({ debt, onViewDetails, onMakePayment, onDeleteDebt }: DebtCardProps) {
  const percentage = Math.round(((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100)

  const getNextPaymentDate = (): Date => {
    const today = new Date()
    const nextPaymentDate = new Date(today.getFullYear(), today.getMonth(), debt.paymentDueDay)

    if (nextPaymentDate < today) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
    }

    return nextPaymentDate
  }

  const nextPaymentDate = getNextPaymentDate()
  const daysUntilPayment = differenceInDays(nextPaymentDate, new Date())

  const getStatusBadge = () => {
    switch (debt.paymentStatus) {
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
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  const getTypeIcon = () => {
    switch (debt.type) {
      case "préstamo":
        return <DollarSign className="h-4 w-4 mr-1" />
      case "tarjeta":
        return <CreditCard className="h-4 w-4 mr-1" />
      case "servicio":
        return <Bell className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${debt.paymentStatus === "vencido" ? "border-red-300" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {getTypeIcon()}
            {debt.name}
          </CardTitle>
          <div className="flex gap-1">
            {getStatusBadge()}
            <Badge variant="outline" className="font-normal" style={{ borderColor: debt.color, color: debt.color }}>
              {debt.category}
            </Badge>
          </div>
        </div>
        <CardDescription>
          {debt.creditor} {debt.interestRate > 0 && `• ${debt.interestRate}% interés`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Saldo: {debt.remainingAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</span>
            <span className="font-medium">{percentage}% pagado</span>
          </div>
          <Progress
            value={percentage}
            className="h-2"
            style={
              {
                "--progress-indicator-color": debt.color,
              } as React.CSSProperties
            }
          />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Pago Mensual</p>
              <p className="font-medium">
                {debt.minimumPayment.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Próximo Pago</p>
              <p className="font-medium flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {format(nextPaymentDate, "dd MMM", { locale: es })}
                <span className="ml-1 text-xs">
                  ({daysUntilPayment} {daysUntilPayment === 1 ? "día" : "días"})
                </span>
              </p>
            </div>
          </div>

          {debt.lastPaymentDate && debt.lastPaymentAmount && (
            <div className="text-xs text-muted-foreground">
              Último pago: {format(debt.lastPaymentDate, "dd MMM yyyy", { locale: es })} •
              {debt.lastPaymentAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => onMakePayment(debt)}>
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            Pagar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => onDeleteDebt(debt)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Eliminar
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onViewDetails(debt)}>
          Detalles
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
