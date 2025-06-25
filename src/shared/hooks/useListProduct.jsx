import { useState, useEffect } from "react";
import { 
  getProducts,
  deleteProduct,
  updateProduct,
  updateProductImage
} from "../../services";
import toast from "react-hot-toast";

export const useListProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();

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

  const removeProduct = async (id) => {
    setIsDeleting(true);
    try {
      const response = await deleteProduct(id);

      if (!response || response.error) {
        throw new Error("Error al eliminar el producto.");
      }

      toast.success("Producto eliminado exitosamente.");
      await fetchProducts(); 
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      toast.error(err?.message || "Error al eliminar el producto.");
    } finally {
      setIsDeleting(false);
    }
  };

  const editProduct = async (id, productData) => {
    setIsUpdating(true);
    try {
      const response = await updateProduct(id, productData);

      if (!response || response.error) {
        throw new Error("Error al actualizar el producto.");
      }

      toast.success("Producto actualizado exitosamente.");
      await fetchProducts(); 
      return response;
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      toast.error(err?.message || "Error al actualizar el producto.");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const editProductImage = async (id, imageFile) => {
    setIsUpdatingImage(true);
    try {
      const response = await updateProductImage(id, imageFile);

      if (!response || response.error) {
        throw new Error("Error al actualizar la imagen del producto.");
      }

      toast.success("Imagen del producto actualizada exitosamente.");
      await fetchProducts();
      return response;
    } catch (err) {
      console.error("Error al actualizar imagen:", err);
      toast.error(err?.message || "Error al actualizar la imagen del producto.");
      throw err;
    } finally {
      setIsUpdatingImage(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    isDeleting,
    isUpdating,
    isUpdatingImage,
    fetchProducts,
    removeProduct,
    editProduct,
    editProductImage
  };
};