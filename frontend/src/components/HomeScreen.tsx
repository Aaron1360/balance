import { usePurchases } from "@/hooks/usePurchases";
import { Plus } from "lucide-react";

type HomeScreenProps = {
  onAdd: () => void;
};

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

export function HomeScreen({ onAdd }: HomeScreenProps) {
  const { purchases, totalDebt, loading } = usePurchases();

  // Group purchases by date
  const grouped: Record<string, typeof purchases> = {};
  purchases.forEach((p) => {
    if (!grouped[p.date]) grouped[p.date] = [];
    grouped[p.date].push(p);
  });

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-4 pb-20">
      <header className="mb-4 flex items-center justify-end">
        <button
          className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl shadow"
          onClick={onAdd}
          aria-label="Agregar compra"
        >
          <Plus size={20} />
        </button>
      </header>
      <section className="mb-8 mt-8 flex flex-col items-center">
        <div className="text-muted-foreground mb-2">Saldo al corte</div>
        <div className="text-5xl font-bold mb-4">${totalDebt.toFixed(2)}</div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Historial de compras</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : purchases.length === 0 ? (
          <div className="text-muted-foreground">No hay compras registradas.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="text-sm font-semibold text-muted-foreground mb-2">
                  {formatDateSeparator(date)}
                </div>
                <ul className="flex flex-col gap-2">
                  {grouped[date].map((p) => (
                    <li key={p.id} className="border rounded p-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.card} | {p.msi_term} MSI
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono">${p.amount.toFixed(2)}</div>
                        <div className="text-xs">
                          Pagos: {p.payments_made}/{p.msi_term}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}