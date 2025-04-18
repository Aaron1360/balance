import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeTab from "./IncomeTab";
import OutcomeTab from "./OutcomeTab";

function NewTransactionTabs() {
    const [date, setDate] = useState<Date>();

  return (
    <Tabs defaultValue="income" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="income">Ingreso</TabsTrigger>
        <TabsTrigger value="expense">Gasto</TabsTrigger>
      </TabsList>

      {/* Pestaña de Ingresos */}
      <TabsContent value="income">
        <IncomeTab/>
      </TabsContent>

      {/* Pestaña de Gastos */}
      <TabsContent value="expense">
        <OutcomeTab date={date} setDate={setDate}/>
      </TabsContent>
    </Tabs>
  );
}

export default NewTransactionTabs;
