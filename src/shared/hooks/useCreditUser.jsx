import { useState } from "react";
import { requestLoan, getLoanPaymentDetails, payLoanAPI } from "../../services/api";

export const useLoan = () => {
  const [loanDetails, setLoanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLoanHandler = async (data) => {
    setIsLoading(true);
    try {
      const response = await requestLoan(data);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.error || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const getLoanDetailsHandler = async (cuentaDestino) => {
    setIsLoading(true);
    try {
      const response = await getLoanPaymentDetails(cuentaDestino);
      setLoanDetails(response);
    } catch (error) {
      throw new Error(error?.response?.data?.error || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const payLoanHandler = async (data) => {
    setIsLoading(true);
    try {
      const response = await payLoanAPI(data);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.error || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestLoan: requestLoanHandler,
    getLoanDetails: getLoanDetailsHandler,
    payLoan: payLoanHandler,
    loanDetails,
    isLoading,
  };
};