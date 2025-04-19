import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Bell, DollarSign, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CalendarEvent, DebtItem } from "@/types/debt"

interface CalendarEventDialogProps {
  event: CalendarEvent | null
  debt: DebtItem | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onMakePayment: (debt: DebtItem) => void
  onViewDetails: (debt: DebtItem) => void
}

export function CalendarEventDialog({
  event,
  debt,
  isOpen,
  onOpenChange,
  onMakePayment,
  onViewDetails,
}: CalendarEventDialogProps) {
  if (!event || !debt) return null

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
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event.type === "payment" ? (
              <DollarSign className="h-5 w-5 text-amber-500" />
            ) : (
              <Bell className="h-5 w-5 text-blue-500" />
            )}
            {event.title}
          </DialogTitle>
          <DialogDescription>{event.type === "payment" ? "Pago programado" : "Recordatorio de pago"}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Fecha:</span>
            </div>
            <span className="font-medium">{format(event.date, "dd 'de' MMMM 'de' yyyy", { locale: es })}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Monto:</span>
            </div>
            <span className="font-medium">
              {event.amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Estado:</span>
            {getStatusBadge(event.status)}
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="font-medium">{debt.name}</p>
            <p className="text-sm text-muted-foreground">{debt.creditor}</p>
            <p className="text-sm text-muted-foreground">
              Saldo pendiente: {debt.remainingAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              onViewDetails(debt)
            }}
          >
            Ver Detalles
          </Button>
          {event.status !== "pagado" && (
            <Button
              onClick={() => {
                onOpenChange(false)
                onMakePayment(debt)
              }}
            >
              Registrar Pago
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
