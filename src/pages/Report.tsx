import { useAppContext } from "@/context/AppContext";
import SelectPeriod from "@/components/report/SelectPeriod";
import Summary from "@/components/report/Summary";
import SpendingSummary from "@/components/report/SpendingSummary";
import UpcomingPayments from "@/components/report/UpcomingPayments";
import LatestTransactions from "@/components/report/LatestTransactions";
function Report() {
  const { SummaryDate, setSummaryDate } = useAppContext();
  return (
    <div className="flex flex-col w-full h-full px-3">
      {/* Global Select controlling all SummaryItems */}
      <SelectPeriod
        value={SummaryDate}
        onValueChange={setSummaryDate}
      />
      <Summary/>
      <div className="flex my-5 gap-5 flex-2">
        <div className="flex flex-col gap-5 flex-1">
        <SpendingSummary/>  
        <LatestTransactions/>
        </div>
        <UpcomingPayments></UpcomingPayments>        
      </div>
    </div>
  );
}

export default Report;
