import Header from "./components/Header";
import InputArea from "./components/InputArea";
import TransactionsTable from "./components/TransactionsTable";
import Total from "./components/Total";
// import { TableContextProvider } from "./context/TableContext";
import { useEffect, useState } from "react";
import { fetchTransactions } from "./CRUD-operations";

export interface Transactions {
  id: string;
  amount: string | number;
  date: string;
  category: string;
  description: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transactions[] | undefined>(
    undefined
  );

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    if (data) setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center w-screen h-screen bg-gray-200">
      <Header />
      {/* <TableContextProvider> */}
      <div className="grid grid-cols-2 gap-4 p-4">
      <InputArea onSubmitSuccess={loadTransactions}></InputArea>
      {transactions && (<Total data={transactions}></Total>)}
      </div>
      <div className="flex flex-row w-full">
        {transactions && (
          <TransactionsTable
            data={transactions}
            onUpdate={loadTransactions}
          ></TransactionsTable>
        )}
        {!transactions && <div>Loading...</div>}
        {/* </TableContextProvider> */}
      </div>
    </div>
  );
}

export default App;
