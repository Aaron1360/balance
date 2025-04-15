import Summary from "@/components/report/Summary";
import SpendingSummary from "@/components/report/SpendingSummary";

function Report() {
  return (
    <div className="flex flex-col w-full h-full">
      <Summary/>
      <div className="flex">
        <SpendingSummary/>          
      </div>
    </div>
  );
}

export default Report;
