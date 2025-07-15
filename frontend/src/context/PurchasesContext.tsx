import React, { createContext, useState, useEffect } from "react";
import type { Purchase } from "@/lib/types";

export const API_URL = "http://192.168.1.117:3001";
const PAGE_SIZE = 10;

export type Profile = { id?: number; username: string; avatar: string } | null;

export type CardType = {
  id: number;
  brand: string;
  payment_date: number;
};

export type PurchasesContextType = {
  purchases: Purchase[];
  totalDebt: number;
  totalMonthlyPayment: number;
  total: number;
  page: number;
  setPage: (page: number) => void;
  loading: boolean;
  error: string | null;
  refresh: (newFilters?: { start: string; end: string; category: string; state: string }) => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, "id" | "payments_made">) => Promise<void>;
  payOffPurchase: (p: Purchase) => Promise<void>;
  deletePurchase: (id: number) => Promise<void>;
  editPurchase: (id: number, updates: Partial<Purchase>) => Promise<void>;
  // Profile management
  profile: Profile;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;
  saveProfile: (username: string, avatar: string, isEdit: boolean) => Promise<void>;
  deleteProfile: () => Promise<void>;
  // Card management
  cards: CardType[];
  cardsLoading: boolean;
  refreshCards: () => Promise<void>;
  addCard: (brand: string, payment_date: number) => Promise<void>;
  editCard: (id: number, brand: string, payment_date: number) => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
};

export const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ start: "", end: "", category: "", state: "" });
  // Profile state
  const [profile, setProfile] = useState<Profile>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  // Cards state
  const [cards, setCards] = useState<CardType[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);

  const fetchData = async (newFilters = filters) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", PAGE_SIZE.toString());
    if (newFilters.start) params.append("start", newFilters.start);
    if (newFilters.end) params.append("end", newFilters.end);
    if (newFilters.category) params.append("category", newFilters.category);
    if (newFilters.state) params.append("state", newFilters.state);

    try {
      // Fetch filtered count
      const countRes = await fetch(`${API_URL}/purchases/count?${params.toString()}`);
      const countData = await countRes.json();
      setTotal(countData.count || 0);

      // Fetch filtered purchases
      const purchasesRes = await fetch(`${API_URL}/purchases?${params.toString()}`);
      const purchasesData = await purchasesRes.json();
      setPurchases(Array.isArray(purchasesData) ? purchasesData : purchasesData.purchases || []);
      setFilters(newFilters);

      // Fetch debt overview (totalDebt and totalMonthlyPayment)
      const debtRes = await fetch(`${API_URL}/debt-overview`);
      const debtData = await debtRes.json();
      setTotalDebt(debtData.total_outstanding || 0);
      setTotalMonthlyPayment(debtData.total_monthly_payment || 0);
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

  const payOffPurchase = async (p: Purchase) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${API_URL}/purchases/${p.id}/payoff`, { method: "POST" });
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

  const deletePurchase = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${API_URL}/purchases?id=${id}`, { method: "DELETE" });
      await fetchData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al eliminar compra");
      }
    } finally {
      setLoading(false);
    }
  };

  const editPurchase = async (id: number, updates: Partial<Purchase>) => {
    setLoading(true);
    setError(null);
    try {
      // If changing from MSI to single payment, set payments_made to 1 and msi_term to 0
      let patchData = { ...updates };
      if (
        ('msi_term' in patchData) &&
        (patchData.msi_term === 0 || patchData.msi_term === null || patchData.msi_term === undefined)
      ) {
        patchData.payments_made = 1;
        patchData.msi_term = 0;
      }
      await fetch(`${API_URL}/purchases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
      await fetchData();
    } catch {
      setError("Error al editar compra");
    } finally {
      setLoading(false);
    }
  };

  // Profile management
  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch(`${API_URL}/profile`);
      if (!res.ok) throw new Error("No profile");
      const data = await res.json();
      setProfile({ id: data.id, username: data.username || "", avatar: data.avatar || "" });
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const saveProfile = async (username: string, avatar: string, isEdit: boolean) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const method = isEdit ? "PATCH" : "PUT";
      const res = await fetch(`${API_URL}/profile`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, avatar }),
      });
      if (!res.ok) throw new Error("Error al guardar perfil");
      const data = await res.json();
      setProfile({ id: data.id, username: data.username, avatar: data.avatar });
    } catch (err: any) {
      setProfileError(err.message || "Error al guardar perfil");
    } finally {
      setProfileLoading(false);
    }
  };

  const deleteProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await fetch(`${API_URL}/profile`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar perfil");
      setProfile(null);
    } catch (err: any) {
      setProfileError(err.message || "Error al eliminar perfil");
    } finally {
      setProfileLoading(false);
    }
  };

  // Cards management
  const refreshCards = async () => {
    setCardsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cards`);
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } catch {
      setCards([]);
    } finally {
      setCardsLoading(false);
    }
  };

  const addCard = async (brand: string, payment_date: number) => {
    setCardsLoading(true);
    try {
      await fetch(`${API_URL}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, payment_date }),
      });
      await refreshCards();
    } finally {
      setCardsLoading(false);
    }
  };

  const editCard = async (id: number, brand: string, payment_date: number) => {
    setCardsLoading(true);
    try {
      await fetch(`${API_URL}/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, payment_date }),
      });
      await refreshCards();
    } finally {
      setCardsLoading(false);
    }
  };

  const deleteCard = async (id: number) => {
    setCardsLoading(true);
    try {
      await fetch(`${API_URL}/cards/${id}`, { method: "DELETE" });
      await refreshCards();
    } finally {
      setCardsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    refreshCards();
  }, []);

  return (
    <PurchasesContext.Provider value={{
      purchases, totalDebt, totalMonthlyPayment, total, page, setPage, loading, error, refresh, addPurchase, payOffPurchase, deletePurchase, editPurchase,
      profile, profileLoading, profileError, fetchProfile, saveProfile, deleteProfile,
      cards, cardsLoading, refreshCards, addCard, editCard, deleteCard,
    }}>
      {children}
    </PurchasesContext.Provider>
  );
};