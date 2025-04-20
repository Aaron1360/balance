import type React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { Service, ServiceCategory, ServiceFrequency, PaymentMethod, ServiceStatus } from "@/types/service"

interface AddEditServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service
  onSave: (service: Partial<Service>) => void
}

export function AddEditServiceDialog({ open, onOpenChange, service, onSave }: AddEditServiceDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ServiceCategory>("servicio básico")
  const [cost, setCost] = useState("")
  const [frequency, setFrequency] = useState<ServiceFrequency>("monthly")
  const [customFrequencyDays, setCustomFrequencyDays] = useState("")
  const [nextPaymentDate, setNextPaymentDate] = useState<Date>(new Date())
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | string>("")
  const [status, setStatus] = useState<ServiceStatus>("active")
  const [description, setDescription] = useState("")
  const [autoRenewal, setAutoRenewal] = useState(false)
  const [reminderDays, setReminderDays] = useState("")
  const [tags, setTags] = useState("")

  // Update form when service changes
  useEffect(() => {
    if (service) {
      setName(service.name)
      setCategory(service.category)
      setCost(service.cost.toString())
      setFrequency(service.frequency)
      setCustomFrequencyDays(service.customFrequencyDays?.toString() || "")
      setNextPaymentDate(service.nextPaymentDate)
      setPaymentMethod(service.paymentMethod || "")
      setStatus(service.status)
      setDescription(service.description || "")
      setAutoRenewal(service.autoRenewal || false)
      setReminderDays(service.reminderDays?.toString() || "")
      setTags(service.tags?.join(", ") || "")
    } else {
      resetForm()
    }
  }, [service, open])

  const resetForm = () => {
    setName("")
    setCategory("servicio básico")
    setCost("")
    setFrequency("monthly")
    setCustomFrequencyDays("")
    setNextPaymentDate(new Date())
    setPaymentMethod("")
    setStatus("active")
    setDescription("")
    setAutoRenewal(false)
    setReminderDays("")
    setTags("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData: Partial<Service> = {
      name,
      category,
      cost: Number.parseFloat(cost),
      frequency,
      nextPaymentDate,
      status,
    }

    if (frequency === "custom" && customFrequencyDays) {
      formData.customFrequencyDays = Number.parseInt(customFrequencyDays)
    }

    if (paymentMethod) {
      formData.paymentMethod = paymentMethod as PaymentMethod
    }

    if (description) {
      formData.description = description
    }

    formData.autoRenewal = autoRenewal

    if (reminderDays) {
      formData.reminderDays = Number.parseInt(reminderDays)
    }

    if (tags) {
      formData.tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    }

    if (service) {
      formData.id = service.id
      formData.color = service.color
    }

    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{service ? "Editar Servicio" : "Añadir Nuevo Servicio"}</DialogTitle>
          <DialogDescription>
            {service
              ? "Modifica los detalles del servicio existente."
              : "Ingresa los detalles del nuevo servicio para comenzar a rastrearlo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Netflix"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ServiceCategory)} required>
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="servicio básico">Servicio básico</SelectItem>
                  <SelectItem value="streaming">Streaming</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="suscripción">Suscripción</SelectItem>
                  <SelectItem value="membresía">Membresía</SelectItem>
                  <SelectItem value="seguro">Seguro</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Costo
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="pl-7"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frecuencia
              </Label>
              <Select value={frequency} onValueChange={(value) => setFrequency(value as ServiceFrequency)} required>
                <SelectTrigger id="frequency" className="col-span-3">
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="bimonthly">Bimestral</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="semiannual">Semestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency === "custom" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-days" className="text-right">
                  Días
                </Label>
                <Input
                  id="custom-days"
                  type="number"
                  value={customFrequencyDays}
                  onChange={(e) => setCustomFrequencyDays(e.target.value)}
                  className="col-span-3"
                  min="1"
                  placeholder="Número de días entre pagos"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="next-payment" className="text-right">
                Próximo pago
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="next-payment"
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !nextPaymentDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextPaymentDate ? format(nextPaymentDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={nextPaymentDate}
                    onSelect={(date) => date && setNextPaymentDate(date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-method" className="text-right">
                Método de pago
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method" className="col-span-3">
                  <SelectValue placeholder="Seleccionar método (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguno">Ninguno</SelectItem>
                  <SelectItem value="tarjeta de crédito">Tarjeta de crédito</SelectItem>
                  <SelectItem value="tarjeta de débito">Tarjeta de débito</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="domiciliación">Domiciliación</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ServiceStatus)} required>
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                  <SelectItem value="canceled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="auto-renewal" className="text-right">
                Renovación automática
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="auto-renewal" checked={autoRenewal} onCheckedChange={setAutoRenewal} />
                <Label htmlFor="auto-renewal" className="font-normal">
                  {autoRenewal ? "Activada" : "Desactivada"}
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminder-days" className="text-right">
                Recordatorio (días)
              </Label>
              <Input
                id="reminder-days"
                type="number"
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                className="col-span-3"
                min="0"
                placeholder="Días antes del vencimiento (opcional)"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={2}
                placeholder="Detalles adicionales (opcional)"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Etiquetas
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="col-span-3"
                placeholder="Separadas por comas (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{service ? "Guardar cambios" : "Añadir servicio"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
