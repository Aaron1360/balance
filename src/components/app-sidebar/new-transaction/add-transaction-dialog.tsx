"use client"

import { useState, useEffect } from "react"
import { Plus, CalendarIcon, CheckCircle2, XCircle, TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format, addDays, addWeeks, addMonths } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Definición del tipo Income
export type Income = {
  id: string
  date: Date
  description: string
  category: string
  paymentMethod: string
  paymentType: string
  amount: number
  reference?: string
  state?: string
  notes?: string
  tags?: string[]
}

export function AddTransactionDialog() {
  // Form States
  const [date, setDate] = useState<Date>()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentType, setPaymentType] = useState("unica")
  const [reference, setReference] = useState("")
  const [state, setState] = useState("completado")
  const [notes, setNotes] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // Estados para pagos diferidos
  const [numPayments, setNumPayments] = useState(3)
  const [paymentFrequency, setPaymentFrequency] = useState("mensual")
  const [installments, setInstallments] = useState<Array<{ date: Date; amount: number; paid: boolean }>>([])

  // Función para añadir etiquetas
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  // Función para eliminar etiquetas
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Función para crear un nuevo ingreso
  const createIncome = (): Income => {
    return {
      id: Date.now().toString(), // Generamos un ID temporal basado en la fecha
      date: date || new Date(),
      description,
      amount: Math.abs(amount), // Aseguramos que sea positivo
      category,
      paymentMethod,
      paymentType,
      reference,
      state,
      notes,
      tags,
    }
  }

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    const newIncome = createIncome()
    console.log("Nuevo ingreso:", newIncome)
    // Aquí iría la lógica para guardar el ingreso

    // Resetear el formulario
    setDate(undefined)
    setDescription("")
    setAmount(0)
    setCategory("")
    setPaymentMethod("")
    setPaymentType("unica")
    setNumPayments(3)
    setPaymentFrequency("mensual")
    setReference("")
    setState("completado")
    setNotes("")
    setTags([])
    setTagInput("")
  }

  // Calcular las cuotas cuando cambian los parámetros relevantes
  useEffect(() => {
    if (paymentType === "diferido" && date && numPayments > 0 && amount > 0) {
      const newInstallments = []
      const amountPerInstallment = amount / numPayments

      for (let i = 0; i < numPayments; i++) {
        let installmentDate = new Date(date)

        if (paymentFrequency === "mensual") {
          installmentDate = addMonths(installmentDate, i)
        } else if (paymentFrequency === "quincenal") {
          installmentDate = addDays(installmentDate, i * 15)
        } else if (paymentFrequency === "semanal") {
          installmentDate = addWeeks(installmentDate, i)
        }

        newInstallments.push({
          date: installmentDate,
          amount: amountPerInstallment,
          paid: i === 0, // Primera cuota se considera pagada
        })
      }

      setInstallments(newInstallments)
    }
  }, [paymentType, date, numPayments, paymentFrequency, amount])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir Ingreso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir Ingreso</DialogTitle>
          <DialogDescription>Ingresa los detalles de tu ingreso a continuación.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-2">
          {/* Primera fila: Cantidad y Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="cantidad" className="text-right">
                Cantidad
              </Label>
              <Input
                id="cantidad"
                type="number"
                placeholder="0.00"
                className="col-span-3"
                step="0.01"
                min="0"
                value={amount || ""}
                onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="fecha" className="text-right">
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="fecha"
                    variant={"outline"}
                    className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "DD/MM/AAAA"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Segunda fila: Forma de pago y Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="forma-pago" className="text-right">
                Forma de pago
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="forma-pago" className="col-span-3">
                  <SelectValue placeholder="Seleccionar forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <RadioGroup
                defaultValue="unica"
                className="col-span-3 flex gap-4"
                value={paymentType}
                onValueChange={setPaymentType}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unica" id="unica" />
                  <Label htmlFor="unica" className="font-normal">
                    Única exhibición
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diferido" id="diferido" />
                  <Label htmlFor="diferido" className="font-normal">
                    Diferido
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Campos adicionales para pago diferido */}
          {paymentType === "diferido" && (
            <>
              {/* Fila: Número de pagos y Frecuencia */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="num-pagos" className="text-right">
                    Número de pagos
                  </Label>
                  <Input
                    id="num-pagos"
                    type="number"
                    className="col-span-3"
                    min="2"
                    max="36"
                    value={numPayments}
                    onChange={(e) => setNumPayments(Number.parseInt(e.target.value) || 3)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="frecuencia" className="text-right">
                    Frecuencia
                  </Label>
                  <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                    <SelectTrigger id="frecuencia" className="col-span-3">
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="quincenal">Quincenal</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pagos pendientes */}
              {installments.length > 0 && (
                <Card className="col-span-2">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium mb-2 block">Pagos pendientes</Label>
                    <div className="max-h-[200px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Fecha</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead className="text-right">Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {installments.map((installment, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{format(installment.date, "dd/MM/yyyy")}</TableCell>
                              <TableCell>
                                {installment.amount.toLocaleString("es-MX", {
                                  style: "currency",
                                  currency: "MXN",
                                })}
                              </TableCell>
                              <TableCell className="text-right">
                                {installment.paid ? (
                                  <span className="flex items-center justify-end text-green-600">
                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Pagado
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-end text-amber-600">
                                    <XCircle className="h-4 w-4 mr-1" /> Pendiente
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Tercera fila: Descripción y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                id="descripcion"
                placeholder="Breve concepto del ingreso"
                className="col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="categoria" className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salario">Salario</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Inversiones">Inversiones</SelectItem>
                  <SelectItem value="Reembolso">Reembolso</SelectItem>
                  <SelectItem value="Regalo">Regalo</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cuarta fila: Referencia y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="referencia" className="text-right">
                Referencia
              </Label>
              <Input
                id="referencia"
                placeholder="Número de referencia"
                className="col-span-3"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="estado" className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quinta fila: Etiquetas */}
          <div className="grid grid-cols-8 items-center gap-2">
            <Label htmlFor="etiquetas" className="text-right col-span-1">
              Etiquetas
            </Label>
            <div className="col-span-7 flex items-center gap-2">
              <Input
                id="etiquetas"
                placeholder="Añadir etiqueta"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" size="sm" onClick={handleAddTag}>
                <TagIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mostrar etiquetas */}
          {tags.length > 0 && (
            <div className="grid grid-cols-8 items-start gap-2">
              <div className="col-span-1"></div>
              <div className="col-span-7 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sexta fila: Notas */}
          <div className="grid grid-cols-8 items-start gap-2">
            <Label htmlFor="notas" className="text-right col-span-1 mt-2">
              Notas
            </Label>
            <Textarea
              id="notas"
              placeholder="Observaciones relevantes"
              className="col-span-7"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleSubmit}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
