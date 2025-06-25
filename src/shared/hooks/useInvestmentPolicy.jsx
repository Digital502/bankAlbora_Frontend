import { useState, useEffect } from "react";
import {
  getInvestmentPolicies,
  registerInvestmentPolicy,
  updateInvestmentPolicy,
  deleteInvestmentPolicy,
  getInvestmentWaitingList,
  approveInvestment,
} from "../../services";
import toast from "react-hot-toast";

export const useInvestmentPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(false);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const data = await getInvestmentPolicies();

      if (!data || data.error || !Array.isArray(data.policies)) {
        toast("No hay políticas de inversión registradas", {
          icon: "ℹ️",
        });
        return;
      }

      setPolicies(data.policies);
    } catch (err) {
      console.error("Error al obtener políticas:", err);
      toast.error(err?.message || "Error al cargar las políticas.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestments = async () => {
    setIsLoadingInvestments(true);
    try {
      const data = await getInvestmentWaitingList();

      if (!data || !Array.isArray(data)) {
        throw new Error("Error al obtener las inversiones.");
      }

      setInvestments(data);
    } catch (err) {
      console.error("Error al obtener inversiones:", err);
      toast.error(err?.message || "Error al cargar las inversiones.");
    } finally {
      setIsLoadingInvestments(false);
    }
  };

  const createPolicy = async (policyData) => {
    setIsLoading(true);
    try {
      const response = await registerInvestmentPolicy(policyData);

      if (!response || response.error) {
        throw new Error("Error al registrar la política.");
      }

      toast.success(response.message || "Política registrada correctamente.");
      await fetchPolicies();
    } catch (err) {
      console.error("Error al crear política:", err);
      toast.error(err?.message || "Error al registrar la política.");
    } finally {
      setIsLoading(false);
    }
  };

  const editPolicy = async (id, policyData) => {
    setIsLoading(true);
    try {
      const response = await updateInvestmentPolicy(id, policyData);

      if (!response || response.error) {
        throw new Error("Error al actualizar la política.");
      }

      toast.success(response.message || "Política actualizada correctamente.");
      await fetchPolicies();
    } catch (err) {
      toast.error(err?.message || "Error al actualizar la política.");
    } finally {
      setIsLoading(false);
    }
  };

  const removePolicy = async (id) => {
    setIsLoading(true);
    try {
      const response = await deleteInvestmentPolicy(id);

      if (!response || response.error) {
        throw new Error("Error al eliminar la política.");
      }

      toast.success(response.message || "Política eliminada correctamente.");
      await fetchPolicies();
    } catch (err) {
      console.error("Error al eliminar política:", err);
      toast.error(err?.message || "Error al eliminar la política.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvestmentStatus = async (id, value) => {
    setIsLoadingInvestments(true);
    try {
      const response = await approveInvestment(id, value);

      if (!response || response.error) {
        throw new Error("Error al actualizar el estado de la inversión.");
      }

      toast.success(response.message || "Estado actualizado correctamente.");
      await fetchInvestments();
    } catch (err) {
      console.error("Error al actualizar inversión:", err);
      toast.error(err?.message || "Error al actualizar la inversión.");
    } finally {
      setIsLoadingInvestments(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchInvestments();
  }, []);

  return {
    policies,
    isLoading,
    fetchPolicies,
    createPolicy,
    editPolicy,
    removePolicy,

    investments,
    isLoadingInvestments,
    fetchInvestments,
    updateInvestmentStatus,
  };
};
