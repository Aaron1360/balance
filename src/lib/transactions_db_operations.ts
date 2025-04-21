import { supabase } from "@/supabase/client";
import { Transaction } from "../types/transactions";

// Function to fetch transactions
export async function fetchTransactions(): Promise<Transaction[] | null> {
  try {
    const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });;

    if (error) {
      console.error("Error fetching data:", error);
      return null; // Return null if there's an error
    } else {
      return data as Transaction[];
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null; // Return null if there's an error
  }
}

// Function to insert a new transaction
export async function insertTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<void> {
    try {
      const { data, error } = await supabase.from("transactions").insert([transaction]);
  
      if (error) {
        throw error;
      }
      console.log("Expense added:", data);
    } catch (error) {
      console.error("Error inserting transaction:", error);
    }
  }
  

// Function to delete a transaction
export async function deleteTransaction(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting transaction:", error);
    } else {
      console.log(`Successfully deleted transaction with id ${id}`);
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
}

// Function to update a transaction
export async function updateTransaction(
  id: string,
  updatedTransaction: Partial<Transaction>
): Promise<void> {
  try {
    const { error } = await supabase
      .from("transactions")
      .update(updatedTransaction)
      .eq("id", id);

    if (error) {
      console.error("Supabase UPDATE error", error);
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
}
