import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { MetricsScreen } from "@/components/MetricsScreen";
import { SettingsScreen } from "@/components/SettingsScreen";
import { Home, BarChart, Settings } from "lucide-react";
import { PurchaseForm } from "@/components/PurchaseForm";
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
import { usePurchases } from "@/hooks/usePurchases";

export default function App() {
  const [tab, setTab] = useState<"home" | "metrics" | "settings">("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const { addPurchase, loading, error } = usePurchases();

  // Handler for form submit
  const handleAddPurchase = async (values: {
    name: string;
    date: string;
    msi_term: string;
    card: string;
    amount: string;
    category: string;
  }) => {
    await addPurchase({
      name: values.name,
      date: values.date,
      msi_term: Number(values.msi_term),
      card: values.card,
      amount: Number(values.amount),
      category: values.category,
    });
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <div className="flex-1">
        {tab === "home" && (
          <HomeScreen
            onAdd={() => setShowAddModal(true)}
          />
        )}
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
      {/* Add Purchase Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar compra</DialogTitle>
            <DialogDescription>
              Llena los datos para registrar una nueva compra.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <PurchaseForm
              error={error}
              onSubmit={handleAddPurchase}
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