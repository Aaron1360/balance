import { CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

interface Installment {
    date: Date;
    amount: number;
    paid: boolean;
  }

interface PendingPaymentsProps {
  installments: Installment[];
}

function PendingPayments({ installments }: PendingPaymentsProps) {
  return (
    <>
      {installments.length > 0 && (
        <Card className="col-span-2">
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-2 block">
              Pagos pendientes
            </Label>
            <div className="max-h-[200px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((installment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {format(installment.date, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {installment.amount.toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {installment.paid ? (
                          <span className="flex items-center justify-end text-green-600">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Pagado
                          </span>
                        ) : (
                          <span className="flex items-center justify-end text-amber-600">
                            <XCircle className="h-4 w-4 mr-1" /> Pendiente
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default PendingPayments;
