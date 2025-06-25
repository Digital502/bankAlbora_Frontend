import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async ({
    nombre,
    apellido,
    nombreUsuario,
    DPI,
    direccion,
    celular,
    correo,
    trabajo,
    role = "ROLE_CLIENTE"
  }) => {
    setIsLoading(true);

    try {
      const response = await register({
        nombre,
        apellido,
        nombreUsuario,
        DPI,
        direccion,
        celular,
        correo,
        trabajo,
        role
      });

      if (response.error) {
        toast.error(
          response.e?.response?.data?.errors?.[0]?.msg ||
          "Error al registrar la cuenta"
        );
        return null;
      } else {
        toast.success(response.data.message);
        return response.data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading
  };
};