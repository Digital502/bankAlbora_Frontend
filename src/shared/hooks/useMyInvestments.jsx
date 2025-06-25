import { useState, useEffect } from "react";
import { 
  getInvestmentPolicies, 
  createInvestment, 
  getInvestments, 
  simulateInvestment, 
  myAccount
} from "../../services";
import toast from "react-hot-toast";

export const useMyInvestments = () => {
  const [policies, setPolicies] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const data = await getInvestmentPolicies();

      if (!data || data.error || !Array.isArray(data.policies)) {
        throw new Error("Error al obtener las políticas de inversión o la lista esta vacia.");
      }

      setPolicies(data.policies);
    } catch (err) {
      toast.error(err?.message || "Error al cargar las políticas.",{
      icon: "⚠️",
      closeButton: false,
    });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestments = async () => {
    setIsLoadingInvestments(true);
    try {
      const data = await getInvestments();

      if (!data || data.error || !Array.isArray(data.investment)) {
        throw new Error("Error al obtener tus inversiones o la lista esta vacía.");
      }

      setInvestments(data.investment);
    } catch (err) {
      toast.error(err?.message || "Error al cargar las inversiones.",{
          icon: "⚠️",
          closeButton: false,
        });
    } finally {
      setIsLoadingInvestments(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const data = await myAccount();

      if (!data || data.error || !Array.isArray(data.account)) {
        throw new Error("Error al obtener las cuentas.");
      }

      setAccounts(data.account);
    } catch (err) {
      toast.error(err?.message || "Error al cargar las cuentas.",{
          icon: "⚠️",
          closeButton: false,
        });
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const registerInvestment = async (investmentData) => {
    setIsLoading(true);
    try {
      const response = await createInvestment(investmentData);

      if (!response || response.error) {
        throw new Error("Error al crear la inversión.");
      }

      toast.success(response.message || "Inversión creada exitosamente.");
      await fetchInvestments();
    } catch (err) {
      toast.error(err?.message || "Error al crear la inversión.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulate = async (simulationData) => {
    setIsSimulating(true);
    try {
      const response = await simulateInvestment(simulationData);

      if (!response || response.error) {
        throw new Error("Error al simular la inversión.");
      }

      setSimulationResult(response);
    } catch (err) {
      toast.error(err?.message || "Error al simular la inversión.");
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchInvestments();
    fetchAccounts();
  }, []);

  return {
    policies,
    investments,
    accounts,
    isLoading,
    isLoadingInvestments,
    isLoadingAccounts,
    fetchPolicies,
    fetchInvestments,
    fetchAccounts,
    registerInvestment,
    simulate,
    simulationResult,
    isSimulating,
  };
};
