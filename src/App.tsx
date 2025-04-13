import Header from "./components/Header";
import InputArea from "./components/InputArea";
import TransactionsTable from "./components/TransactionsTable";
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
      <InputArea onSubmitSuccess={loadTransactions}></InputArea>
      {transactions && (
        <TransactionsTable
          data={transactions}
          onUpdate={loadTransactions}
        ></TransactionsTable>
      )}
      {!transactions && <div>Loading...</div>}
      {/* </TableContextProvider> */}
    </div>
  );
}

export default App;
