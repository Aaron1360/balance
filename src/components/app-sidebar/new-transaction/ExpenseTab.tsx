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
import { Expense } from "@/types/expense";
import { useUpdateTableData } from "@/hooks/useUpdateTableData";
import { useLayoutContext } from "@/context/LayoutContext";

interface ExpenseTabProps {
  transaction?: Expense;
}

export default function ExpenseTab({ transaction }: ExpenseTabProps) {
   // Dialog state 
   const { closeDialog } = useLayoutContext();

  // Supabase custom hooks
  const {
    insertData,
    isLoading: isLoadingInsert,
    error: errorInsert,
  } = useInsertTableData<Expense>("expenses");
  const {
    updateData,
    isLoading: isLoadingUpdate,
    error: errorUpdate,
  } = useUpdateTableData<Expense>("expenses");

  // Form States
  const [, setId] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Varios");
  const [paymentMethod, setPaymentMethod] = useState<string>("Tarjeta");
  const [paymentType, setPaymentType] = useState("unica");
  const [amount, setAmount] = useState(0);
  const [merchant, setMerchant] = useState<string>("");
  // const [status, setStatus] = useState<string>("Completado");
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // State for deferred payments
  const [msi, setMsi] = useState(0);

  // Initialize state with transaction data if available
  useEffect(() => {
    if (transaction) {
      setId(transaction.id || undefined);
      setDate(transaction.date || undefined);
      setDescription(transaction.description || "");
      setCategory(transaction.category || "Varios");
      setPaymentMethod(transaction.payment_method || "Tarjeta");
      setPaymentType(transaction.payment_type || "unica");
      setAmount(transaction.amount || 0);
      setMerchant(transaction.merchant || "");
      setReference(transaction.reference || undefined);
      setNotes(transaction.notes || undefined);
      setTags(transaction.tags || []);
      setMsi(transaction.msi || 0);
    }
  }, [transaction]);

  // Lists of categories
  const outcomeCategories = [
    "Comida",
    "Servicios",
    "Facturas",
    "Transporte",
    "Entretenimiento",
    "Compras",
    "Salud y Bienestar",
    "Pago de Deudas",
    "Ahorros",
    "Varios",
  ];

  const paymentMethodsCategories = [
    "Efectivo",
    "Transferencia",
    "Tarjeta",
    "Otro",
  ];

  // const stateCategories = ["Completado", "Pendiente", "Cancelado"];

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

  // Function to create a new expense object
  const createExpense = (): Expense => {
    if (!date) {
      throw new Error("Date is required");
    }
    return {
      type: "expense",
      date: date,
      description: description,
      category: category,
      payment_method: paymentMethod,
      payment_type: paymentType,
      amount: amount,
      merchant: merchant,
      // status: status,
      reference: reference || undefined,
      msi: msi || undefined,
      notes: notes || undefined,
      tags: tags.length ? tags : undefined,
    };
  };

  // Function to handle form submission
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!amount || !date || !category) {
      alert("Fill your data.");
      return;
    }

    try {
      if (transaction) {
        // Update existing record
        const updatedExpense = createExpense();
        if (!updatedExpense) return;

        if (transaction.id) {
          await updateData(transaction.id, updatedExpense);
        } else {
          throw new Error("Transaction ID is undefined.");
        }
      } else {
        // Create a new record
        const newExpense = createExpense();
        if (!newExpense) return;

        await insertData(newExpense);
      }

      // Reset form
      setDate(new Date());
      setDescription("");
      setAmount(0);
      setCategory("");
      setPaymentMethod("");
      setPaymentType("unica");
      setMsi(0);
      setReference("");
      // setStatus("completado");
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
    }
    // Close the dialog
    closeDialog();
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

      {/* Second row: Description and Merchant */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="description" className="w-1/4 text-right">
            Descripción
          </Label>
          <div className="w-3/4">
            <TextInput
              id="description"
              placeholder="Describe tu gasto"
              value={description}
              onChange={setDescription}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="merchant" className="w-1/4 text-right">
            Comercio
          </Label>
          <div className="w-3/4">
            <TextInput
              id="merchant"
              placeholder="Donde realizaste tu compra"
              value={merchant}
              onChange={setMerchant}
            />
          </div>
        </div>
      </div>

      {/* Third row: Category and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <Label htmlFor="category" className="w-1/4 text-right mt-2">
            Categoria
          </Label>
          <div className="w-3/4">
            <CategorySelect
              id="category"
              value={category}
              onChange={setCategory}
              categories={outcomeCategories}
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

      {/* Fourth row: Payment method and Payment type */}
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
        {paymentType === "diferido" && (
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="msi" className="text-right">
              MSI
            </Label>
            <NumPaymentsInput
              id="msi"
              placeholder="0"
              value={msi}
              onChange={setMsi}
            />
          </div>
        )}
      </div>

      {/* Fifth row: Reference */}
      <div className="flex items-start gap-2">
        <Label htmlFor="reference" className="w-1/8 text-right mt-2">
          Referencia
        </Label>
        <div className="w-7/8">
          <TextInput
            id="reference"
            placeholder="Referencia (opcional)"
            value={reference ? reference : ""}
            onChange={setReference}
          />
        </div>
      </div>

      {/* Sixth row: Tags */}
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

      {/* Seventh row: Notes */}
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
        {(errorInsert || errorUpdate) && (
          <p className="text-red-500 text-sm mt-2">
            Error: {errorInsert ? errorInsert.message : errorUpdate?.message}
          </p>
        )}
      </DialogFooter>
    </form>
  );
}
