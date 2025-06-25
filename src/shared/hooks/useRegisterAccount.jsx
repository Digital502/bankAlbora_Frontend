import { useNavigate } from "react-router-dom";
import { registerAccount as registerAccountService, getUsers, getOrganization } from "../../services/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const useRegisterAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  const registerAccountOrganization = async ({
    ingresosMensuales,
    tipoCuenta,
    saldoCuenta,
    organization
  }) => {
    setIsLoading(true);

    try {
      const response = await registerAccountService({
        ingresosMensuales,
        tipoCuenta,
        saldoCuenta,
        organization
      });
      if (response?.error) {
        const mensaje = response?.error?.message || "Error al registrar la cuenta";
        throw new Error(mensaje);
      }

      if (!response?.data) {
        throw new Error("Respuesta del servidor inválida");
      }

      toast.success(response.data.message);

      if (response.data.userDetails) {
        localStorage.setItem("user", JSON.stringify(response.data.userDetails));
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        navigate("/administrator");
      } else {
        toast("Registro exitoso pero no se recibieron datos de usuario",{icon: "⚠️"});
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const registerNewAccount = async ({
    ingresosMensuales,
    tipoCuenta,
    saldoCuenta,
    user
  }) => {
    setIsLoading(true);

    try {
      const response = await registerAccountService({
        ingresosMensuales,
        tipoCuenta,
        saldoCuenta,
        user
      });
      if (response?.error) {
        const mensaje = response?.error?.message || "Error al registrar la cuenta";
        throw new Error(mensaje);
      }

      if (!response?.data) {
        throw new Error("Respuesta del servidor inválida");
      }

      toast.success(response.data.message);

      if (response.data.userDetails) {
        localStorage.setItem("user", JSON.stringify(response.data.userDetails));
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        navigate("/administrator");
      } else {
        toast("Registro exitoso pero no se recibieron datos de usuario",{icon: "⚠️"});
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();

      if (!data || data.error || !Array.isArray(data.users)) {
        throw new Error("Error al obtener los usuarios o usuarios vacíos");
      }

      const formatted = data.users.map(a => ({
        label: a.correo,
        value: a.uid
      }));

      setAccounts(formatted);
    } catch (err) {
      toast.success("Hubo un problema al obtener los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizationsAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getOrganization();

      if (!data || data.error || !Array.isArray(data.organizations)) {
        setIsLoading(false);
        toast.arguments("Registrar Cuentas Bancarias");
        return;
      }

      const formatted = data.organizations.map(a => ({
        label: a.correo,
        value: a.uid
      }));

      setAccounts(formatted);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.arguments("Hubo un problema al obtener los usuarios");
    }
  };

  useEffect(() => {
    fetchUsersAccounts();
  }, []);

  useEffect(() => {
    fetchOrganizationsAccounts();
  }, [])

  return {
    accounts,
    registerNewAccount,
    registerAccountOrganization,
    fetchUsersAccounts,
    fetchOrganizationsAccounts,
    isLoading
  };
};