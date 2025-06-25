import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getMyAccountOrganization, getDepositsOrganization } from "../../services";

export const useMyOrganizationAccount = (onFinish) => {
  const [organizationAccount, setOrganizationAccount] = useState(null);
  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseCuenta = await getMyAccountOrganization();
        if (responseCuenta.error) throw responseCuenta.e;
        setOrganizationAccount(responseCuenta.organizacion);

        const responseDepositos = await getDepositsOrganization();
        if (responseDepositos.error) throw responseDepositos.e;
        setDepositos(responseDepositos.depositos);
      } catch (error) {
        toast.error("Error al obtener la información de la organización");
      } finally {
        setLoading(false);
        if (onFinish) onFinish();
      }
    };

    fetchData();
  }, [onFinish]);

  return {
    organizationAccount,
    depositos,
    loading,
  };
};
