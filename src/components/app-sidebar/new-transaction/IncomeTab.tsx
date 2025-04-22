import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import DatePicker from "./DatePicker";
import { addDays, addMonths, addWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { Income } from "@/types/income";
import AmountInput from "./input-components/AmountInput";
import CategorySelect from "@/components/input-area/CategorySelect";
import PaymentType from "./input-components/PaymentType";
import PendingPayments from "./input-components/PendingPayments";
import TextInput from "./input-components/TextInput";
import AddTags from "./input-components/TagsInput";
import DisplayTags from "./input-components/DisplayTags";

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

  // Lists of categories
  const paymentMethodsCategories = [
    "Efectivo",
    "Transferencia",
    "Tarjeta",
    "Otro",
  ];
  const paymentFrequencyCategories = ["Mensual", "Quincenal", "Semanal"];
  const incomeCategories = [
    "Salario",
    "Freelance",
    "Inversiones",
    "Reembolso",
    "Regalo",
    "Otro",
  ];
  const stateCategories = ["Completado", "Pendiente", "Cancelado"];

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
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!amount || !date || !category) {
      alert("Fill your data.");
      return;
    }
    
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
        <div className="grid grid-cols-4 items-center gap-2 w-full">
          <Label htmlFor="income-cantidad" className="text-right">
            Cantidad
          </Label>
          <AmountInput
            id="amount"
            placeholder="0.00"
            value={amount}
            onChange={setAmount}
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
          <CategorySelect
            value={paymentMethod}
            onChange={setPaymentMethod}
            categories={paymentMethodsCategories}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-2">
          <Label htmlFor="income-tipo" className="text-right">
            Tipo
          </Label>
          <PaymentType value={paymentType} onChange={setPaymentType} />
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
              <AmountInput
                id="num-payments"
                placeholder="0"
                value={numPayments}
                onChange={setNumPayments}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="frecuencia" className="text-right">
                Frecuencia
              </Label>
              <CategorySelect
                value={paymentFrequency}
                onChange={setPaymentFrequency}
                categories={paymentFrequencyCategories}
              />
            </div>
          </div>

          {/* Pending payments */}
          <PendingPayments installments={installments} />
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
          <TextInput
            id="input-description"
            placeholder="Breve descripción del ingreso"
            value={description}
            onChange={setDescription}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-2">
          <Label htmlFor="categoria" className="text-right">
            Categoría
          </Label>
          <CategorySelect
            value={category}
            onChange={setCategory}
            categories={incomeCategories}
          />
        </div>
      </div>

      {/* Fourth row: Reference and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-4 items-center gap-2">
          <Label htmlFor="referencia" className="text-right">
            Referencia
          </Label>
          <TextInput id="reference" placeholder="Número de referencia (opcional)" value={reference? reference: ""} onChange={setReference} />
        </div>
        <div className="grid grid-cols-4 items-center gap-2">
          <Label htmlFor="estado" className="text-right">
            Estado
          </Label>
          <CategorySelect
            value={state? state: ""}
            onChange={setState}
            categories={stateCategories}
          />
        </div>
      </div>

      {/* Fifth row: Tags */}
      <div className="grid grid-cols-8 items-center gap-2">
        <Label htmlFor="etiquetas" className="text-right col-span-1">
          Etiquetas
        </Label>
        <AddTags value={tagInput} onChange={setTagInput} newTag={handleAddTag}/>
      </div>

      {/* Display Tags */}
      <DisplayTags value={tags} onChange={handleRemoveTag}/>

      {/* Sixth row: Notes */}
      <div className="grid grid-cols-8 items-start gap-2">
        <Label htmlFor="income-notas" className="text-right col-span-1 mt-2">
          Notas
        </Label>
        <TextInput id="income-notes" placeholder="Observaciones relevantes (opcional)" value={notes? notes: ""} onChange={setNotes}/>
      </div>

      <DialogFooter>
        <Button type="submit" onClick={(e) => handleSubmit(e)} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default IncomeTab;
