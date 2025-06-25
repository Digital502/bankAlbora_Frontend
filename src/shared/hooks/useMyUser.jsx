import { useEffect, useState } from "react";
import { getMyUser, updateUseruser, updatePassword  } from "../../services/api"; 
import { logout as logoutHandler } from "./useLogout";
import { toast } from "react-hot-toast";

export const useMyUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchMyUser = async () => {
    try {
      setLoading(true);
      const response = await getMyUser();
      if (response?.user) {
        setUser(response.user);
        setError(null);
      } else {
        throw new Error(response.message || "Error fetching user");
      }
    } catch (err) {
      setError(err.message || "Unknown error");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateMyUser = async (updatedData) => {
    if (!user?.uid) {
      toast.error("No se puede actualizar: ID de usuario no disponible");
      setError("No se puede actualizar: ID de usuario no disponible");
      return;
    }

    try {
      setLoading(true);
      const response = await updateUseruser(user.uid, updatedData);
      if (response?.user) {
        setUser(response.user);
        toast.success("Usuario actualizado correctamente");
        setError(null);
      } else {
        throw new Error(response.message || "Fallo al actualizar el usuario");
      }
    } catch (err) {
      toast.error(err.message || "Error desconocido");
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await updatePassword(passwordData);
      toast.success(response.message); 
      setError(null);
    } catch (err) {
      toast.error(err.message); 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutHandler();
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    fetchMyUser();
  }, []);

  return {
    user,
    loading,
    error,
    successMessage,
    fetchMyUser,
    updateMyUser,
    changePassword,
    logout,
  };
};
