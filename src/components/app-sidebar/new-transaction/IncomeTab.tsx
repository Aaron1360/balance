import { CheckCircle2, TagIcon, XCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import DatePicker from "./DatePicker";
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { useEffect, useState } from "react";
import { Income } from "@/types/income";

function IncomeTab() {
  // Form States
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentType, setPaymentType] = useState("unico");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  // States for deferred payments
  const [numPayments, setNumPayments] = useState(3);
  const [paymentFrequency, setPaymentFrequency] = useState("mensual");
  const [installments, setInstallments] = useState<
    Array<{ date: Date; amount: number; paid: boolean }>
  >([]);

  // Function to add tags
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Tag removal function
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Calculate odds when relevant parameters change
  useEffect(() => {
    if (paymentType === "diferido" && date && numPayments > 0 && amount > 0) {
      const newInstallments = [];
      const amountPerInstallment = amount / numPayments;

      for (let i = 0; i < numPayments; i++) {
        let installmentDate = new Date(date);

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
          paid: i === 0, // First installment is considered paid
        });
      }

      setInstallments(newInstallments);
    }
  }, [paymentType, date, numPayments, paymentFrequency, amount]);

  // Function to create a new entry
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
    };
  };

  // Function to handle form submission
  const handleSubmit = () => {
    setLoading(true);

    try {
      const newIncome = createIncome();
      console.log("Nuevo ingreso:", newIncome);
      // Aquí iría la lógica para guardar el ingreso

      // Reset form
      setDate(undefined);
      setDescription("");
      setAmount(0);
      setCategory("");
      setPaymentMethod("");
      setPaymentType("unica");
      setNumPayments(3);
      setPaymentFrequency("mensual");
      setReference("");
      setState("completado");
      setNotes("");
      setTags([]);
      setTagInput("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Submission error:", e.message || e);
      } else {
        console.error("Unknown error:", e);
      }
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-4 py-2">
      {/* First row: Amount and Date */}
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
            value={amount || ""}
            onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-2">
          <Label htmlFor="income-fecha" className="text-right">
            Fecha
          </Label>
          <DatePicker date={date} setDate={setDate} />
        </div>
      </div>

      {/* Second row: Payment method and type */}
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

      {/* Additional fields for deferred payment */}
      {paymentType === "diferido" && (
        <>
          {/* Row: Number of payments and Frequency */}
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

          {/* Pending payments */}
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

      {/* Third row: Description and category */}
      <div className="grid grid-cols-2 gap-4">
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

      {/* Fourth row: Reference and Status */}
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

      {/* Fifth row: Tags */}
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
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleAddTag}>
            <TagIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Display Tags */}
      {tags.length > 0 && (
        <div className="grid grid-cols-8 items-start gap-2">
          <div className="col-span-1"></div>
          <div className="col-span-7 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
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
                  onClick={() => handleRemoveTag(tag)}
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Sixth row: Notes */}
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
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default IncomeTab;
