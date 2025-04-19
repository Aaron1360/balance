import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DebtCard } from "./DebtCard"
import type { DebtItem } from "@/types/debt"

interface DebtCategorySectionProps {
  title: string
  debts: DebtItem[]
  onViewDetails: (debt: DebtItem) => void
  onMakePayment: (debt: DebtItem) => void
  onDeleteDebt: (debt: DebtItem) => void
}

export function DebtCategorySection({
  title,
  debts,
  onViewDetails,
  onMakePayment,
  onDeleteDebt,
}: DebtCategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (debts.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {debts.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onViewDetails={onViewDetails}
              onMakePayment={onMakePayment}
              onDeleteDebt={onDeleteDebt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
