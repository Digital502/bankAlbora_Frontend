import { useState, useEffect } from "react";
import { 
  getProductosConDescuento,
  transferencia,
  pagoTarjeta
} from "../../services/api";
import toast from "react-hot-toast";

export const useListProductUser = (organizacionId) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(18000);
  const [transferLoading, setTransferLoading] = useState(false);
  const [cardPaymentLoading, setCardPaymentLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getProductosConDescuento(organizacionId);
      
      if (!response?.success) {
        throw new Error(response?.message || "Error al obtener productos");
      }

      if (!Array.isArray(response.productos)) {
        throw new Error("Formato de productos inválido");
      }

      setProducts(response.productos);
      const max = Math.max(...response.productos.map(p => p.precioOriginal), 18000);
      setMaxPrice(Math.ceil(max / 100) * 100);
      
      return {
        products: response.productos,
        maxPrice: Math.ceil(max / 100) * 100
      };
    } catch (err) {
      console.error("Error al obtener productos:", err);
      toast.error(err?.message || "Error al cargar productos");
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = (products, filters) => {
    const { searchTerm, minPriceFilter, maxPriceFilter } = filters;
    return products.filter((producto) => {
      const matchesSearch = [producto.nombre, producto.descripcion]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPrice = producto.precioOriginal >= minPriceFilter && 
                         producto.precioOriginal <= maxPriceFilter;
      
      return matchesSearch && matchesPrice;
    });
  };

  const makeTransfer = async ({ cuentaOrigen, organization, monto }) => {
    setTransferLoading(true);
    try {
      const response = await transferencia({ cuentaOrigen, organization, monto });
      
      if (!response?.success) {
        throw new Error(response?.message || "Saldo Insuficiente");
      }

      toast.success(response.message || "Transferencia realizada con éxito");
      return { success: true };
    } catch (error) {
      console.error("Error en transferencia:", error);
      toast.error(error.message || "Error al procesar la transferencia");
      throw error;
    } finally {
      setTransferLoading(false);
    }
  };


  const makeCardPayment = async ({ numeroTarjeta, organization, monto, cvv }) => {
    setCardPaymentLoading(true);
    try {
      const response = await pagoTarjeta({ numeroTarjeta, organization, monto, cvv });
      
      if (!response?.success) {
        throw new Error(response?.message || "Saldo Insuficiente en tu Tarjeta");
      }

      toast.success(response.message || "Pago realizado con éxito");
      return { success: true }; 
    } catch (error) {
      console.error("Error en pago con tarjeta:", error);
      toast.error(error.message || "Error al procesar el pago");
      throw error;
    } finally {
      setCardPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [organizacionId]);

  return {
    products,
    isLoading,
    maxPrice,
    fetchProducts,
    filterProducts,
    makeTransfer,
    transferLoading,
    makeCardPayment,
    cardPaymentLoading
  };
};