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
  });

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPurchase({
      name: form.name,
      date: form.date,
      msi_term: Number(form.msi_term),
      card: form.card,
      amount: Number(form.amount),
    });
    setForm({ name: "", date: "", msi_term: "", card: "", amount: "" });
    setShowAddModal(false);
  };

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
      <div
        className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${
          showAddModal ? "visible bg-black/40" : "invisible bg-transparent pointer-events-none"
        }`}
        aria-hidden={!showAddModal}
      >
        <div
          className={`bg-card w-full max-w-md rounded-t-lg p-4 transition-transform duration-300 ${
            showAddModal ? "translate-y-0" : "translate-y-full"
          }`}
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
            <Button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </Button>
            {error && <div className="text-red-500">{error}</div>}
          </form>
          <button className="mt-4 w-full text-center text-muted-foreground" onClick={() => setShowAddModal(false)}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}