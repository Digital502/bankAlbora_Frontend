import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getOrganizationUid, getAccountByOrganization } from '../../services';

export const useOrganizationAccount = (userId, onFinish) => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    setUser(null);
    setAccount([]);

    try {
      const userResponse = await getOrganizationUid(userId);
      if (userResponse.error) throw userResponse.error;
      setUser(userResponse.organization);

      const accountResponse = await getAccountByOrganization(userId);
      if (accountResponse.error) throw accountResponse.error;
      setAccount(accountResponse.account);
    } catch (error) {
      toast.error("Error al obtener los detalles de la organización");
    } finally {
      setLoading(false);
      if (typeof onFinish === 'function') onFinish();
    }
  }, [userId, onFinish]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId, fetchUserDetails]);

  return {
    user,
    account,
    loading,
  };
};
