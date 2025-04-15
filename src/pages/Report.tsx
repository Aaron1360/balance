import Summary from "@/components/report/Summary";
import SpendingSummary from "@/components/report/SpendingSummary";
import UpcomingPayments from "@/components/report/UpcomingPayments";
function Report() {
  return (
    <div className="flex flex-col w-full h-full">
      <Summary/>
      <div className="flex my-5 gap-5">
        <SpendingSummary/>  
        <UpcomingPayments></UpcomingPayments>        
      </div>
    </div>
  );
}

export default Report;
