import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a badge component
import { Repeat } from "lucide-react";
import { Link } from "react-router-dom";

// Example transaction data
const transactions = [
  {
    id: 1,
    nombre: "Compra supermercado",
    cantidad: 1500,
    categoria: "Alimentos",
    fecha: "2025-04-10",
    metodoPago: "Tarjeta de crédito",
    msi: 3,
    descripcion: "Compra mensual de alimentos",
  },
  {
    id: 2,
    nombre: "Pago luz",
    cantidad: 600,
    categoria: "Servicios",
    fecha: "2025-04-12",
    metodoPago: "Débito automático",
    msi: 0,
    descripcion: "Factura de electricidad",
  },
  {
    id: 3,
    nombre: "Gasolina",
    cantidad: 800,
    categoria: "Transporte",
    fecha: "2025-04-14",
    metodoPago: "Efectivo",
    msi: 0,
    descripcion: "Llenado de tanque",
  },
  // Add more transactions as needed
];

// Date formatter for Spanish abbreviated month and day
const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  month: "short",
  day: "numeric",
});

export default function LatestTransactions() {
  // Calculate total amount for footer
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.cantidad, 0);

  return (
    <>
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader className="flex w-full justify-between items-center">
          <CardTitle className="flex justify-center items-center gap-2">
            <Repeat />
            Transacciones Recientes
          </CardTitle>
          <Link to={"/dashboard/transacciones"} className="underline">Ver todos</Link>
        </CardHeader>
      </Card>
      <Table>
        <TableCaption>Últimas transacciones realizadas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">#</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Metodo de pago</TableHead>
            <TableHead className="text-center">MSI</TableHead>
            <TableHead>Descripcion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">{tx.id}</TableCell>
              <TableCell>{tx.nombre}</TableCell>
              <TableCell className="text-right">
                ${tx.cantidad.toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge className="w-full">{tx.categoria}</Badge>
              </TableCell>
              <TableCell>{dateFormatter.format(new Date(tx.fecha))}</TableCell>
              <TableCell>{tx.metodoPago}</TableCell>
              <TableCell className="text-center">{tx.msi}</TableCell>
              <TableCell>{tx.descripcion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              ${totalAmount.toLocaleString()}
            </TableCell>
            <TableCell colSpan={5}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
