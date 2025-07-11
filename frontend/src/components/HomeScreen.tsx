import { useState } from "react";
import { usePurchases } from "@/hooks/usePurchases";
import { Plus } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from "@/components/ui/pagination";

type HomeScreenProps = {
  onAdd: () => void;
};

const PAGE_SIZE = 10;

export function HomeScreen({ onAdd }: HomeScreenProps) {
  const { purchases, total, loading, page, setPage, totalDebt, refresh } = usePurchases();

  // Filter state
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState(""); // "", "paid", "unpaid"
  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <div className="p-4 pb-32 bg-background text-foreground">
      <header className="mb-4 flex items-center justify-end">
        <button
          className="text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow mt-3 ring-2 ring-accent/40 bg-card"
          onClick={onAdd}
          aria-label="Agregar compra"
        >
          <Plus size={24} />
        </button>
      </header>
      <section className="mb-10 mt-0 flex flex-col items-center">
        <div className="text-muted-foreground font-semibold mb-2 text-xl">Saldo al corte</div>
        <div className="relative my-4">
          <span className="text-4xl font-extrabold text-primary/60 ring-2 ring-accent/30 rounded-xl px-4 py-2 bg-card/90">
            {totalDebt > 0 ? "-" : ""}${totalDebt.toFixed(2)}
          </span>
        </div>
      </section>
      <section className="flex items-center justify-between mb-2">
        <h2 className="text-md font-semibold mb-2 text-muted-foreground">Historial de compras</h2>
        <div className="relative">
          <button
            className="bg-card text-foreground px-3 py-1 rounded shadow"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-lg p-4 w-64">
              <div className="flex flex-col gap-3">
                <label className="text-xs text-muted-foreground">Fecha inicial:</label>
                <input
                  type="date"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  className="bg-background text-foreground px-2 py-1 rounded"
                />
                <label className="text-xs text-muted-foreground">Fecha final:</label>
                <input
                  type="date"
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  className="bg-background text-foreground px-2 py-1 rounded"
                />
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
                      className={`border border-border rounded-lg p-3 flex justify-between items-center shadow-sm`}
                      style={
                        p.payments_made === p.msi_term
                          ? { backgroundColor: "var(--card-paid)" }
                          : undefined
                      }
                    >
                      <div>
                        <div className="font-medium text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.card} | {p.msi_term} MSI | {p.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-mono ${
                            p.payments_made === p.msi_term ? "text-primary" : "text-destructive"
                          }`}
                        >
                          ${p.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pagos: {p.payments_made}/{p.msi_term}
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