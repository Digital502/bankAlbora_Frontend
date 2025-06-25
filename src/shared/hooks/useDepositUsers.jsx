import { useNavigate } from "react-router-dom";
import { addDeposit, getAccountById, getAccounts } from "../../services/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const getUserIdFromToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    return parsed.uid;
  } catch (error) {
    return null;
  }
};

export const useDepositUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);       
  const [allAccounts, setAllAccounts] = useState([]); 
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const token = parsedUser?.token;
  const userId = getUserIdFromToken(token);

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
        throw new Error(
          response.e?.response?.data?.errors?.[0]?.msg ||
          "Error al procesar la transacción"
        );
      }

      await fetchAccounts(); 
      await fetchAllAccounts();  

      return response.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    if (!userId) {
      toast.error("No se encontró el ID del usuario");
      return;
    }

    setIsLoading(true);
    try {
      const data = await getAccountById(userId); 

      if (!data || data.error || !Array.isArray(data.account)) {
        throw new Error("Error al obtener las cuentas o lista vacía");
      }

      const formatted = data.account.map(account => ({
        numeroCuenta: account.numeroCuenta,
        tipoCuenta: account.tipoCuenta,
        saldoCuenta: account.saldoCuenta,
        label: `${account.numeroCuenta} - ${account.tipoCuenta}`,
        value: account.numeroCuenta
      }));

      setAccounts(formatted);
    } catch (err) {
      toast.error(err.message || "Hubo un problema al obtener las cuentas del usuario",{
          icon: "⚠️",
          closeButton: false,
        });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAccounts = async () => {
    try {
      const data = await getAccounts();

      if (!data || data.error || !Array.isArray(data.accounts)) {
        throw new Error("Error al obtener todas las cuentas o lista vacía");
      }

      const formatted = data.accounts.map(account => ({
        numeroCuenta: account.numeroCuenta,
        tipoCuenta: account.tipoCuenta,
        saldoCuenta: account.saldoCuenta,
        label: `${account.numeroCuenta} - ${account.tipoCuenta}`,
        value: account.numeroCuenta
      }));

      setAllAccounts(formatted);
    } catch (err) {
      toast.error(err.message || "Hubo un problema al obtener todas las cuentas");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAccounts();
      fetchAllAccounts();
    }
  }, [userId]);

  return {
    accounts,        
    allAccounts,    
    processTransaction,
    fetchAccounts,
    fetchAllAccounts,
    isLoading
  };
};
