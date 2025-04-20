import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { Edit, Trash2, CreditCard, Calendar, Clock, CheckCircle, PauseCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Service } from "@/types/service"

interface ServiceCardProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onViewDetails: (service: Service) => void
}

export function ServiceCard({ service, onEdit, onDelete, onViewDetails }: ServiceCardProps) {
  const daysUntilPayment = differenceInDays(service.nextPaymentDate, new Date())

  const getStatusIcon = () => {
    switch (service.status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "paused":
        return <PauseCircle className="h-4 w-4 text-amber-500" />
      case "canceled":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (service.status) {
      case "active":
        return "Activo"
      case "paused":
        return "Pausado"
      case "canceled":
        return "Cancelado"
    }
  }

  const getFrequencyText = () => {
    switch (service.frequency) {
      case "monthly":
        return "Mensual"
      case "bimonthly":
        return "Bimestral"
      case "quarterly":
        return "Trimestral"
      case "semiannual":
        return "Semestral"
      case "annual":
        return "Anual"
      case "custom":
        return service.customFrequencyDays ? `Cada ${service.customFrequencyDays} días` : "Personalizado"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getPaymentMethodIcon = () => {
    if (!service.paymentMethod) return null

    switch (service.paymentMethod) {
      case "tarjeta de crédito":
      case "tarjeta de débito":
        return <CreditCard className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  const getPaymentBadgeColor = () => {
    if (daysUntilPayment < 0) return "bg-red-100 text-red-800"
    if (daysUntilPayment <= 3) return "bg-amber-100 text-amber-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${service.status === "paused" ? "opacity-75" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8" style={{ backgroundColor: service.color || "#e2e8f0" }}>
              <AvatarFallback>{getInitials(service.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{service.name}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Badge variant="outline" className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="capitalize">
              {service.category}
            </Badge>
            <div className="text-right">
              <p className="text-sm font-medium">
                {service.cost.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
              <p className="text-xs text-muted-foreground">{getFrequencyText()}</p>
            </div>
          </div>

          {service.status === "active" && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Próximo pago:</span>
              </div>
              <Badge className={getPaymentBadgeColor()}>
                <Clock className="h-3 w-3 mr-1" />
                {format(service.nextPaymentDate, "dd MMM", { locale: es })}
                <span className="ml-1 text-xs">
                  ({daysUntilPayment < 0 ? "Vencido" : daysUntilPayment === 0 ? "Hoy" : `${daysUntilPayment} días`})
                </span>
              </Badge>
            </div>
          )}

          {service.paymentMethod && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Método de pago:</span>
              <span className="flex items-center capitalize">
                {getPaymentMethodIcon()}
                {service.paymentMethod}
              </span>
            </div>
          )}

          {service.description && <p className="text-xs text-muted-foreground">{service.description}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => onEdit(service)}>
            <Edit className="h-3.5 w-3.5 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => onDelete(service)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Eliminar
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onViewDetails(service)}>
          Detalles
        </Button>
      </CardFooter>
    </Card>
  )
}
