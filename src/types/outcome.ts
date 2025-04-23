export type outcome = {
    date: Date,
    description: string,
    category: string,
    payment_method: string,
    payment_type: string,
    amount: number,
    merchant: string,
    status: string,
    reference?: string,
    msi?: number,
    notes?: string,
    tags?: string[],
  }