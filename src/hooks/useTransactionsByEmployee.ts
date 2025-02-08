import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string | null) => {
      if (!employeeId) {
        setTransactionsByEmployee(null);
        return;
      }

      try {
        const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
          "transactionsByEmployee",
          { employeeId }
        );
        setTransactionsByEmployee(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactionsByEmployee(null); // Ensure it does not crash
      }
    },[fetchWithCache]
  );
  

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}
