import React, { createContext, useState, useEffect } from "react";
import type { Purchase } from "@/lib/types";

const API_URL = "http://localhost:3001";
const PAGE_SIZE = 10;

export type PurchasesContextType = {
  purchases: Purchase[];
  totalDebt: number;
  total: number;
  page: number;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refresh: (newFilters?: { start: string; end: string; category: string; state: string }) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, "id" | "payments_made">) => Promise<void>;
};

export const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ start: "", end: "", category: "", state: "" });

  const fetchData = async (newFilters = filters) => {
    setLoading(true);
    setError(null);

    // Build query string for filters
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", PAGE_SIZE.toString());
    if (newFilters.start) params.append("start", newFilters.start);
    if (newFilters.end) params.append("end", newFilters.end);
    if (newFilters.category) params.append("category", newFilters.category);
    if (newFilters.state) params.append("state", newFilters.state);

    try {
      const debtRes = await fetch(`${API_URL}/debt-overview`);
      const debtData = await debtRes.json();
      setTotalDebt(debtData.total_outstanding || 0);

      const countRes = await fetch(`${API_URL}/purchases/count`);
      const countData = await countRes.json();
      setTotal(countData.count || 0);

      const purchasesRes = await fetch(`${API_URL}/purchases?${params.toString()}`);
      const purchasesData = await purchasesRes.json();
      setPurchases(Array.isArray(purchasesData) ? purchasesData : purchasesData.purchases || []);
      setFilters(newFilters);
    } catch {
      setError("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const refresh = async (newFilters = filters) => {
    setPage(1);
    await fetchData(newFilters);
  };

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
    <PurchasesContext.Provider value={{
      purchases, totalDebt, total, page, setPage, loading, error, refresh, addPurchase
    }}>
      {children}
    </PurchasesContext.Provider>
  );
};