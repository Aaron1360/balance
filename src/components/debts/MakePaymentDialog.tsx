import React from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { DebtItem } from "@/types/debt"

interface MakePaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debts: DebtItem[]
  selectedDebtId?: string
}

export function MakePaymentDialog({ open, onOpenChange, debts, selectedDebtId }: MakePaymentDialogProps) {
  const [debtId, setDebtId] = useState(selectedDebtId || "")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [description, setDescription] = useState("")
  const [isPrincipalOnly, setIsPrincipalOnly] = useState(false)

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setDebtId(selectedDebtId || "")
      setAmount("")
      setDate(new Date())
      setDescription("")
      setIsPrincipalOnly(false)
    }
  }, [open, selectedDebtId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the payment to your data
    console.log({ debtId, amount, date, description, isPrincipalOnly })
    onOpenChange(false)
  }

  const selectedDebt = debts.find((debt) => debt.id === debtId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogDescription>Registra un pago para reducir tu deuda.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="debt-select" className="text-right">
                Deuda
              </Label>
              <Select value={debtId} onValueChange={setDebtId} required>
                <SelectTrigger id="debt-select" className="col-span-3">
                  <SelectValue placeholder="Seleccionar deuda" />
                </SelectTrigger>
                <SelectContent>
                  {debts.map((debt) => (
                    <SelectItem key={debt.id} value={debt.id}>
                      {debt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Monto
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  min="1"
                  step="100"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-date" className="text-right">
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="payment-date"
                    variant={"outline"}
                    className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Pago mensual"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1"></div>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="principal-only"
                  checked={isPrincipalOnly}
                  onCheckedChange={(checked) => setIsPrincipalOnly(checked === true)}
                />
                <Label htmlFor="principal-only" className="text-sm font-normal">
                  Aplicar solo al principal
                </Label>
              </div>
            </div>

            {selectedDebt && (
              <div className="grid grid-cols-4 gap-4 mt-2">
                <div className="col-span-1"></div>
                <div className="col-span-3 text-sm bg-muted p-3 rounded-md">
                  <p className="font-medium mb-1">{selectedDebt.name}</p>
                  <p className="text-muted-foreground">
                    Pago mínimo:{" "}
                    {selectedDebt.minimumPayment.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </p>
                  <p className="text-muted-foreground">
                    Saldo pendiente:{" "}
                    {selectedDebt.remainingAmount.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Registrar Pago</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
