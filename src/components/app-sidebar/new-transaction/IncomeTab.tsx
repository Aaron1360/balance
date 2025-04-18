import { CheckCircle2, XCircle } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import DatePicker from "./DatePicker";
import { DialogFooter } from "../../ui/dialog";
import { addDays, addMonths, addWeeks, format} from "date-fns";
import { useEffect, useState } from "react";

function IncomeTab() {
    const [incomeDate, setIncomeDate] = useState<Date>();
    const [paymentType, setPaymentType] = useState("unica");
    const [numPayments, setNumPayments] = useState(3);
    const [paymentFrequency, setPaymentFrequency] = useState("mensual");
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [installments, setInstallments] = useState<
      Array<{ date: Date; amount: number; paid: boolean }>
    >([]);
  
    // Calcular las cuotas cuando cambian los parámetros relevantes
    useEffect(() => {
      if (
        paymentType === "diferido" &&
        incomeDate &&
        numPayments > 0 &&
        incomeAmount > 0
      ) {
        const newInstallments = [];
        const amountPerInstallment = incomeAmount / numPayments;
  
        for (let i = 0; i < numPayments; i++) {
          let installmentDate = new Date(incomeDate);
  
          if (paymentFrequency === "mensual") {
            installmentDate = addMonths(installmentDate, i);
          } else if (paymentFrequency === "quincenal") {
            installmentDate = addDays(installmentDate, i * 15);
          } else if (paymentFrequency === "semanal") {
            installmentDate = addWeeks(installmentDate, i);
          }
  
          newInstallments.push({
            date: installmentDate,
            amount: amountPerInstallment,
            paid: i === 0, // Primera cuota se considera pagada
          });
        }
  
        setInstallments(newInstallments);
      }
    }, [paymentType, incomeDate, numPayments, paymentFrequency, incomeAmount]);
    
  return (
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
            onChange={(e) =>
              setIncomeAmount(Number.parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-2">
          <Label htmlFor="income-fecha" className="text-right">
            Fecha
          </Label>
          <DatePicker date={incomeDate} setDate={setIncomeDate} />
        </div>
      </div>

      {/* Segunda fila: Forma de pago y Tipo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-4 items-center gap-2">
          <Label htmlFor="income-forma-pago" className="text-right">
            Forma de pago
          </Label>
          <Select>
            <SelectTrigger id="income-forma-pago" className="col-span-3">
              <SelectValue placeholder="Seleccionar forma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efectivo">Efectivo</SelectItem>
              <SelectItem value="transferencia">
                Transferencia bancaria
              </SelectItem>
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
                onChange={(e) =>
                setNumPayments(Number.parseInt(e.target.value) || 3)
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="frecuencia" className="text-right">
                Frecuencia
              </Label>
              <Select
                value={paymentFrequency}
                onValueChange={setPaymentFrequency}
              >
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
                <Label className="text-sm font-medium mb-2 block">
                  Pagos pendientes
                </Label>
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

      {/* Tercera fila: Descripción */}
      <div className="grid grid-cols-8 items-start gap-2">
        <Label
          htmlFor="income-descripcion"
          className="text-right col-span-1 mt-2"
        >
          Descripción
        </Label>
        <Input
          id="income-descripcion"
          placeholder="Breve concepto del ingreso"
          className="col-span-7"
        />
      </div>

      {/* Cuarta fila: Notas */}
      <div className="grid grid-cols-8 items-start gap-2">
        <Label htmlFor="income-notas" className="text-right col-span-1 mt-2">
          Notas
        </Label>
        <Textarea
          id="income-notas"
          placeholder="Observaciones relevantes"
          className="col-span-7"
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  );
}

export default IncomeTab;
