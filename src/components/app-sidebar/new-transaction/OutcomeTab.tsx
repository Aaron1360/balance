import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "./DatePicker";
import { DialogFooter } from "../../ui/dialog";

function OutcomeTab() {
  return (
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
            onChange={(e) =>
              setExpenseAmount(Number.parseFloat(e.target.value) || 0)
            }
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
                  !expenseDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expenseDate ? format(expenseDate, "dd/MM/yyyy") : "DD/MM/AAAA"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <Calendar
                mode="single"
                selected={expenseDate}
                onSelect={setExpenseDate}
                locale={es}
              />
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
          <Select
            value={expensePaymentMethod}
            onValueChange={setExpensePaymentMethod}
          >
            <SelectTrigger id="expense-metodo-pago" className="col-span-3">
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Efectivo">Efectivo</SelectItem>
              <SelectItem value="Tarjeta">Tarjeta</SelectItem>
              <SelectItem value="Transferencia bancaria">
                Transferencia bancaria
              </SelectItem>
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
              onChange={(e) =>
                setExpenseMsi(
                  e.target.value ? Number.parseInt(e.target.value) : null
                )
              }
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
                e.preventDefault();
                handleAddExpenseTag();
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
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
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
  );
}

export default OutcomeTab;
