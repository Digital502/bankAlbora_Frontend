import { useEffect, useState } from "react";
import { getListRequestInsurance, approveInsuranceRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useRequestInsurance = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoadingSolicitudes, setIsLoading] = useState(false);

  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      const response = await getListRequestInsurance();

      if (!response || response.error || !Array.isArray(response.solicitudes)) {
        toast.error("No hay solicitudes de seguros pendientes.");
        setSolicitudes([]);
        return;
      }

      setSolicitudes(response.solicitudes);
    } catch (error) {
      toast.error(error.message || "No se pudieron cargar las solicitudes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAprobarSolicitud = async (id, estado) => {
    try {
      const response = await approveInsuranceRequest(id, estado);
      if (response.error) {
        throw new Error(response.message || "No se pudo procesar la solicitud");
      }

      toast.success(response.message || "Operación exitosa");
      await fetchSolicitudes();
    } catch (error) {
      toast.success("Solicitud Aceptada Exitosamente");
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return {
    solicitudes,
    fetchSolicitudes,
    handleAprobarSolicitud,
    isLoadingSolicitudes,
  };
};