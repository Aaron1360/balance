import Header from "./components/Header";
import InputArea from "./components/InputArea";
import TransactionsTable from "./components/TransactionsTable";

export interface Transactions {
  id: string;
  amount: string | number;
  date: string;
  category: string;
  description: string;
}

function App() {
  return (
    <div className="flex flex-col justify-start items-center w-screen h-screen bg-gray-200">
      <Header />
      {/* <tableContext.Provider value={}> */}
      <InputArea></InputArea>
      <TransactionsTable></TransactionsTable>
      {/* </tableContext.Provider> */}
    </div>
  );
}

export default App;
