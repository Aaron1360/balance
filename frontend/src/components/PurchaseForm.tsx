import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type PurchaseFormProps = {
  error?: string | null;
  initialValues?: {
    name: string;
    date: string;
    msi_term: string;
    card: string;
    amount: string;
    category: string;
  };
  onSubmit?: (values: {
    name: string;
    date: string;
    msi_term: string;
    card: string;
    amount: string;
    category: string;
  }) => Promise<void>;
  onFormStateChange?: (state: { isFormComplete: boolean }) => void;
};

export function PurchaseForm({ error, initialValues, onSubmit, onFormStateChange }: PurchaseFormProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    initialValues?.date ? new Date(initialValues.date) : undefined
  );

  // MSI state
  const [isMsi, setIsMsi] = React.useState(
    initialValues?.msi_term && Number(initialValues.msi_term) > 0 ? true : false
  );

  // Form state
  const [form, setForm] = React.useState({
    name: initialValues?.name || "",
    date: initialValues?.date || "",
    msi_term: initialValues?.msi_term || "",
    card: initialValues?.card || "",
    amount: initialValues?.amount || "",
    category: initialValues?.category || "",
  });

  // Update form state if initialValues change
  React.useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        date: initialValues.date || "",
        msi_term: initialValues.msi_term || "",
        card: initialValues.card || "",
        amount: initialValues.amount || "",
        category: initialValues.category || "",
      });
      setDate(initialValues.date ? new Date(initialValues.date) : undefined);
      setIsMsi(initialValues.msi_term && Number(initialValues.msi_term) > 0 ? true : false);
    }
  }, [initialValues]);

  // Sync form.date with calendar date
  React.useEffect(() => {
    setForm((prev) => ({
      ...prev,
      date: date ? date.toISOString().slice(0, 10) : "",
    }));
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "isMsi") {
      const checked = (e.target as HTMLInputElement).checked;
      setIsMsi(checked);
      setForm((prev) => ({
        ...prev,
        msi_term: checked ? prev.msi_term : ""
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Form completion logic
  const isFormComplete =
    form.name.trim() !== "" &&
    form.date !== "" &&
    form.card.trim() !== "" &&
    form.amount !== "" &&
    Number(form.amount) > 0 &&
    (!isMsi || (form.msi_term !== "" && Number(form.msi_term) > 0));

  React.useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange({ isFormComplete });
    }
  }, [isFormComplete, onFormStateChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({
        ...form,
        msi_term: isMsi ? form.msi_term : "0", // submit "0" for single payment
        category: form.category.trim() === "" ? "Sin categoria" : form.category,
      });
      setForm({
        name: "",
        date: "",
        msi_term: "",
        card: "",
        amount: "",
        category: "",
      });
      setDate(undefined);
      setIsMsi(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off" id="purchase-form">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre"
        required
        className="bg-background text-foreground px-2 py-1 rounded w-full border border-border"
      />
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" type="button" className="w-full justify-between font-normal">
              {date ? date.toLocaleDateString() : "Selecciona una fecha"}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isMsi"
          checked={isMsi}
          onChange={handleChange}
          className="accent-primary"
        />
        <span>Compra a MSI</span>
      </label>
      {isMsi && (
        <input
          type="number"
          name="msi_term"
          value={form.msi_term}
          onChange={handleChange}
          min={1}
          placeholder="Plazo MSI (meses)"
          required={isMsi}
          className="bg-background text-foreground px-2 py-1 rounded w-full border border-border"
        />
      )}
      <select
        name="card"
        value={form.card}
        onChange={handleChange}
        required
        className="bg-background text-foreground px-2 py-1 rounded w-full border border-border"
      >
        <option value="">Selecciona una tarjeta</option>
        <option value="BBVA">BBVA</option>
        <option value="Citibanamex">Citibanamex</option>
        <option value="HSBC">HSBC</option>
        <option value="MercadoPago">MercadoPago</option>
        <option value="Banco Azteca">Banco Azteca</option>
      </select>
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        min={0.01}
        step="0.01"
        placeholder="Monto"
        required
        className="bg-background text-foreground px-2 py-1 rounded w-full border border-border"
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="bg-background text-foreground px-2 py-1 rounded w-full border border-border"
      >
        <option value="">Selecciona una categoría</option>
        <option value="Comida">Comida</option>
        <option value="Despensa">Despensa</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Servicios">Servicios</option>
        <option value="Entretenimiento">Entretenimiento</option>
        <option value="Salud">Salud</option>
        <option value="Mascotas">Mascotas</option>
        <option value="Ropa">Ropa</option>
        <option value="Regalos">Regalos</option>
        <option value="Hogar">Hogar</option>
        <option value="Educación">Educación</option>
        <option value="Transporte">Transporte</option>
      </select>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}