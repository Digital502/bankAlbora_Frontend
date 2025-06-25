import { useNavigate } from "react-router-dom";
import { registerOrganization } from "../../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export const useRegisterOrganization = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerOrganizationData = async ({
    nombre,
    nit,
    direccion,
    correo,
    representante
  }) => {
    setIsLoading(true);

    try {
      const response = await registerOrganization({
        nombre,
        nit,
        direccion,
        correo,
        representante
      });

      if (response.error) {
        console.error(response.e?.response?.data);
        toast.error(
          response.e?.response?.data?.errors?.[0]?.msg ||
          "Error al registrar la organización"
        );
        return null;
      } else {
        toast.success(response.data.message || "Organización registrada exitosamente");
        return response.data; 
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerOrganization: registerOrganizationData,
    isLoading
  };
};