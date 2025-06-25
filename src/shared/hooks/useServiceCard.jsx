import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  addEmitirTarjeta,
  getAccounts,
  getAccountById,
} from "../../services/api";
import toast from "react-hot-toast";

const getUserIdFromToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    return parsed.uid;
  } catch (error) {
    return null;
  }
};

export const useEmitirTarjeta = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const token = parsedUser?.token;
  const userId = getUserIdFromToken(token);

  const emitirNuevaTarjeta = async ({ numeroCuenta, tipo }) => {
  if (!numeroCuenta || !tipo) {
    toast.error("Faltan campos obligatorios");
    return;
  }

  setIsLoading(true);

    try {
    const response = await addEmitirTarjeta({ numeroCuenta, tipo });

    if (!response || response.error) {
    throw new Error(response?.message || "Error al emitir la tarjeta");
    }

    const nuevaTarjeta = response.data || response;

    setTarjetas((prev) => [...prev, nuevaTarjeta]);

    toast.success(response.message || "Tarjeta emitida correctamente");
    } catch (error) {
        toast.error(error?.message || "Ocurrió un problema al emitir la tarjeta");
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

      const formatted = data.account.map((account) => ({
        numeroCuenta: account.numeroCuenta,
        tipoCuenta: account.tipoCuenta,
        saldoCuenta: account.saldoCuenta,
        label: `${account.numeroCuenta} - ${account.tipoCuenta}`,
        value: account._id, 
      }));

      setAccounts(formatted);
    } catch (err) {
      toast.error(
        err.message || "Hubo un problema al obtener las cuentas del usuario"
      ,{
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

      const formatted = data.accounts.map((account) => ({
        numeroCuenta: account.numeroCuenta,
        tipoCuenta: account.tipoCuenta,
        saldoCuenta: account.saldoCuenta,
        label: `${account.numeroCuenta} - ${account.tipoCuenta}`,
        value: account._id,
      }));

      setAllAccounts(formatted);
    } catch (err) {
      toast.error(
        err.message || "Hubo un problema al obtener todas las cuentas"
      );
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
    tarjetas,
    emitirNuevaTarjeta,
    fetchAccounts,
    isLoading,
  };
};
