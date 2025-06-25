import { useEffect, useState } from "react";
import { listCardDebito, listCardCredito, aprobarTarjeta } from "../../services/api";
import toast from "react-hot-toast";

export const useListCards = () => {
  const [tarjetasDebito, setTarjetasDebito] = useState([]);
  const [tarjetasCredito, setTarjetasCredito] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTarjetasDebito = async () => {
    try {
      setIsLoading(true);
      const response = await listCardDebito();

      if (!response || response.error || !Array.isArray(response.cards)) {
        if (Array.isArray(response.cards) && response.cards.length === 0) {
          return { message: "No hay tarjetas de débito pendientes." }; 
        }
        return { message: "No hay tarjetas de débito pendientes." };
      }

      setTarjetasDebito(response.cards);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar las tarjetas de débito");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTarjetasCredito = async () => {
    try {
      setIsLoading(true);
      const response = await listCardCredito();

      if (!response || response.error || !Array.isArray(response.cards)) {
        if (Array.isArray(response.cards) && response.cards.length === 0) {
          return { message: "No hay tarjetas de crédito pendientes." }; 
        }
        return { message: "No hay tarjetas de crédito pendientes." };
      }

      setTarjetasCredito(response.cards);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar las tarjetas de crédito");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodasTarjetas = async () => {
    await Promise.all([fetchTarjetasDebito(), fetchTarjetasCredito()]);
  };

  const handleAprobarTarjeta = async (id, value) => {
    try {
      const response = await aprobarTarjeta(id, value);

      if (response.error) {
        throw new Error("No se pudo procesar la solicitud");
      }

      toast.success(response.message || "Operación exitosa");
      await fetchTodasTarjetas();
    } catch (error) {
      toast.error(error.message || "Error al procesar la tarjeta");
    }
  };

  useEffect(() => {
    fetchTodasTarjetas();
  }, []);

  return {
    tarjetasDebito,
    tarjetasCredito,
    fetchTarjetasDebito,
    fetchTarjetasCredito,
    fetchTodasTarjetas,
    handleAprobarTarjeta,
    isLoading,
  };
};
