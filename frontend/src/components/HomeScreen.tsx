import { usePurchases } from "@/hooks/usePurchases";

type HomeScreenProps = {
  onAdd: () => void;
};

export function HomeScreen({ onAdd }: HomeScreenProps) {
  const { purchases, totalDebt, loading } = usePurchases();

  return (
    <div className="p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Balance</h1>
        <button
          className="bg-primary text-white rounded-full p-2"
          onClick={onAdd}
          aria-label="Agregar compra"
        >
          +
        </button>
      </header>
      <section className="mb-6 text-center">
        <div className="text-muted-foreground">Pago total este mes</div>
        <div className="text-4xl font-bold">${totalDebt.toFixed(2)}</div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Historial de compras</h2>
        {loading ? (
          <div>Cargando...</div>
        ) : purchases.length === 0 ? (
          <div className="text-muted-foreground">No hay compras registradas.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {purchases.map((p) => (
              <li key={p.id} className="border rounded p-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.date} | {p.card} | {p.msi_term} MSI
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
        )}
      </section>
    </div>
  );
}