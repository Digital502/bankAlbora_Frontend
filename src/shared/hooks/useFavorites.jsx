import { useState, useEffect } from "react";
import {
  addFavoriteAccount,
  getFavoriteAccounts,
  deleteFavoriteAccount,
  updateFavoriteAccount
} from "../../services";
import toast from "react-hot-toast";

export const useFavoriteAccounts = () => {
  const [favoriteAccounts, setFavoriteAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavoriteAccounts = async () => {
    setIsLoading(true);
    const response = await getFavoriteAccounts();

    if (response.error) {
      toast.error("Error al obtener las cuentas favoritas");
    } else {
      setFavoriteAccounts(response.favorites || []);
    }

    setIsLoading(false);
  };

  const addAccountToFavorites = async ({ numeroCuenta, alias }) => {
    setIsLoading(true);
    const response = await addFavoriteAccount({ numeroCuenta, alias });
    setIsLoading(false);

    if (response.error) {
      toast.error("Error al agregar cuenta favorita");
      return false;
    }

    toast.success("Cuenta agregada a favoritos");
    await fetchFavoriteAccounts();
    return true;
  };

  const removeFavoriteAccount = async (numeroCuenta) => {
    const response = await deleteFavoriteAccount(numeroCuenta);
    if (response.error) {
      toast.error("Error al eliminar cuenta favorita");
    } else {
      toast.success("Cuenta favorita eliminada");
      await fetchFavoriteAccounts();
    }
  };

  const updateFavoriteAlias = async (numeroCuenta, alias) => {
    const response = await updateFavoriteAccount(numeroCuenta, { alias });

    if (response.error) {x
      toast.error("Error al actualizar el alias");
      return false;
    }

    toast.success("Alias actualizado correctamente");
    await fetchFavoriteAccounts();
    return true;
  };

  useEffect(() => {
    fetchFavoriteAccounts();
  }, []);

  return {
    favoriteAccounts,
    isLoading,
    addAccountToFavorites,
    removeFavoriteAccount,
    updateFavoriteAlias
  };
};
