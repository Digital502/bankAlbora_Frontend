import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getTransactions, myAccount } from "../../services/api";

export const useHistory = () => {
    const [accounts, setAccounts] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await myAccount();

            if (!res || res.error || !res.account) {
                throw new Error(res.message || "No se encontraron cuentas");
            }

            setAccounts(res.account);
            const todosMovimientos = [];

            for (const cuenta of res.account) {
                try {
                    const movsRes = await getTransactions(cuenta.numeroCuenta);
                    if (movsRes?.movimientos) {
                        todosMovimientos.push(...movsRes.movimientos);
                    } else {
                        toast(`Cuenta ${cuenta.numeroCuenta} no tiene movimientos.`,{icon:"⚠️"});
                    }
                } catch (err) {
                    toast(`Error al obtener movimientos de la cuenta ${cuenta.numeroCuenta}`, err.message || err,{icon:"⚠️"});
                }
            }

            const ordenados = todosMovimientos.sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );

            setMovimientos(ordenados);
            setError(null);
        } catch (err) {
            toast.error(err.message || "Error al cargar historial");
            setAccounts([]);
            setMovimientos([]);
            setError(err.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        accounts,
        movimientos,
        loading,
        error,
        refetch: fetchHistory,
    };
};
