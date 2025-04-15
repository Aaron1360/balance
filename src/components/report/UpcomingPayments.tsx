import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a badge component
import { Receipt } from "lucide-react";
import { Link } from "react-router-dom";

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

// Create a formatter for Spanish abbreviated month and day (no year)
const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  month: "short",
  day: "numeric",
});

export default function UpcomingPayments() {
  return (
    <div className="flex flex-col min-w-xs bg-accent rounded-xl">
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader className="flex w-full justify-between items-center">
          <CardTitle className="flex justify-center items-center gap-2">
            <Receipt />
            Por Pagar
          </CardTitle>
          <Link to={"/dashboard/deudas"}>Ver todos</Link>
        </CardHeader>
      </Card>
      {paymentsData.map((payment) => (
        <Card key={payment.name} className="flex flex-col">
          <CardHeader className="flex justify-between items-center">
            <div className="flex w-full justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                {dateFormatter.format(new Date(payment.date))}
              </CardTitle>
              <Badge className="mt-1">{payment.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex w-full justify-between items-center">
            <p className="text-md font-medium">{payment.name}</p>
            <p className="text-lg font-bold">
              ${payment.amount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
