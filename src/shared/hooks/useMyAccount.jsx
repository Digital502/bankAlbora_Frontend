import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { myAccount } from '../../services';

export const useMyAccount = (onFinish) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      try {
        const response = await myAccount();
        if (response.error) throw response.e;
        setAccount(response.account);
      } catch (error) {
        toast.error("Error al obtener la cuenta del usuario");
      } finally {
        setLoading(false);
        if (onFinish) onFinish();
      }
    };

    fetchAccount();
  }, [onFinish]);

  return {
    account,
    loading,
  };
};
