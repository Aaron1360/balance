import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import DatePicker from "./input-components/DatePicker";
import AmountInput from "./input-components/AmountInput";
import NumPaymentsInput from "./input-components/NumPaymentsInput";
import CategorySelect from "./input-components/CategorySelect";
import PaymentType from "./input-components/PaymentType";
import TextInput from "./input-components/TextInput";
import AddTags from "./input-components/TagsInput";
import DisplayTags from "./input-components/DisplayTags";
import { useInsertTableData } from "@/hooks/useInsertTableData";
import { Income } from "@/types/income";
import { useUpdateTableData } from "@/hooks/useUpdateTableData";
import { useLayoutContext } from "@/context/LayoutContext";

interface IncomeTabProps {
  transaction?: Income;
}

export default function IncomeTab({ transaction }: IncomeTabProps) {
  // Dialog and sheet states
  const { closeDialog } = useLayoutContext();

  // Supabase custom hooks
  const {
    mutate: insertIncome,
    isPending: isLoadingInsert,
    error: insertError,
  } = useInsertTableData<Income>("incomes");

  const {
    mutate: updateData,
    isPending: isLoadingUpdate,
    error: updateError,
  } = useUpdateTableData<Income>("incomes");

  // Form States
  const [, setId] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
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

  // States for deferred payments
  const [numberOfPayments, setNumberOfPayments] = useState(1);
  const [paymentFrequency, setPaymentFrequency] = useState("");

  // Initialize state with transaction data if available
  useEffect(() => {
    if (transaction) {
      setId(transaction.id || undefined);
      setDate(transaction.date || undefined);
      setDescription(transaction.description || "");
      setCategory(transaction.category || "Salario");
      setPaymentMethod(transaction.payment_method || "Efectivo");
      setPaymentType(transaction.payment_type || "unica");
      setAmount(transaction.amount || 0);
      setReference(transaction.reference || undefined);
      setNumberOfPayments(transaction.number_of_payments || 1);
      setPaymentFrequency(transaction.payment_frequency || "");
      // setInstallments(transaction.installments || []);
      setState(transaction.state || undefined);
      setNotes(transaction.notes || undefined);
      setTags(transaction.tags || []);
    }
  }, [transaction]);

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

  // Function to create a new entry
  const createIncome = (): Income => {
    if (!date) {
      throw new Error("Date is required to create an income entry.");
    }
    return {
      type: "income",
      date: date,
      description: description,
      category: category,
      payment_method: paymentMethod,
      payment_type: paymentType,
      amount: amount,
      reference: reference || undefined,
      number_of_payments: numberOfPayments || undefined,
      payment_frequency: paymentFrequency || undefined,
      installments: [], // You can populate this later based on your payment logic
      state: state || undefined,
      notes: notes || undefined,
      tags: tags.length ? tags : undefined,
    };
  };

  // Helper function to reset the form
  const resetForm = () => {
    setId(undefined);
    setDate(new Date());
    setDescription("");
    setAmount(0);
    setCategory("Salario");
    setPaymentMethod("Efectivo");
    setPaymentType("unica");
    setNumberOfPayments(1);
    setPaymentFrequency("");
    setReference("");
    setState("completado");
    setNotes("");
    setTags([]);
    setTagInput("");
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!amount || !date || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    const incomeData = createIncome();

    if (transaction) {
      // Update existing record
      if (transaction.id) {
        updateData(
          { id: transaction.id, updatedRecord: incomeData },
          {
            onSuccess: () => {
              console.log("Income updated successfully!");
              resetForm(); // Reset the form on success
              closeDialog(); // Close the dialog on success
            },
            onError: (error) => {
              console.error("Error updating income:", error);
              alert(`Failed to update the income: ${error.message}`);
            },
          }
        );
      } else {
        console.error("Transaction ID is undefined.");
        alert("Transaction ID is missing. Cannot update the record.");
      }
    } else {
      // Insert new record
      insertIncome(incomeData, {
        onSuccess: () => {
          console.log("Income added successfully!");
          resetForm(); // Reset the form on success
          closeDialog(); // Close the dialog on success
        },
        onError: (error) => {
          console.error("Error adding income:", error);
          alert(`Failed to add the income: ${error.message}`);
        },
      });
    }
  };

  return (
    <form className="grid gap-4 py-2">
      {/* First row: Amount and Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="amount" className="w-1/4 text-right">
            Cantidad
          </Label>
          <div className="w-3/4">
            <AmountInput
              id="amount"
              placeholder="$0.00"
              value={amount}
              onChange={setAmount}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="date" className="w-1/4 text-right">
            Fecha
          </Label>
          <div className="w-3/4">
            <DatePicker id="date" date={date} setDate={setDate} />
          </div>
        </div>
      </div>

      {/* Second row: Payment method and type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="payment_method" className="w-1/4 text-right">
            Forma de pago
          </Label>
          <div className="w-3/4">
            <CategorySelect
              id="payment_method"
              value={paymentMethod}
              onChange={setPaymentMethod}
              categories={paymentMethodsCategories}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="payment_type" className="w-1/4 text-right">
            Tipo
          </Label>
          <div className="w-3/4">
            <PaymentType
              id="payment_type"
              value={paymentType}
              onChange={setPaymentType}
            />
          </div>
        </div>
      </div>

      {/* Additional fields for deferred payment */}
      {paymentType === "diferido" && (
        <>
          {/* Row: Number of payments and Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="number_of_payments" className="w-1/4 text-right">
                Número de pagos
              </Label>
              <div className="w-3/4">
                <NumPaymentsInput
                  id="num-payments"
                  placeholder="0"
                  value={numberOfPayments}
                  onChange={setNumberOfPayments}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="payment_frequency" className="w-1/4 text-right">
                Frecuencia
              </Label>
              <div className="w-3/4">
                <CategorySelect
                  id="payment_frequency"
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
          <Label htmlFor="description" className="w-1/4 text-right mt-2">
            Descripción
          </Label>
          <div className="w-3/4">
            <TextInput
              id="description"
              placeholder="Describe tu ingreso"
              value={description}
              onChange={setDescription}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="category" className="w-1/4 text-right">
            Categoría
          </Label>
          <div className="w-3/4">
            <CategorySelect
              id="category"
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
          <Label htmlFor="reference" className="w-1/4 text-right">
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
          <Label htmlFor="state" className="w-1/4 text-right">
            Estado
          </Label>
          <div className="w-3/4">
            <CategorySelect
              id="state"
              value={state ? state : ""}
              onChange={setState}
              categories={stateCategories}
            />
          </div>
        </div>
      </div>

      {/* Fifth row: Tags */}
      <div className="flex items-center gap-2">
        <Label htmlFor="tags" className="w-1/8 text-right">
          Etiquetas
        </Label>
        <div className="w-7/8">
          <AddTags
            id="tags"
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
        <Label htmlFor="notes" className="w-1/8 text-right mt-2">
          Notas
        </Label>
        <div className="w-7/8">
          <TextInput
            id="notes"
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
          disabled={isLoadingInsert || isLoadingUpdate}
        >
          {isLoadingInsert || isLoadingUpdate ? "Guardando..." : "Guardar"}
        </Button>
        {(insertError || updateError) && (
          <p className="text-red-500 text-sm mt-2">
            Error: {insertError?.message || updateError?.message}
          </p>
        )}
      </DialogFooter>
    </form>
  );
}
