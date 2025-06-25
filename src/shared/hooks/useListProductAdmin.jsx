import { useState, useEffect } from "react";
import { 
  getProductsAdmin,
} from "../../services";
import toast from "react-hot-toast";

export const useListProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProductsAdmin();

      if (!data) {
        toast.error("No hay productos registrados.");
      }

      if (data.error || !Array.isArray(data.services)) {
        throw new Error("Error al obtener los productos.");
      }

      setProducts(data.services);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      toast.error(err?.message || "Error al cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    fetchProducts
  };
};