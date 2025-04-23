import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeTab from "./IncomeTab";
import OutcomeTab from "./OutcomeTab";

function NewTransactionTabs() {

  return (
    <Tabs defaultValue="income" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="income">Ingreso</TabsTrigger>
        <TabsTrigger value="expense">Gasto</TabsTrigger>
      </TabsList>

      {/* Income Tab */}
      <TabsContent value="income">
        <IncomeTab/>
      </TabsContent>

      {/* Outcome Tab */}
      <TabsContent value="expense">
        <OutcomeTab />
      </TabsContent>
    </Tabs>
  );
}

export default NewTransactionTabs;
