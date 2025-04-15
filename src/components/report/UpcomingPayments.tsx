import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a badge component
import { Label } from "../ui/label";
// Example payment data
const paymentsData = [
  {
    date: "2025-04-20",
    category: "Alquiler",
    name: "Renta de Abril",
    amount: 1200,
  },
  {
    date: "2025-04-25",
    category: "Servicios",
    name: "Factura de Electricidad",
    amount: 150,
  },
  {
    date: "2025-05-01",
    category: "Transporte",
    name: "Pago de Transporte Mensual",
    amount: 50,
  },
  {
    date: "2025-05-05",
    category: "Comida",
    name: "Compra de Alimentos",
    amount: 300,
  },
];

export default function UpcomingPayments() {
  return (
    <div className="space-y-4">
        <div>
            <Label>Pagos Pendientes</Label>
        </div>
      {paymentsData.map((payment) => (
        <Card key={payment.name} className="flex flex-col">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">{payment.date}</CardTitle>
              <Badge className="mt-1">{payment.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col mt-2">
            <p className="text-md font-medium">{payment.name}</p>
            <p className="text-lg font-bold">${payment.amount.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
