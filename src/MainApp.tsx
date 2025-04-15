import Header from "./components/Header";
import InputArea from "./components/InputArea";
import Total from "./components/Total";
import TransactionsTable from "./components/TransactionsTable";
import { useTableContext } from "./context/TableContext";

function MainApp() {
    const { transactions } = useTableContext();
  
    return (
      <div className="flex flex-col justify-start items-center w-screen h-screen bg-gray-200">
        <Header />
        <div className="grid grid-cols-2 gap-4 p-4">
          <InputArea/>
          {transactions && <Total/>}
        </div>
        <div className="flex flex-row w-full">
          <TransactionsTable></TransactionsTable>
        </div>
      </div>
    );
  }
  
export default MainApp
