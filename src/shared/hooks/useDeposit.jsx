import { useNavigate } from "react-router-dom";
import { addDeposit, getAccounts } from "../../services/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const useDeposit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  const processTransaction = async ({
    tipo,
    cuentaOrigen,
    monto,
    cuentaDestino
  }) => {
    setIsLoading(true);


    try {
      const response = await addDeposit({
        tipo,
        cuentaOrigen,
        monto,
        cuentaDestino: tipo === "transferencia" ? cuentaDestino : undefined
      });

      if (response.error) {
        throw new Error(response.e?.response?.data?.errors?.[0]?.msg ||
          "Error al procesar la transacción");
      }

      await fetchAccounts();

      return response.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getAccounts();
  
      if (!data || data.error || !Array.isArray(data.accounts)) {
        throw new Error("Error al obtener las cuentas o lista vacía");
      }
  

      const formatted = data.accounts.map(account => ({
        numeroCuenta: account.numeroCuenta,
        tipoCuenta: account.tipoCuenta,
        saldoCuenta: account.saldoCuenta,
        label: `${account.numeroCuenta} - ${account.tipoCuenta}`,
        value: account.numeroCuenta
      }));
  
      setAccounts(formatted);
    } catch (err) {
      toast.error(err.message || "Hubo un problema al obtener las cuentas");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    processTransaction,  
    fetchAccounts,   
    isLoading
  };
};