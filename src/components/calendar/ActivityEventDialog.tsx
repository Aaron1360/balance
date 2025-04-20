import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CreditCard, DollarSign, Wallet, PiggyBank, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { ActivityCalendarEvent } from "@/types/activity"

interface ActivityEventDialogProps {
  event: ActivityCalendarEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkAsCompleted?: (event: ActivityCalendarEvent) => void
}

export function ActivityEventDialog({ event, open, onOpenChange, onMarkAsCompleted }: ActivityEventDialogProps) {
  if (!event) return null

  const getEventIcon = () => {
    switch (event.type) {
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

  const getStatusIcon = () => {
    switch (event.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (event.status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getEventTypeLabel = () => {
    switch (event.type) {
      case "transaction":
        return "Transacción"
      case "debt-payment":
        return "Pago de Deuda"
      case "service-payment":
        return "Pago de Servicio"
      case "savings-contribution":
        return "Aporte a Ahorro"
      default:
        return "Actividad"
    }
  }

  const getStatusLabel = () => {
    switch (event.status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "overdue":
        return "Vencido"
      default:
        return "Desconocido"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getEventIcon()}
            {event.title}
          </DialogTitle>
          <DialogDescription>
            Detalles de la actividad del {format(new Date(event.date), "d 'de' MMMM, yyyy", { locale: es })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className={getStatusColor()}>
              <span className="flex items-center gap-1">
                {getStatusIcon()}
                {getStatusLabel()}
              </span>
            </Badge>
            <Badge variant="outline">{getEventTypeLabel()}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monto</p>
              <p className="text-lg font-semibold">${event.amount.toLocaleString("es-MX")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categoría</p>
              <p className="text-lg">{event.category}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Descripción</p>
            <p className="text-sm mt-1">{event.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Fecha</p>
            <p className="text-sm mt-1">{format(new Date(event.date), "d 'de' MMMM, yyyy", { locale: es })}</p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {event.status !== "completed" && onMarkAsCompleted && (
            <Button onClick={() => onMarkAsCompleted(event)} className="w-full sm:w-auto">
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como completado
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
