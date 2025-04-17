import { useAppContext } from "@/context/AppContext";
import SelectPeriod from "./SelectPeriod";
import { Progress } from "@/components/ui/progress";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from "lucide-react";
import { useEffect, useState } from "react";

const categories = [
  "Alimentos",
  "Servicios",
  "Transporte",
  "Entretenimiento",
  "Compras",
  "Salud",
  "Credito",
  "Ahorros",
  "Otros",
];

// Example spending data (percentage values)
const spendingData: Record<string, number> = {
  Alimentos: 30,        
  Servicios: 15,        
  Transporte: 10,       
  Entretenimiento: 8,   
  Compras: 12,          
  Salud: 5,             
  Credito: 10,          
  Ahorros: 7,           
  Otros: 3,             
};

export default function SpendingSummary() {
  const { SummaryDate ,currentSummaryDate } = useAppContext();
  
    const [localSelectedPeriod, setLocalSelectedPeriod] = useState(currentSummaryDate); // Default to global period
    
    // Sync local state with globalPeriod whenever it changes
    useEffect(() => {
      setLocalSelectedPeriod(SummaryDate);
    }, [SummaryDate]);

  return (
    <Card className="w-full">
      <CardHeader className="flex w-full justify-between items-center">
        <CardTitle className="flex justify-center items-center gap-2"><ChartPie/>Resumen de Gastos</CardTitle>
        <SelectPeriod
          value={localSelectedPeriod}
          onValueChange={setLocalSelectedPeriod}
        ></SelectPeriod>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <Label>{category}</Label>
              <Label>{spendingData[category]}%</Label>
            </div>
            <Progress value={spendingData[category]} className="h-4 rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
