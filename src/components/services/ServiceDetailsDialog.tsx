import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, CreditCard, Clock, Info, CheckCircle, PauseCircle, XCircle, Receipt, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import type { Service, ServicePayment } from "@/types/service"

interface ServiceDetailsDialogProps {
  service: Service | null
  payments: ServicePayment[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (service: Service) => void
}

export function ServiceDetailsDialog({ service, payments, isOpen, onOpenChange, onEdit }: ServiceDetailsDialogProps) {
  if (!service) return null

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

  const getAnnualCost = () => {
    switch (service.frequency) {
      case "monthly":
        return service.cost * 12
      case "bimonthly":
        return service.cost * 6
      case "quarterly":
        return service.cost * 4
      case "semiannual":
        return service.cost * 2
      case "annual":
        return service.cost
      case "custom":
        if (service.customFrequencyDays) {
          return service.cost * (365 / service.customFrequencyDays)
        }
        return service.cost
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8" style={{ backgroundColor: service.color || "#e2e8f0" }}>
                <AvatarFallback>{getInitials(service.name)}</AvatarFallback>
              </Avatar>
              <span>{service.name}</span>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </SheetTitle>
          <SheetDescription className="capitalize">{service.category}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Información principal */}
          <div className="space-y-3">
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Costo</p>
                <p className="text-lg font-bold">
                  {service.cost.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </p>
                <p className="text-xs text-muted-foreground">{getFrequencyText()}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Próximo pago</p>
                <p className="text-sm">{format(service.nextPaymentDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
              </div>
            </div>

            {service.paymentMethod && (
              <div className="flex items-start">
                <Receipt className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Método de pago</p>
                  <p className="text-sm capitalize">{service.paymentMethod}</p>
                </div>
              </div>
            )}

            {service.autoRenewal !== undefined && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Renovación automática</p>
                  <p className="text-sm">{service.autoRenewal ? "Activada" : "Desactivada"}</p>
                </div>
              </div>
            )}

            {service.description && (
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Descripción</p>
                  <p className="text-sm">{service.description}</p>
                </div>
              </div>
            )}
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
                <Switch checked={!!service.reminderDays} id="reminder-switch" />
              </div>
            </div>

            {service.reminderDays && (
              <div className="pl-6 text-sm text-muted-foreground">
                Recordatorio {service.reminderDays} días antes del vencimiento
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Costo anual estimado</p>
              <p className="text-lg font-bold">
                {getAnnualCost().toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Tabs para diferentes vistas */}
          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="history">Historial de Pagos</TabsTrigger>
            </TabsList>

            {/* Historial de pagos */}
            <TabsContent value="history" className="space-y-4 mt-4">
              {payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No hay pagos registrados para este servicio.</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-4">
                        <Avatar className="bg-green-100">
                          <AvatarFallback className="text-green-700">P</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {format(payment.date, "dd MMM yyyy", { locale: es })}
                          </p>
                          {payment.paymentMethod && (
                            <p className="text-xs text-muted-foreground capitalize">{payment.paymentMethod}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-green-600 block">
                          {payment.amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                        </span>
                        {payment.reference && (
                          <span className="text-xs text-muted-foreground block">#{payment.reference}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={() => onEdit(service)}>Editar</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
