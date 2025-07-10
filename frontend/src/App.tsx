import type { Purchase } from "@/lib/types";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API_URL = "http://localhost:3001"

function App() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [form, setForm] = useState({
    name: "",
    date: "",
    msi_term: "",
    card: "",
    amount: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(`${API_URL}/purchases`)
        const data = await res.json()
        setPurchases(data.purchases || data)
      } catch {
        setError("No se pudieron cargar las compras")
      }
    }
    fetchPurchases()
  }, [])

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle form submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)
  try {
    const res = await fetch(`${API_URL}/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        date: form.date,
        msi_term: Number(form.msi_term),
        card: form.card,
        amount: Number(form.amount),
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.message || "Error al registrar compra")
    }
    // Fetch the updated list of purchases after successful POST
    const updatedRes = await fetch(`${API_URL}/purchases`)
    const updatedPurchases = await updatedRes.json()
    // Always set an array
    setPurchases(Array.isArray(updatedPurchases) ? updatedPurchases : updatedPurchases.purchases || [])
    setForm({ name: "", date: "", msi_term: "", card: "", amount: "" })
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError("Ocurrió un error desconocido")
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar compra MSI</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2">Compras registradas</h2>
        <div className="flex flex-col gap-2">
          {purchases.length === 0 && <div>No hay compras registradas.</div>}
          {purchases.map(p => (
            <Card key={p.id}>
              <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-4">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.date} | {p.card} | {p.msi_term} MSI
                  </div>
                </div>
                <div>
                  <span className="font-mono">${p.amount.toFixed(2)}</span>
                  <span className="ml-2 text-xs">
                    Pagos: {p.payments_made}/{p.msi_term}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App