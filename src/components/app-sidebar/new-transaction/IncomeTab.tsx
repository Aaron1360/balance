import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import DatePicker from "./DatePicker";
// import { addDays, addMonths, addWeeks } from "date-fns";
// import { useEffect, useState } from "react";
import { useState } from "react";
import { Income } from "@/types/income";
import AmountInput from "./input-components/AmountInput";
import CategorySelect from "./input-components/CategorySelect";
import PaymentType from "./input-components/PaymentType";
// import PendingPayments from "./input-components/PendingPayments";
import TextInput from "./input-components/TextInput";
import AddTags from "./input-components/TagsInput";
import DisplayTags from "./input-components/DisplayTags";

function IncomeTab() {
  // Form States
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Salario");
  const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo");
  const [paymentType, setPaymentType] = useState("unica");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [state, setState] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  // States for deferred payments
  const [numberOfPayments, setNumberOfPayments] = useState(3);
  const [paymentFrequency, setPaymentFrequency] = useState("Mensual");
  // const [installments, setInstallments] = useState<
  //   Array<{ date: Date; amount: number; paid: boolean }>
  // >([]);

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
  // useEffect(() => {
  //   if (paymentType === "diferido" && date && numberOfPayments > 0 && amount > 0) {
  //     const newInstallments = [];
  //     const amountPerInstallment = amount / numberOfPayments;

  //     for (let i = 0; i < numberOfPayments; i++) {
  //       let installmentDate = new Date(date);

  //       if (paymentFrequency === "mensual") {
  //         installmentDate = addMonths(installmentDate, i);
  //       } else if (paymentFrequency === "quincenal") {
  //         installmentDate = addDays(installmentDate, i * 15);
  //       } else if (paymentFrequency === "semanal") {
  //         installmentDate = addWeeks(installmentDate, i);
  //       }

  //       newInstallments.push({
  //         date: installmentDate,
  //         amount: amountPerInstallment,
  //         paid: i === 0, // First installment is considered paid
  //       });
  //     }

  //     setInstallments(newInstallments);
  //   }
  // }, [paymentType, date, numberOfPayments, paymentFrequency, amount]);

  // Function to create a new entry
  const createIncome = (): Income => {
    return {
      // id: Date.now().toString(), // Generamos un ID temporal basado en la fecha
      date: date || new Date(),
      description,
      category,
      paymentMethod,
      paymentType,
      amount: Math.abs(amount), // Aseguramos que sea positivo
      reference,
      numberOfPayments,
      paymentFrequency,
      installments: [],
      state,
      notes,
      tags,
    };
  };

  // Function to handle form submission
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
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
      setNumberOfPayments(3);
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
        <div className="flex items-center gap-2">
          <Label htmlFor="income-cantidad" className="w-1/4 text-right">
            Cantidad
          </Label>
          <div className="w-3/4">
            <AmountInput
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={setAmount}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="income-fecha" className="w-1/4 text-right">
            Fecha
          </Label>
          <div className="w-3/4">
            <DatePicker date={date} setDate={setDate} />
          </div>
        </div>
      </div>

      {/* Second row: Payment method and type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="paymentMethod" className="w-1/4 text-right">
            Forma de pago
          </Label>
          <div className="w-3/4">
            <CategorySelect
              value={paymentMethod}
              onChange={setPaymentMethod}
              categories={paymentMethodsCategories}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="paymentType" className="w-1/4 text-right">
            Tipo
          </Label>
          <div className="w-3/4">
            <PaymentType value={paymentType} onChange={setPaymentType} />
          </div>
        </div>
      </div>

      {/* Additional fields for deferred payment */}
      {paymentType === "diferido" && (
        <>
          {/* Row: Number of payments and Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="num-pagos" className="w-1/4 text-right">
                Número de pagos
              </Label>
              <div className="w-3/4">
                <AmountInput
                  id="num-payments"
                  placeholder="0"
                  value={numberOfPayments}
                  onChange={setNumberOfPayments}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="frecuencia" className="w-1/4 text-right">
                Frecuencia
              </Label>
              <div className="w-3/4">
                <CategorySelect
                  value={paymentFrequency}
                  onChange={setPaymentFrequency}
                  categories={paymentFrequencyCategories}
                />
              </div>
            </div>
          </div>

          {/* Pending payments */}
          {/* <PendingPayments installments={installments} /> */}
        </>
      )}

      {/* Third row: Description and category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <Label htmlFor="income-descripcion" className="w-1/4 text-right mt-2">
            Descripción
          </Label>
          <div className="w-3/4">
            <TextInput
              id="input-description"
              placeholder="Describe tu ingreso"
              value={description}
              onChange={setDescription}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="categoria" className="w-1/4 text-right">
            Categoría
          </Label>
          <div className="w-3/4">
            <CategorySelect
              value={category}
              onChange={setCategory}
              categories={incomeCategories}
            />
          </div>
        </div>
      </div>

      {/* Fourth row: Reference and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="referencia" className="w-1/4 text-right">
            Referencia
          </Label>
          <div className="w-3/4">
            <TextInput
              id="reference"
              placeholder="Referencia (opcional)"
              value={reference ? reference : ""}
              onChange={setReference}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="estado" className="w-1/4 text-right">
            Estado
          </Label>
          <div className="w-3/4">
            <CategorySelect
              value={state ? state : ""}
              onChange={setState}
              categories={stateCategories}
            />
          </div>
        </div>
      </div>

      {/* Fifth row: Tags */}
      <div className="flex items-center gap-2">
        <Label htmlFor="etiquetas" className="w-1/8 text-right">
          Etiquetas
        </Label>
        <div className="w-7/8">
          <AddTags
            value={tagInput}
            onChange={setTagInput}
            newTag={handleAddTag}
          />
        </div>
      </div>

      {/* Display Tags */}
      <DisplayTags value={tags} onChange={handleRemoveTag} />

      {/* Sixth row: Notes */}
      <div className="flex items-start gap-2">
        <Label htmlFor="income-notas" className="w-1/8 text-right mt-2">
          Notas
        </Label>
        <div className="w-7/8">
          <TextInput
            id="income-notes"
            placeholder="Observaciones relevantes (opcional)"
            value={notes ? notes : ""}
            onChange={setNotes}
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default IncomeTab;
