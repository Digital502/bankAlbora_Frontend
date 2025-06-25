import { useState } from 'react';
import { getPendingLoans, manageLoan } from '../../services/api';
import toast from 'react-hot-toast';

export const useCredit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);

  const fetchLoansByStatus = async (status) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPendingLoans(status);

      if (!data || data.error || !Array.isArray(data.loans)) {
        setLoans([]); 
        toast.error(data?.error?.message || data?.message || "Aún no hay prestamos", {icon: "⚠️"});
          setError(data?.error?.message || data?.message || "No hay préstamos disponibles");
          setLoans([]);
        return;
     }

      setLoans(data.loans); 
    } catch (err) {
      setLoans([]);
      toast.error(err.message || "Hubo un problema al obtener los préstamos");
      setError(err.message || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

const processLoan = async (loanData) => {
  setIsLoading(true);
  try {
    const response = await manageLoan(loanData);

    if (response.error) {
      throw new Error(
        response.e?.response?.data?.error || "Error al procesar el préstamo"
      );
    }

    return response.data;
  } catch (err) {
    const backendMessage = err?.response?.data?.error;
    console.error("Error al procesar el préstamo:", backendMessage || err.message);
    throw new Error(backendMessage || err.message || "Error desconocido");
  } finally {
    setIsLoading(false);
  }
};

  return {
    loans,
    processLoan,
    fetchLoansByStatus,
    isLoading,
    error,
  };
};