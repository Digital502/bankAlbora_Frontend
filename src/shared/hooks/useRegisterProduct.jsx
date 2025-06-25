import { useNavigate } from "react-router-dom";
import { registerProduct as registerProductService } from "../../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export const useRegisterProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerNewProduct = async (formData) => {
    setIsLoading(true);

    try {
      const response = await registerProductService(formData);

      if (response?.error) {
        const errorMessage = response.e?.response?.data?.message || 
                           response.e?.response?.data?.errors?.[0]?.msg || 
                           "Error al registrar el producto";
        throw new Error(errorMessage);
      }
      if (!response?.data) {
        throw new Error("Respuesta del servidor inválida");
      }

      toast.success(response.data.message || "Producto registrado exitosamente");
      
      return response.data; 

    } catch (error) {
      toast.error(error.message || "Error al registrar el producto");
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerNewProduct,
    isLoading,
  };
};