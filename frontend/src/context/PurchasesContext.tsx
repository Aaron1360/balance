import React, { createContext, useState, useEffect } from "react";
import type { Purchase } from "@/lib/types";

const API_URL = "http://localhost:3001";

export type PurchasesContextType = {
  purchases: Purchase[];
  totalDebt: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, "id" | "payments_made">) => Promise<void>;
};

export const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const debtRes = await fetch(`${API_URL}/debt-overview`);
      const debtData = await debtRes.json();
      setTotalDebt(debtData.total_outstanding || 0);

      const purchasesRes = await fetch(`${API_URL}/purchases`);
      const purchasesData = await purchasesRes.json();
      setPurchases(Array.isArray(purchasesData) ? purchasesData : purchasesData.purchases || []);
    } catch {
      setError("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = fetchData;

  const addPurchase = async (purchase: Omit<Purchase, "id" | "payments_made">) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchase),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Error al registrar compra");
      }
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar compra");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchasesContext.Provider value={{ purchases, totalDebt, loading, error, refresh, addPurchase }}>
      {children}
    </PurchasesContext.Provider>
  );
};