import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getUserById, getAccountById } from '../../services';

export const useUserAccount = (userId, onFinish) => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    setUser(null);
    setAccounts([]);

    try {
      const userResponse = await getUserById(userId);
      if (userResponse.error) throw userResponse.error;
      setUser(userResponse.user || userResponse);

      const accountResponse = await getAccountById(userId);
      if (accountResponse.error) throw accountResponse.error;
      setAccounts(accountResponse.account || []);
    } catch (error) {
      toast.error("Error al obtener los detalles del usuario");
    } finally {
      setLoading(false);
      if (onFinish) onFinish();
    }
  }, [userId, onFinish]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId, fetchUserDetails]);

  return {
    user,
    accounts,
    loading,
  };
};