import type React from "react"
import { useState } from "react"
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
import { cn } from "@/lib/utils"

interface AddDebtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDebtDialog({ open, onOpenChange }: AddDebtDialogProps) {
  const [name, setName] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [minimumPayment, setMinimumPayment] = useState("")
  const [paymentDueDay, setPaymentDueDay] = useState("")
  const [category, setCategory] = useState("")
  const [creditor, setCreditor] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the new debt to your data
    console.log({
      name,
      totalAmount,
      interestRate,
      minimumPayment,
      paymentDueDay,
      category,
      creditor,
      startDate,
      notes,
    })
    onOpenChange(false)

    // Reset form
    setName("")
    setTotalAmount("")
    setInterestRate("")
    setMinimumPayment("")
    setPaymentDueDay("")
    setCategory("")
    setCreditor("")
    setStartDate(undefined)
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Deuda</DialogTitle>
          <DialogDescription>Ingresa los detalles de tu deuda para comenzar a rastrearla.</DialogDescription>
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
                placeholder="Ej: Préstamo Hipotecario"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="creditor" className="text-right">
                Acreedor
              </Label>
              <Input
                id="creditor"
                value={creditor}
                onChange={(e) => setCreditor(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Banco Nacional"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total-amount" className="text-right">
                Monto Total
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="total-amount"
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="pl-7"
                  min="1"
                  step="100"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interest-rate" className="text-right">
                Tasa de Interés
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="pr-7"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minimum-payment" className="text-right">
                Pago Mínimo
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="minimum-payment"
                  type="number"
                  value={minimumPayment}
                  onChange={(e) => setMinimumPayment(e.target.value)}
                  className="pl-7"
                  min="1"
                  step="100"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-due-day" className="text-right">
                Día de Pago
              </Label>
              <Input
                id="payment-due-day"
                type="number"
                value={paymentDueDay}
                onChange={(e) => setPaymentDueDay(e.target.value)}
                className="col-span-3"
                min="1"
                max="31"
                placeholder="Ej: 15"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hipoteca">Hipoteca</SelectItem>
                  <SelectItem value="Automóvil">Automóvil</SelectItem>
                  <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="Préstamo Personal">Préstamo Personal</SelectItem>
                  <SelectItem value="Préstamo Estudiantil">Préstamo Estudiantil</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                Fecha de Inicio
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notas
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="Detalles adicionales sobre esta deuda"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Deuda</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
