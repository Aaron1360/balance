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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Definición del tipo outcome
export type Outcome = {
  date: Date
  description: string
  category: string
  payment_method: string
  payment_type: string
  amount: number
  merchant: string
  status: string
  reference?: string
  msi?: number
  notes?: string
  tags?: string[]
}

export function AddTransactionDialog() {
  // Estados para la pestaña de ingresos
  const [incomeDate, setIncomeDate] = useState<Date>()
  const [incomeDescription, setIncomeDescription] = useState("")
  const [incomeAmount, setIncomeAmount] = useState(0)
  const [incomeCategory, setIncomeCategory] = useState("")
  const [incomePaymentMethod, setIncomePaymentMethod] = useState("")
  const [incomePaymentType, setIncomePaymentType] = useState("unica")
  const [incomeReference, setIncomeReference] = useState("")
  const [incomeState, setIncomeState] = useState("completado")
  const [incomeNotes, setIncomeNotes] = useState("")
  const [incomeTags, setIncomeTags] = useState<string[]>([])
  const [incomeTagInput, setIncomeTagInput] = useState("")

  // Estados para pagos diferidos
  const [numPayments, setNumPayments] = useState(3)
  const [paymentFrequency, setPaymentFrequency] = useState("mensual")
  const [installments, setInstallments] = useState<Array<{ date: Date; amount: number; paid: boolean }>>([])

  // Estados para la pestaña de gastos
  const [expenseDate, setExpenseDate] = useState<Date>()
  const [expenseDescription, setExpenseDescription] = useState("")
  const [expenseAmount, setExpenseAmount] = useState(0)
  const [expenseCategory, setExpenseCategory] = useState("")
  const [expensePaymentMethod, setExpensePaymentMethod] = useState("")
  const [expensePaymentType, setExpensePaymentType] = useState("unica")
  const [expenseMerchant, setExpenseMerchant] = useState("")
  const [expenseMsi, setExpenseMsi] = useState<number | null>(null)
  const [expenseReference, setExpenseReference] = useState("")
  const [expenseStatus, setExpenseStatus] = useState("completado")
  const [expenseNotes, setExpenseNotes] = useState("")
  const [expenseTags, setExpenseTags] = useState<string[]>([])
  const [expenseTagInput, setExpenseTagInput] = useState("")

  // Funciones para manejar etiquetas en la pestaña de ingresos
  const handleAddIncomeTag = () => {
    if (incomeTagInput.trim() && !incomeTags.includes(incomeTagInput.trim())) {
      setIncomeTags([...incomeTags, incomeTagInput.trim()])
      setIncomeTagInput("")
    }
  }

  const handleRemoveIncomeTag = (tagToRemove: string) => {
    setIncomeTags(incomeTags.filter((tag) => tag !== tagToRemove))
  }

  // Funciones para manejar etiquetas en la pestaña de gastos
  const handleAddExpenseTag = () => {
    if (expenseTagInput.trim() && !expenseTags.includes(expenseTagInput.trim())) {
      setExpenseTags([...expenseTags, expenseTagInput.trim()])
      setExpenseTagInput("")
    }
  }

  const handleRemoveExpenseTag = (tagToRemove: string) => {
    setExpenseTags(expenseTags.filter((tag) => tag !== tagToRemove))
  }

  // Función para crear un nuevo ingreso
  const createIncome = (): Income => {
    return {
      id: Date.now().toString(), // Generamos un ID temporal basado en la fecha
      date: incomeDate || new Date(),
      description: incomeDescription,
      amount: Math.abs(incomeAmount), // Aseguramos que sea positivo
      category: incomeCategory,
      paymentMethod: incomePaymentMethod,
      paymentType: incomePaymentType,
      reference: incomeReference,
      state: incomeState,
      notes: incomeNotes,
      tags: incomeTags,
    }
  }

  // Función para crear un nuevo gasto
  const createExpense = (): Outcome => {
    return {
      date: expenseDate || new Date(),
      description: expenseDescription,
      amount: -Math.abs(expenseAmount), // Aseguramos que sea negativo para gastos
      category: expenseCategory,
      payment_method: expensePaymentMethod,
      payment_type: expensePaymentType,
      merchant: expenseMerchant,
      status: expenseStatus,
      reference: expenseReference,
      msi: expenseMsi || undefined,
      notes: expenseNotes,
      tags: expenseTags,
    }
  }

  // Función para manejar el envío del formulario de ingresos
  const handleIncomeSubmit = () => {
    const newIncome = createIncome()
    console.log("Nuevo ingreso:", newIncome)
    // Aquí iría la lógica para guardar el ingreso

    // Resetear el formulario
    setIncomeDate(undefined)
    setIncomeDescription("")
    setIncomeAmount(0)
    setIncomeCategory("")
    setIncomePaymentMethod("")
    setIncomePaymentType("unica")
    setNumPayments(3)
    setPaymentFrequency("mensual")
    setIncomeReference("")
    setIncomeState("completado")
    setIncomeNotes("")
    setIncomeTags([])
    setIncomeTagInput("")
  }

  // Función para manejar el envío del formulario de gastos
  const handleExpenseSubmit = () => {
    const newExpense = createExpense()
    console.log("Nuevo gasto:", newExpense)
    // Aquí iría la lógica para guardar el gasto

    // Resetear el formulario
    setExpenseDate(undefined)
    setExpenseDescription("")
    setExpenseAmount(0)
    setExpenseCategory("")
    setExpensePaymentMethod("")
    setExpensePaymentType("unica")
    setExpenseMerchant("")
    setExpenseMsi(null)
    setExpenseReference("")
    setExpenseStatus("completado")
    setExpenseNotes("")
    setExpenseTags([])
    setExpenseTagInput("")
  }

  // Calcular las cuotas cuando cambian los parámetros relevantes
  useEffect(() => {
    if (incomePaymentType === "diferido" && incomeDate && numPayments > 0 && incomeAmount > 0) {
      const newInstallments = []
      const amountPerInstallment = incomeAmount / numPayments

      for (let i = 0; i < numPayments; i++) {
        let installmentDate = new Date(incomeDate)

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
  }, [incomePaymentType, incomeDate, numPayments, paymentFrequency, incomeAmount])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir Transacción</DialogTitle>
          <DialogDescription>Ingresa los detalles de tu transacción a continuación.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="income" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="income">Ingreso</TabsTrigger>
            <TabsTrigger value="expense">Gasto</TabsTrigger>
          </TabsList>

          {/* Pestaña de Ingresos */}
          <TabsContent value="income">
            <form className="grid gap-4 py-2">
              {/* Primera fila: Cantidad y Fecha */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="income-cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    id="income-cantidad"
                    type="number"
                    placeholder="0.00"
                    className="col-span-3"
                    step="0.01"
                    min="0"
                    value={incomeAmount || ""}
                    onChange={(e) => setIncomeAmount(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="income-fecha" className="text-right">
                    Fecha
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="income-fecha"
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !incomeDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {incomeDate ? format(incomeDate, "dd/MM/yyyy") : "DD/MM/AAAA"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="bottom">
                      <Calendar mode="single" selected={incomeDate} onSelect={setIncomeDate} locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Segunda fila: Forma de pago y Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="income-forma-pago" className="text-right">
                    Forma de pago
                  </Label>
                  <Select value={incomePaymentMethod} onValueChange={setIncomePaymentMethod}>
                    <SelectTrigger id="income-forma-pago" className="col-span-3">
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
                  <Label htmlFor="income-tipo" className="text-right">
                    Tipo
                  </Label>
                  <RadioGroup
                    defaultValue="unica"
                    className="col-span-3 flex gap-4"
                    value={incomePaymentType}
                    onValueChange={setIncomePaymentType}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unica" id="income-unica" />
                      <Label htmlFor="income-unica" className="font-normal">
                        Única exhibición
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diferido" id="income-diferido" />
                      <Label htmlFor="income-diferido" className="font-normal">
                        Diferido
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Campos adicionales para pago diferido */}
              {incomePaymentType === "diferido" && (
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
                                  <TableCell className="font-medium">
                                    {format(installment.date, "dd/MM/yyyy")}
                                  </TableCell>
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
                  <Label htmlFor="income-descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Input
                    id="income-descripcion"
                    placeholder="Breve concepto del ingreso"
                    className="col-span-3"
                    value={incomeDescription}
                    onChange={(e) => setIncomeDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="income-categoria" className="text-right">
                    Categoría
                  </Label>
                  <Select value={incomeCategory} onValueChange={setIncomeCategory}>
                    <SelectTrigger id="income-categoria" className="col-span-3">
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
                  <Label htmlFor="income-referencia" className="text-right">
                    Referencia
                  </Label>
                  <Input
                    id="income-referencia"
                    placeholder="Número de referencia"
                    className="col-span-3"
                    value={incomeReference}
                    onChange={(e) => setIncomeReference(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="income-estado" className="text-right">
                    Estado
                  </Label>
                  <Select value={incomeState} onValueChange={setIncomeState}>
                    <SelectTrigger id="income-estado" className="col-span-3">
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
                <Label htmlFor="income-etiquetas" className="text-right col-span-1">
                  Etiquetas
                </Label>
                <div className="col-span-7 flex items-center gap-2">
                  <Input
                    id="income-etiquetas"
                    placeholder="Añadir etiqueta"
                    value={incomeTagInput}
                    onChange={(e) => setIncomeTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddIncomeTag()
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddIncomeTag}>
                    <TagIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mostrar etiquetas */}
              {incomeTags.length > 0 && (
                <div className="grid grid-cols-8 items-start gap-2">
                  <div className="col-span-1"></div>
                  <div className="col-span-7 flex flex-wrap gap-2">
                    {incomeTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveIncomeTag(tag)}
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
                <Label htmlFor="income-notas" className="text-right col-span-1 mt-2">
                  Notas
                </Label>
                <Textarea
                  id="income-notas"
                  placeholder="Observaciones relevantes"
                  className="col-span-7"
                  rows={2}
                  value={incomeNotes}
                  onChange={(e) => setIncomeNotes(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" onClick={handleIncomeSubmit}>
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Pestaña de Gastos */}
          <TabsContent value="expense">
            <form className="grid gap-4 py-2">
              {/* Primera fila: Cantidad y Fecha */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    id="expense-cantidad"
                    type="number"
                    placeholder="0.00"
                    className="col-span-3"
                    step="0.01"
                    min="0"
                    value={expenseAmount || ""}
                    onChange={(e) => setExpenseAmount(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-fecha" className="text-right">
                    Fecha
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="expense-fecha"
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !expenseDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expenseDate ? format(expenseDate, "dd/MM/yyyy") : "DD/MM/AAAA"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="bottom">
                      <Calendar mode="single" selected={expenseDate} onSelect={setExpenseDate} locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Segunda fila: Descripción y Comerciante */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Input
                    id="expense-descripcion"
                    placeholder="Breve concepto del gasto"
                    className="col-span-3"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-merchant" className="text-right">
                    Comerciante
                  </Label>
                  <Input
                    id="expense-merchant"
                    placeholder="Nombre del comercio"
                    className="col-span-3"
                    value={expenseMerchant}
                    onChange={(e) => setExpenseMerchant(e.target.value)}
                  />
                </div>
              </div>

              {/* Tercera fila: Categoría y Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-categoria" className="text-right">
                    Categoría
                  </Label>
                  <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                    <SelectTrigger id="expense-categoria" className="col-span-3">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alimentación">Alimentación</SelectItem>
                      <SelectItem value="Servicios">Servicios</SelectItem>
                      <SelectItem value="Facturas">Facturas</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                      <SelectItem value="Compras">Compras</SelectItem>
                      <SelectItem value="Salud">Salud</SelectItem>
                      <SelectItem value="Deudas">Deudas</SelectItem>
                      <SelectItem value="Ahorros">Ahorros</SelectItem>
                      <SelectItem value="Varios">Varios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-status" className="text-right">
                    Estado
                  </Label>
                  <Select value={expenseStatus} onValueChange={setExpenseStatus}>
                    <SelectTrigger id="expense-status" className="col-span-3">
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

              {/* Cuarta fila: Método de pago y Tipo de pago */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-metodo-pago" className="text-right">
                    Método
                  </Label>
                  <Select value={expensePaymentMethod} onValueChange={setExpensePaymentMethod}>
                    <SelectTrigger id="expense-metodo-pago" className="col-span-3">
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="Transferencia bancaria">Transferencia bancaria</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-tipo-pago" className="text-right">
                    Tipo
                  </Label>
                  <RadioGroup
                    defaultValue="unica"
                    className="col-span-3 flex gap-4"
                    value={expensePaymentType}
                    onValueChange={setExpensePaymentType}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unica" id="expense-unica" />
                      <Label htmlFor="expense-unica" className="font-normal">
                        Única exhibición
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diferido" id="expense-diferido" />
                      <Label htmlFor="expense-diferido" className="font-normal">
                        Diferido
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Quinta fila: Referencia y MSI (condicional) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="expense-referencia" className="text-right">
                    Referencia
                  </Label>
                  <Input
                    id="expense-referencia"
                    placeholder="Número de referencia"
                    className="col-span-3"
                    value={expenseReference}
                    onChange={(e) => setExpenseReference(e.target.value)}
                  />
                </div>
                {expensePaymentType === "diferido" && (
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="expense-msi" className="text-right">
                      MSI
                    </Label>
                    <Input
                      id="expense-msi"
                      type="number"
                      placeholder="0"
                      className="col-span-3"
                      min="0"
                      step="1"
                      value={expenseMsi || ""}
                      onChange={(e) => setExpenseMsi(e.target.value ? Number.parseInt(e.target.value) : null)}
                    />
                  </div>
                )}
              </div>

              {/* Sexta fila: Etiquetas */}
              <div className="grid grid-cols-8 items-center gap-2">
                <Label htmlFor="expense-etiquetas" className="text-right col-span-1">
                  Etiquetas
                </Label>
                <div className="col-span-7 flex items-center gap-2">
                  <Input
                    id="expense-etiquetas"
                    placeholder="Añadir etiqueta"
                    value={expenseTagInput}
                    onChange={(e) => setExpenseTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddExpenseTag()
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddExpenseTag}>
                    <TagIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mostrar etiquetas */}
              {expenseTags.length > 0 && (
                <div className="grid grid-cols-8 items-start gap-2">
                  <div className="col-span-1"></div>
                  <div className="col-span-7 flex flex-wrap gap-2">
                    {expenseTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveExpenseTag(tag)}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Séptima fila: Notas */}
              <div className="grid grid-cols-8 items-start gap-2">
                <Label htmlFor="expense-notas" className="text-right col-span-1 mt-2">
                  Notas
                </Label>
                <Textarea
                  id="expense-notas"
                  placeholder="Detalles adicionales..."
                  className="col-span-7"
                  rows={2}
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" onClick={handleExpenseSubmit}>
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
