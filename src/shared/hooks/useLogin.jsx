import { useNavigate } from "react-router-dom";
import { login } from "../../services";
import toast from "react-hot-toast";
import { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (nombreUsuario, contraseña) => {
    try {
      setIsLoading(true);

      const response = await login({ nombreUsuario, contraseña });

      const userDetails = response.data?.userDetails;

      if (!userDetails) {
        toast.error("Detalles del usuario no encontrados en la respuesta.");
        return;
      }

      toast.success(response.data.message || "Inicio de sesión exitoso");

      const roleMatch = userDetails.role?.match(/ROLE_\w+/);
      const userRole = roleMatch ? roleMatch[0] : null;

      localStorage.setItem(
        "user",
        JSON.stringify({ ...userDetails, role: userRole })
      );

      switch (userRole) {
        case "ROLE_ADMINISTRADOR":
          navigate("/administrator", { replace: true });
          break;
        case "ROLE_CLIENTE":
          navigate("/bankAlbora", { replace: true });
          break;
        case "ROLE_ORGANIZATION":
          navigate("/organization", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }

    } catch (error) {
      const errorText = error?.response?.data?.error?.toLowerCase() || "";

      if (errorText.includes("no user")) {
        toast.error("Correo electrónico incorrecto");
      } else if (errorText.includes("password")) {
        toast.error("Contraseña incorrecta");
      } else {
        toast.error(errorText || "Error al iniciar sesión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
  };
};