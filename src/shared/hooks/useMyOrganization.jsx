import { useEffect, useState } from "react";
import { getMyOrganization } from "../../services/api";
import { logout as logoutHandler } from "./useLogout";
import { toast } from "react-hot-toast";

export const useMyOrganization = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyOrganization = async () => {
    try {
      setLoading(true);
      const response = await getMyOrganization();
      if (response?.organization) {
        setOrganization(response.organization);
        setError(null);
      } else {
        throw new Error(response.message || "Error al obtener la organización");
      }
    } catch (err) {
      setError(err.message || "Error desconocido");
      setOrganization(null);
      toast.error(err.message || "Error al obtener la organización");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutHandler();
    localStorage.removeItem("user");
    setOrganization(null);
  };

  useEffect(() => {
    fetchMyOrganization();
  }, []);

  return {
    organization,
    loading,
    error,
    fetchMyOrganization,
    logout,
  };
};
