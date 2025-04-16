import Summary from "@/components/report/Summary";
import SpendingSummary from "@/components/report/SpendingSummary";
import UpcomingPayments from "@/components/report/UpcomingPayments";
import LatestTransactions from "@/components/report/LatestTransactions";
function Report() {
  return (
    <div className="flex flex-col w-full h-full px-3">
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
