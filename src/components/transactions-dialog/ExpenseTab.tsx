import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import DatePicker from "./input-components/DatePicker";
import AmountInput from "./input-components/AmountInput";
import NumPaymentsInput from "./input-components/NumPaymentsInput";
import CategorySelect from "./input-components/CategorySelect";
import PaymentType from "./input-components/PaymentType";
import TextInput from "./input-components/TextInput";
import AddTags from "./input-components/TagsInput";
import DisplayTags from "./input-components/DisplayTags";
import { useInsertTableData } from "@/hooks/useInsertTableData";
import { useUpdateTableData } from "@/hooks/useUpdateTableData";
import { Installment } from "@/types/installment";
import { useDialogContext } from "@/context/DialogContext";
import { Expense } from "@/types/expense";
import { toDate } from "date-fns-tz";

interface ExpenseTabProps {
  transaction?: Expense;
}

export default function ExpenseTab({ transaction }: ExpenseTabProps) {
  // Dialog and sheet states
  const { closeDialog } = useDialogContext();

  // Supabase custom hooks
  const {
    mutate: insertExpense,
    isPending: isLoadingInsert,
    error: insertError,
  } = useInsertTableData<Expense>("expenses");

  const {
    mutate: updateData,
    isPending: isLoadingUpdate,
    error: updateError,
  } = useUpdateTableData<Expense>("expenses");

  // Form States
  const [, setId] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(
    transaction?.date
      ? toDate(transaction.date, { timeZone: "America/Mexico_City" })
      : new Date()
  );
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>(
    transaction?.category || "Varios"
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    transaction?.payment_method || "Tarjeta"
  );
  const [paymentType, setPaymentType] = useState<"unica" | "diferido">("unica");
  const [amount, setAmount] = useState(0);
  const [merchant, setMerchant] = useState<string>("");
  const [reference, setReference] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // States for deferred payments
  const [numberOfPayments, setNumberOfPayments] = useState(1);
  const [paymentFrequency, setPaymentFrequency] = useState<
    "Mensual" | "Quincenal" | "Semanal" | undefined
  >(undefined);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [isMsi, setIsMsi] = useState<boolean>(false);

  // State for installments (if needed)
  const [installments, setInstallments] = useState<Installment[]>(
    transaction?.installments || []
  );

  // State for alert visibility and message
  const [alertVisible, setAlertVisible] = useState(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState(""); // State to store the alert message

  // Initialize state with transaction data if available
  useEffect(() => {
    if (transaction) {
      setId(transaction.id || undefined);
      setDate(
        transaction.date
          ? toDate(transaction.date, { timeZone: "America/Mexico_City" })
          : undefined
      );
      setDescription(transaction.description || "");
      setCategory(transaction.category || "Varios");
      setPaymentMethod(transaction.payment_method || "Tarjeta");
      setPaymentType(transaction.payment_type || "unica");
      setAmount(transaction.amount || 0);
      setMerchant(transaction.merchant || "");
      setReference(transaction.reference || undefined);
      setNumberOfPayments(transaction.number_of_payments || 1);
      setPaymentFrequency(transaction.payment_frequency || undefined);
      setInterestRate(transaction.interest_rate || 0);
      setIsMsi(transaction.is_msi || false);
      setInstallments(transaction.installments || []);
      setNotes(transaction.notes || undefined);
      setTags(transaction.tags || []);
    } else {
      // If no transaction is provided (creating a new record), set default values
      setCategory("Varios");
      setPaymentMethod("Tarjeta");
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

  // Generate installments dynamically
  const generateInstallments = () => {
    if (!date || numberOfPayments <= 0) return;

    const newInstallments: Installment[] = [];
    const baseAmount = isMsi
      ? amount / numberOfPayments // No interest for "msi"
      : (amount * (1 + interestRate / 100)) / numberOfPayments; // Include interest

    for (let i = 0; i < numberOfPayments; i++) {
      const dueDate = new Date(date);
      if (paymentFrequency === "Mensual") {
        dueDate.setMonth(dueDate.getMonth() + i);
      } else if (paymentFrequency === "Quincenal") {
        dueDate.setDate(dueDate.getDate() + i * 15);
      } else if (paymentFrequency === "Semanal") {
        dueDate.setDate(dueDate.getDate() + i * 7);
      }

      newInstallments.push({
        amount: parseFloat(baseAmount.toFixed(2)),
        due_date: dueDate,
        status: "pendiente",
      });
    }

    setInstallments(newInstallments);
  };

  // Effect to generate installments when relevant fields change
  useEffect(() => {
    if (paymentType === "diferido") {
      generateInstallments();
    }
  }, [
    numberOfPayments,
    paymentFrequency,
    date,
    paymentType,
    interestRate,
    isMsi,
  ]);

  // Function to create a new entry
  const createExpense = (): Expense => {
    if (!date || isNaN(date.getTime())) {
      throw new Error("Date is required to create an expense entry.");
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
      reference: reference || undefined,
      number_of_payments:
        paymentType === "diferido" ? numberOfPayments : undefined,
      payment_frequency:
        paymentType === "diferido" ? paymentFrequency : undefined,
      interest_rate: paymentType === "diferido" ? interestRate : undefined,
      is_msi: paymentType === "diferido" ? isMsi : undefined,
      installments: paymentType === "diferido" ? installments : undefined,
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
    setCategory("Varios");
    setPaymentMethod("Tarjeta");
    setPaymentType("unica");
    setNumberOfPayments(1);
    setPaymentFrequency(undefined);
    setInterestRate(0);
    setIsMsi(false);
    setInstallments([]);
    setMerchant("");
    setReference("");
    setNotes("");
    setTags([]);
    setTagInput("");
  };

  // Validation function
  const validateForm = (): string | null => {
    const missingFields: string[] = [];

    if (amount <= 0) {
      missingFields.push("Cantidad");
    }

    if (!description.trim()) {
      missingFields.push("Descripción");
    }

    if (!date || isNaN(date.getTime())) {
      missingFields.push("Fecha");
    }

    if (missingFields.length > 0) {
      return `Por favor, completa los siguientes campos obligatorios: ${missingFields.join(
        ", "
      )}.`;
    }

    return null; // No errors
  };

  // Effect to show alert if any required field is invalid
  useEffect(() => {
    // Check if all required fields are valid
    if (amount > 0 && description.trim() && date && !isNaN(date.getTime())) {
      setAlertVisible(false); // Hide the alert
    }
  }, [amount, description, date]);

  // Function to handle form submission
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // Validate the form
    const errorMessage = validateForm();
    if (errorMessage) {
      setAlertMessage(errorMessage); // Set the alert message
      setAlertVisible(true); // Show the alert
      return;
    }

    // Proceed with form submission
    const expenseData = createExpense();

    if (transaction) {
      // Update existing record
      if (transaction.id) {
        updateData(
          { id: transaction.id, updatedRecord: expenseData },
          {
            onSuccess: () => {
              toast.success("Gasto actualizado exitosamente"); // Show success toast
              resetForm(); // Reset the form on success
              closeDialog(); // Close the dialog on success
            },
            onError: (error) => {
              toast.error(`Error al actualizar el gasto: ${error.message}`);
            },
          }
        );
      } else {
        setAlertMessage("Transaction ID is missing. Cannot update the record.");
        setAlertVisible(true); // Show the alert
      }
    } else {
      // Insert new record
      insertExpense(expenseData, {
        onSuccess: () => {
          toast.success("Gasto agregado exitosamente"); // Show success toast
          resetForm(); // Reset the form on success
          closeDialog(); // Close the dialog on success
        },
        onError: (error) => {
          setAlertMessage(`Error al agregar el gasto: ${error.message}`);
          setAlertVisible(true); // Show the alert
        },
      });
    }
  };

  return (
    <form className="grid gap-4 py-2">
      {/* First row: Amount and Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="amount" className="w-1/4 text-left">
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
          <Label htmlFor="date" className="w-1/4 text-left">
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
          <Label htmlFor="payment_method" className="w-1/4 text-left">
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
          <Label htmlFor="payment_type" className="w-1/4 text-left">
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
          <div className="grid grid-cols-2 gap-4">
            {/* Number of Payments */}
            <div className="flex items-center gap-2">
              <Label htmlFor="number_of_payments" className="w-1/4 text-left">
                Número de Pagos
              </Label>
              <div className="w-3/4">
                <NumPaymentsInput
                  id="number_of_payments"
                  placeholder="Número de pagos"
                  value={numberOfPayments}
                  onChange={setNumberOfPayments}
                />
              </div>
            </div>

            {/* Payment Frequency */}
            <div className="flex items-center gap-2">
              <Label htmlFor="payment_frequency" className="w-1/4 text-left">
                Frecuencia de Pago
              </Label>
              <div className="w-3/4">
                <CategorySelect
                  id="payment_frequency"
                  value={paymentFrequency || ""}
                  onChange={(value) =>
                    setPaymentFrequency(
                      value as "Mensual" | "Quincenal" | "Semanal"
                    )
                  }
                  categories={paymentFrequencyCategories}
                />
              </div>
            </div>
          </div>

          {/* Interest Rate and MSI */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="interest_rate" className="w-1/4 text-left">
                Tasa de Interés (%)
              </Label>
              <div className="w-3/4">
                <AmountInput
                  id="interest_rate"
                  placeholder="0%"
                  value={interestRate}
                  onChange={setInterestRate}
                  disabled={isMsi} // Disable if MSI is selected
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="is_msi" className="w-1/4 text-left">
                MSI
              </Label>
              <div className="w-3/4">
                <input
                  id="is_msi"
                  type="checkbox"
                  checked={isMsi}
                  onChange={(e) => {
                    setIsMsi(e.target.checked);
                    if (e.target.checked) setInterestRate(0); // Reset interest rate if MSI is selected
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Third row: Description and category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <Label htmlFor="description" className="w-1/4 text-left mt-2">
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
          <Label htmlFor="category" className="w-1/4 text-left">
            Categoría
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
      </div>

      {/* Fourth row: Merchant */}
      <div className="flex items-center gap-2">
        <Label htmlFor="merchant" className="w-1/8 text-left">
          Comercio
        </Label>
        <div className="w-7/8">
          <TextInput
            id="merchant"
            placeholder="Nombre del comerciante (opcional)"
            value={merchant}
            onChange={setMerchant}
          />
        </div>
      </div>

      {/* Fifth row: Reference */}
      <div className="flex items-center gap-2">
        <Label htmlFor="reference" className="w-1/8 text-left">
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
        <Label htmlFor="tags" className="w-1/8 text-left">
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
        <Label htmlFor="notes" className="w-1/8 text-left mt-2">
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
        {/* Alert for errors */}
        {alertVisible && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </div>
          </Alert>
        )}
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
