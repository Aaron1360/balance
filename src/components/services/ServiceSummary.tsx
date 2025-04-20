import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CreditCard, Calendar, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Service } from "@/types/service"

interface ServiceSummaryProps {
  totalMonthlyCost: number
  nextPayment: Service | null
  upcomingCount: number
  onAddService: () => void
}

export function ServiceSummary({ totalMonthlyCost, nextPayment, upcomingCount, onAddService }: ServiceSummaryProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <CreditCard className="h-12 w-12 text-blue-600 mr-4" />
            <div>
              <h2 className="text-xl font-medium text-muted-foreground">Gasto Mensual en Servicios</h2>
              <p className="text-4xl font-bold">
                {totalMonthlyCost.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {nextPayment && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Próximo pago: {format(nextPayment.nextPaymentDate, "dd MMM", { locale: es })}</span>
                </Badge>
                <Badge>{nextPayment.name}</Badge>
              </div>
            )}

            {upcomingCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                <span>{upcomingCount} pagos en los próximos 7 días</span>
              </Badge>
            )}

            <Button onClick={onAddService} className="mt-2">
              Añadir Servicio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
