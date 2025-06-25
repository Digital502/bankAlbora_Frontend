import { useEffect, useState } from "react";
import { myAccount, getIngresosByNumeroCuenta } from "../../services/api";
import { toast } from "react-hot-toast";

export const useMyAccountsAndIngresos = () => {
  const [accounts, setAccounts] = useState([]);
  const [ingresos, setIngresos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyAccounts = async () => {
    try {
      setLoading(true);
      const response = await myAccount();

      if (response?.account) {
        setAccounts(response.account);
        setError(null);

        const ingresosPorCuenta = {};
        for (const cuenta of response.account) {
          try {
            const ingresosResponse = await getIngresosByNumeroCuenta(cuenta.numeroCuenta);
            if (ingresosResponse?.movimientos) {
              ingresosPorCuenta[cuenta.numeroCuenta] = ingresosResponse.movimientos;
            } else {
              ingresosPorCuenta[cuenta.numeroCuenta] = [];
            }
          } catch (err) {
            ingresosPorCuenta[cuenta.numeroCuenta] = [];
          }
        }

        setIngresos(ingresosPorCuenta);
      } else {
        throw new Error(response.message || "No se encontraron cuentas");
      }
    } catch (err) {
      toast.error(err.message || "Error al obtener cuentas");
      setError(err.message || "Error desconocido");
      setAccounts([]);
      setIngresos({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAccounts();
  }, []);

  return {
    accounts,           
    ingresos,           
    loading,
    error,
    refetch: fetchMyAccounts,
  };
};