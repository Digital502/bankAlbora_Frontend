import { useState, useEffect } from "react";
import { getCardsAdmin, desactivarTarjeta } from "../../services/api"; 
import toast from "react-hot-toast";

export const useListCardsByEstado = (estadoInicial = "ACTIVA") => {
  const [tarjetas, setTarjetas] = useState([]);
  const [estado, setEstado] = useState(estadoInicial);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTarjetas = async (estadoFiltro) => {
    setIsLoading(true);
    try {
      const res = await getCardsAdmin(estadoFiltro);
      if (res.error) toast(res.message || "No hay tarjetas para mostrar", {icon: "ℹ️"});
      setTarjetas(res.cards || []);
    } catch (error) {
      toast.error(error.message);
      setTarjetas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesactivarTarjeta = async(id, value) => {
    try{
        const response = await desactivarTarjeta(id, value)
        if (response.error) {
            throw new Error("No se pudo desactivar la targeta");
        }

        toast.success(response.message || "Operación exitosa");
        await fetchTarjetas();
    }catch(error){
        toast.error(error.message || "Error al procesar la tarjeta");
    }
  }

  useEffect(() => {
    fetchTarjetas(estado);
  }, [estado]);

  return {
    tarjetas,
    estado,
    setEstado,
    handleDesactivarTarjeta,
    fetchTarjetas,
    isLoading,
  };
};
