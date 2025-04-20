import { CreditCard, DollarSign, Wallet, PiggyBank, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { ActivityType, ActivityStatus } from "@/types/activity"

interface ActivityFiltersProps {
  selectedTypes: ActivityType[]
  selectedStatuses: ActivityStatus[]
  onTypesChange: (types: ActivityType[]) => void
  onStatusesChange: (statuses: ActivityStatus[]) => void
}

export function ActivityFilters({
  selectedTypes,
  selectedStatuses,
  onTypesChange,
  onStatusesChange,
}: ActivityFiltersProps) {
  const handleTypeChange = (type: ActivityType, checked: boolean) => {
    if (checked) {
      onTypesChange([...selectedTypes, type])
    } else {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    }
  }

  const handleStatusChange = (status: ActivityStatus, checked: boolean) => {
    if (checked) {
      onStatusesChange([...selectedStatuses, status])
    } else {
      onStatusesChange(selectedStatuses.filter((s) => s !== status))
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tipo de Actividad</h3>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-transaction"
                checked={selectedTypes.includes("transaction")}
                onCheckedChange={(checked) => handleTypeChange("transaction", checked as boolean)}
              />
              <Label htmlFor="filter-transaction" className="flex items-center gap-2 text-sm font-normal">
                <CreditCard className="h-4 w-4 text-purple-500" />
                <span>Transacciones</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-debt-payment"
                checked={selectedTypes.includes("debt-payment")}
                onCheckedChange={(checked) => handleTypeChange("debt-payment", checked as boolean)}
              />
              <Label htmlFor="filter-debt-payment" className="flex items-center gap-2 text-sm font-normal">
                <DollarSign className="h-4 w-4 text-amber-500" />
                <span>Pagos de Deuda</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-service-payment"
                checked={selectedTypes.includes("service-payment")}
                onCheckedChange={(checked) => handleTypeChange("service-payment", checked as boolean)}
              />
              <Label htmlFor="filter-service-payment" className="flex items-center gap-2 text-sm font-normal">
                <Wallet className="h-4 w-4 text-green-500" />
                <span>Pagos de Servicio</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-savings-contribution"
                checked={selectedTypes.includes("savings-contribution")}
                onCheckedChange={(checked) => handleTypeChange("savings-contribution", checked as boolean)}
              />
              <Label htmlFor="filter-savings-contribution" className="flex items-center gap-2 text-sm font-normal">
                <PiggyBank className="h-4 w-4 text-blue-500" />
                <span>Aportes a Ahorro</span>
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estado</h3>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-completed"
                checked={selectedStatuses.includes("completed")}
                onCheckedChange={(checked) => handleStatusChange("completed", checked as boolean)}
              />
              <Label htmlFor="filter-completed" className="flex items-center gap-2 text-sm font-normal">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Completado</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-pending"
                checked={selectedStatuses.includes("pending")}
                onCheckedChange={(checked) => handleStatusChange("pending", checked as boolean)}
              />
              <Label htmlFor="filter-pending" className="flex items-center gap-2 text-sm font-normal">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Pendiente</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-overdue"
                checked={selectedStatuses.includes("overdue")}
                onCheckedChange={(checked) => handleStatusChange("overdue", checked as boolean)}
              />
              <Label htmlFor="filter-overdue" className="flex items-center gap-2 text-sm font-normal">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Vencido</span>
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
