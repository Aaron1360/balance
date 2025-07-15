import { useState, useRef, useEffect, useContext } from "react";
import { usePurchases } from "@/hooks/usePurchases";
import { Plus } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from "@/components/ui/pagination";
import { CheckCircle, Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PurchaseForm } from "@/components/PurchaseForm";
import type { Purchase } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { PurchasesContext } from "@/context/PurchasesContext";

type HomeScreenProps = {
  onAdd: () => void;
};

const PAGE_SIZE = 10;

export function HomeScreen({ onAdd }: HomeScreenProps) {
  const { purchases, total, loading, page, setPage, totalMonthlyPayment, refresh, deletePurchase, payOffPurchase, editPurchase } = usePurchases();
  const purchasesCtx = useContext(PurchasesContext);
  if (!purchasesCtx) throw new Error("HomeScreen must be used within PurchasesProvider");
  const { cards } = purchasesCtx;

  // Filter state
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(undefined);
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [state, setState] = useState(""); // "", "paid", "unpaid"
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [editPurchaseData, setEditPurchase] = useState<Purchase | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false); // For submit button
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Sort purchases by date descending, then by id descending
  const sortedPurchases = [...purchases].sort((a, b) => {
    if (b.date === a.date) return b.id - a.id;
    return b.date.localeCompare(a.date);
  });

  // No need to paginate here, context already provides the correct page's purchases
  const grouped: Record<string, typeof purchases> = {};
  sortedPurchases.forEach((p) => {
    if (!grouped[p.date]) grouped[p.date] = [];
    grouped[p.date].push(p);
  });
  const shownDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showFilters) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);
  useEffect(() => {
    setStart(startDateObj ? startDateObj.toISOString().slice(0, 10) : "");
  }, [startDateObj]);
  useEffect(() => {
    setEnd(endDateObj ? endDateObj.toISOString().slice(0, 10) : "");
  }, [endDateObj]);

  return (
    <div className="p-4 pb-32 bg-background text-foreground">
      <header className="mb-4 flex items-center justify-end">
        <button
          className="text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow mt-3 ring-2 ring-accent/40 bg-card disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setShowAddModal(true)}
          aria-label="Agregar compra"
          disabled={cards.length === 0}
          title={cards.length === 0 ? "Registra una tarjeta de crédito para agregar compras" : undefined}
        >
          <Plus size={24} />
        </button>
      </header>
      <section className="mb-10 mt-0 flex flex-col items-center">
        <div className="text-muted-foreground font-semibold mb-2 text-xl">Saldo al corte</div>
        <div className="relative my-4">
          <span className="text-4xl font-extrabold text-primary/60 ring-2 ring-accent/30 rounded-xl px-4 py-2 bg-card/90">
            {totalMonthlyPayment > 0 ? "-" : ""}${totalMonthlyPayment.toFixed(2)}
          </span>
        </div>
      </section>
      <section className="flex items-center justify-between mb-2">
        <h2 className="text-md font-semibold mb-2 text-muted-foreground">Historial de compras</h2>
        <div className="relative">
          <button
            className={`px-3 py-1 rounded shadow border-2 relative ${
              start || end || category || state
                ? "border-primary/40"
                : "border-border"
            } bg-card text-foreground`}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
            {(+!!start + +!!end + +!!category + +!!state) > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary/80 text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                {+!!start + +!!end + +!!category + +!!state}
              </span>
            )}
          </button>
          {showFilters && (
            <div
              ref={filterMenuRef}
              className="absolute right-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-lg p-4 w-64"
            >
              <div className="flex flex-col gap-3">
                <label className="text-xs text-muted-foreground">Fecha inicial:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" type="button" className="w-full justify-between font-normal">
                      {startDateObj ? startDateObj.toLocaleDateString() : "Selecciona fecha inicial"}
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDateObj}
                      captionLayout="dropdown"
                      onSelect={(d) => {
                        setStartDateObj(d || undefined);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <label className="text-xs text-muted-foreground">Fecha final:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" type="button" className="w-full justify-between font-normal">
                      {endDateObj ? endDateObj.toLocaleDateString() : "Selecciona fecha final"}
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDateObj}
                      captionLayout="dropdown"
                      onSelect={(d) => {
                        setEndDateObj(d || undefined);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <label className="text-xs text-muted-foreground">Categoría:</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="bg-background text-foreground px-2 py-1 rounded"
                >
                  <option value="">Todas</option>
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
                <label className="text-xs text-muted-foreground">Estado:</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="bg-background text-foreground px-2 py-1 rounded"
                >
                  <option value="">Todos</option>
                  <option value="paid">Pagados</option>
                  <option value="unpaid">Pendientes</option>
                </select>
                <button
                  className="bg-primary/50 text-primary-foreground px-4 py-1 rounded mt-2"
                  onClick={() => {
                    setShowFilters(false);
                    setPage(1);
                    refresh({ start, end, category, state });
                  }}
                >
                  Aplicar filtros
                </button>
                <button
                  className="bg-muted-foreground text-foreground px-4 py-1 rounded mt-2"
                  onClick={() => {
                    setStart("");
                    setEnd("");
                    setCategory("");
                    setState("");
                    setShowFilters(false);
                    setPage(1);
                    refresh({ start: "", end: "", category: "", state: "" });
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <section>
        {loading ? (
          <div className="text-muted-foreground">Cargando...</div>
        ) : purchases.length === 0 ? (
          <div className="text-muted-foreground">No hay compras registradas.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {shownDates.map((date) => (
              <div key={date}>
                <div className="text-sm font-semibold text-muted-foreground mb-2">
                  {formatDateSeparator(date)}
                </div>
                <ul className="flex flex-col gap-2">
                  {grouped[date].map((p) => (
                    <li
                      key={p.id}
                      className={`border border-border rounded-lg p-3 flex justify-between items-center shadow-sm relative cursor-pointer overflow-hidden transition-all duration-300`}
                      style={{
                        backgroundColor: p.payments_made === (p.msi_term || 0) ? "var(--card-paid)" : undefined,
                        minHeight: activeMenuId === p.id ? 90 : 60,
                        height: activeMenuId === p.id ? 90 : 60,
                      }}
                      onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                    >
                      {/* Card info: stick to top left */}
                      <div className="absolute top-3 left-3 z-20">
                        <div className="font-medium text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.card} | {p.msi_term && p.msi_term > 0 ? `${p.msi_term} MSI` : "Pago único"} | {p.category}
                        </div>
                      </div>
                      {/* Card right content */}
                      <div className="text-right mt-auto ml-auto">
                        <div
                          className={`font-mono ${
                            p.payments_made === (p.msi_term || 0) ? "text-primary" : "text-destructive"
                          }`}
                        >
                          ${p.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pagos: {p.msi_term && p.msi_term > 0 ? `${p.payments_made}/${p.msi_term}` : `${p.payments_made}/1`}
                        </div>
                        {/* Action buttons: shown only when selected, organized in a row and smaller */}
                        <div
                          className={`flex flex-row gap-2 mt-2 justify-end transition-opacity duration-300 ${
                            activeMenuId === p.id ? "opacity-100" : "opacity-0 pointer-events-none"
                          }`}
                        >
                          {/* Always show toggle button for paid and unpaid purchases */}
                          <button
                            className={
                              p.payments_made === (p.msi_term || 0)
                                ? "bg-destructive text-destructive-foreground px-1 py-1 rounded flex items-center justify-center"
                                : "bg-primary/70 text-primary-foreground px-1 py-1 rounded flex items-center justify-center"
                            }
                            style={{ width: 28, height: 28 }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              // Toggle paid state
                              const isPaid = p.payments_made === (p.msi_term || 0);
                              await editPurchase(p.id, {
                                payments_made: isPaid ? 0 : (p.msi_term && p.msi_term > 0 ? p.msi_term : 1),
                                paid: !isPaid
                              });
                              setActiveMenuId(null);
                            }}
                            aria-label={p.payments_made === (p.msi_term || 0) ? "Marcar como pendiente" : "Marcar como pagado"}
                          >
                            {p.payments_made === (p.msi_term || 0)
                              ? <X size={16} />
                              : <CheckCircle size={16} />}
                          </button>
                          <button
                            className="bg-accent text-accent-foreground px-1 py-1 rounded flex items-center justify-center"
                            style={{ width: 28, height: 28 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditPurchase(p);
                              setShowEditModal(true);
                              setActiveMenuId(null);
                            }}
                            aria-label="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="bg-destructive text-destructive-foreground px-1 py-1 rounded flex items-center justify-center"
                            style={{ width: 28, height: 28 }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await deletePurchase(p.id);
                              setActiveMenuId(null);
                            }}
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* Pagination controls */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      aria-disabled={page === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      aria-disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </section>
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar compra</DialogTitle>
            <DialogDescription>
              Modifica los datos y guarda los cambios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {editPurchaseData && (
              <PurchaseForm
                error={error}
                initialValues={{
                  ...editPurchaseData,
                  msi_term: String(editPurchaseData.msi_term),
                  amount: String(editPurchaseData.amount),
                }}
                cards={cards} // Pass only registered cards
                onSubmit={async (values) => {
                  await editPurchase(editPurchaseData.id, {
                    ...values,
                    msi_term: Number(values.msi_term),
                    amount: Number(values.amount),
                  });
                  setShowEditModal(false);
                  setEditPurchase(null);
                }}
                onFormStateChange={({ isFormComplete }) => setIsFormComplete(isFormComplete)}
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              type="submit"
              form="purchase-form"
              disabled={loading || !isFormComplete}
              className="bg-primary/50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar compra</DialogTitle>
            <DialogDescription>Registra una nueva compra.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <PurchaseForm
              error={error}
              initialValues={{
                name: "",
                date: "",
                msi_term: "",
                card: "",
                amount: "",
                category: ""
              }}
              cards={cards}
              onSubmit={async (values) => {
                await purchasesCtx.addPurchase({
                  ...values,
                  msi_term: Number(values.msi_term),
                  amount: Number(values.amount),
                });
                setShowAddModal(false);
              }}
              onFormStateChange={({ isFormComplete }) => setIsFormComplete(isFormComplete)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              type="submit"
              form="purchase-form"
              disabled={loading || !isFormComplete}
              className="bg-primary/50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateSeparator(dateStr: string): string {
  const today = new Date();
  const date = parseLocalDate(dateStr);
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) return "Hoy";
  if (isYesterday) return "Ayer";
  return dateStr;
}