import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { MetricsScreen } from "@/components/MetricsScreen";
import { SettingsScreen } from "@/components/SettingsScreen";
import { usePurchases } from "@/hooks/usePurchases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, BarChart, Settings } from "lucide-react";

export default function App() {
  const [tab, setTab] = useState<"home" | "metrics" | "settings">("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const { addPurchase, loading, error } = usePurchases();
  const [form, setForm] = useState({
    name: "",
    date: "",
    msi_term: "",
    card: "",
    amount: "",
    category: "",
  });

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? value : value
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const purchaseData = {
      ...form,
      category: form.category.trim() === "" ? "Sin categoria" : form.category
    };
    await addPurchase({
      name: purchaseData.name,
      date: purchaseData.date,
      msi_term: Number(purchaseData.msi_term),
      card: purchaseData.card,
      amount: Number(purchaseData.amount),
      category: purchaseData.category,
    });
    setForm({ name: "", date: "", msi_term: "", card: "", amount: "", category: "" });
    setShowAddModal(false);
  };

  const isFormComplete =
    form.name.trim() !== "" &&
    form.date !== "" &&
    form.msi_term !== "" &&
    Number(form.msi_term) > 0 &&
    form.card.trim() !== "" &&
    form.amount !== "" &&
    Number(form.amount) > 0;

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <div className="flex-1">
        {tab === "home" && <HomeScreen onAdd={() => setShowAddModal(true)} />}
        {tab === "metrics" && <MetricsScreen />}
        {tab === "settings" && <SettingsScreen />}
      </div>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-primary/40 border-t border-border flex justify-around py-2 backdrop-blur-md">
        <button
          onClick={() => setTab("home")}
          className={tab === "home" ? "text-primary-foreground" : "text-primary-foreground/60"}
          aria-label="Inicio"
        >
          <Home size={28} />
        </button>
        <button
          onClick={() => setTab("metrics")}
          className={tab === "metrics" ? "text-primary-foreground" : "text-primary-foreground/60"}
          aria-label="Métricas"
        >
          <BarChart size={28} />
        </button>
        <button
          onClick={() => setTab("settings")}
          className={tab === "settings" ? "text-primary-foreground" : "text-primary-foreground/60"}
          aria-label="Configuración"
        >
          <Settings size={28} />
        </button>
      </nav>
      {/* Add Purchase Modal with transition */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label>Nombre</Label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label>Fecha</Label>
                <Input type="date" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div>
                <Label>Plazo MSI (meses)</Label>
                <Input type="number" name="msi_term" value={form.msi_term} onChange={handleChange} min={1} required />
              </div>
              <div>
                <Label>Tarjeta</Label>
                <Input name="card" value={form.card} onChange={handleChange} required />
              </div>
              <div>
                <Label>Monto</Label>
                <Input type="number" name="amount" value={form.amount} onChange={handleChange} min={0.01} step="0.01" required />
              </div>
              <div>
                <Label>Categoría</Label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="bg-background text-foreground px-2 py-1 rounded w-full"
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
              </div>
              <Button
                type="submit"
                disabled={loading || !isFormComplete}
                className="bg-primary/50 text-primary-foreground px-4 py-1 rounded mt-2"
              >
                {loading ? "Registrando..." : "Registrar"}
              </Button>
              {error && <div className="text-red-500">{error}</div>}
            </form>
            <button
              className="bg-muted-foreground text-foreground px-4 py-1 rounded mt-2 w-full text-center"
              onClick={() => setShowAddModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}