import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    registerInsurance as registerServiceBancoService,
    listInsurance,
    updateInsurance,
    deleteInsurance,
} from "../../services/api"; 
  
export const useInsurance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [insurances, setInsurances] = useState([]);
  
    const fetchInsurances = async () => {
      setIsLoading(true);
      try {
        const response = await listInsurance();
        if (response.error) {
          throw new Error(response.e?.response?.data?.message || "Error al obtener los seguros");
        }
        setInsurances(response.seguros || []);
      } catch (error) {
        toast.error(error.message || "Error al obtener los seguros");
      } finally {
        setIsLoading(false);
      }
    };
  
    const registerNewServiceBanco = async (formData) => {
      setIsLoading(true);
      try {
        const response = await registerServiceBancoService(formData);
        if (!response || !response.message || !response.service) {
          throw new Error("Respuesta del servidor inválida");
        }
        toast.success(response.message || "Seguro registrado exitosamente");
        await fetchInsurances();
        return response;
      } catch (error) {
        toast.error(error.message || "Error al registrar el seguro");
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  
    const editInsurance = async (id, data) => {
      setIsLoading(true);
      try {
        const response = await updateInsurance(id, data);
        if (response.error) {
          throw new Error(response.e?.response?.data?.message || "Error al actualizar");
        }
        toast.success("Seguro actualizado correctamente");
        await fetchInsurances();
        return response;
      } catch (error) {
        console.error("Error al actualizar seguro:", error);
        toast.error(error.message || "Error al actualizar el seguro");
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  
    const removeInsurance = async (id) => {
      setIsLoading(true);
      try {
        const response = await deleteInsurance(id);
        if (response.error) {
          throw new Error(response.e?.response?.data?.message || "Error al eliminar");
        }
        toast.success("Seguro eliminado correctamente");
        await fetchInsurances();
        return response;
      } catch (error) {
        toast.error(error.message || "Error al eliminar el seguro");
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchInsurances();
    }, []);
  
    return {
      insurances,
      isLoading,
      registerNewServiceBanco,
      editInsurance,      
      removeInsurance,    
      fetchInsurances,
    };
  };
  