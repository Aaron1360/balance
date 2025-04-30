import { supabase } from "@/supabase/client";

// Function to fetch data from any table with optional filters
export async function fetchTableData<T>(
  tableName: string,
  filters?: Record<string, string | number | boolean>
): Promise<T[]> {
  let query = supabase.from(tableName).select("*");

  // Apply filters if provided
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  const { data, error } = await query.order("date", { ascending: false });

  if (error) {
    throw new Error(`Error fetching data from ${tableName}: ${error.message}`);
  }

  return data as T[];
}

// Function to insert data into any table
export async function insertTableData<T>(
  tableName: string,
  record: Omit<T, "id">
): Promise<T> {
  const { data, error } = await supabase.from(tableName).insert([record]).select();

  if (error) {
    throw new Error(`Error inserting data into ${tableName}: ${error.message}`);
  }

  return data[0] as T; // Return the inserted record
}

// Function to delete data from any table
export async function deleteTableData(
  tableName: string,
  id: string
): Promise<void> {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting data from ${tableName}: ${error.message}`);
  }
}

// Function to update data in any table
export async function updateTableData<T>(
  tableName: string,
  id: string,
  updatedRecord: Partial<T>
): Promise<T> {
  const { data, error } = await supabase
    .from(tableName)
    .update(updatedRecord)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(`Error updating data in ${tableName}: ${error.message}`);
  }

  return data[0] as T; // Return the updated record
}