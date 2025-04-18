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

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
  }

function OutcomeTab({ date, setDate } : DatePickerProps)  {
  return (
    <form className="grid gap-4 py-2">
          {/* Primera fila: Nombre y Cantidad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                placeholder="Nombre de la transacción"
                className="col-span-3"
              />
            </div>
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
              />
            </div>
          </div>

          {/* Segunda fila: Categoría y Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="categoria" className="text-right">
                Categoría
              </Label>
              <Select>
                <SelectTrigger id="categoria" className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comida">Comida</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="facturas">Facturas</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="entretenimiento">
                    Entretenimiento
                  </SelectItem>
                  <SelectItem value="compras">Compras</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="deudas">Deudas</SelectItem>
                  <SelectItem value="ahorros">Ahorros</SelectItem>
                  <SelectItem value="varios">Varios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="fecha" className="text-right">
                Fecha
              </Label>
              <DatePicker date={date} setDate={setDate} />
            </div>
          </div>

          {/* Tercera fila: Método de pago y MSI */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="metodo-pago" className="text-right">
                Método
              </Label>
              <Select>
                <SelectTrigger id="metodo-pago" className="col-span-3">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="credito">Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="msi" className="text-right">
                MSI
              </Label>
              <Input
                id="msi"
                type="number"
                placeholder="0"
                className="col-span-3"
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Cuarta fila: Descripción (ocupa todo el ancho) */}
          <div className="grid grid-cols-8 items-start gap-2">
            <Label htmlFor="descripcion" className="text-right col-span-1 mt-2">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Detalles adicionales..."
              className="col-span-7"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
  )
}

export default OutcomeTab
