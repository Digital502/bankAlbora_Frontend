import { useState, useEffect } from "react";
import {
  listarSegurosExcluyendoOtros,
  crearSolicitudSeguro,
  obtenerSolicitudesSeguroUsuario,
} from "../../services";
import { myAccount } from "../../services"; 
import toast from "react-hot-toast";

export const useSeguroUsuario = () => {
  const [seguros, setSeguros] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoadingSeguros, setIsLoadingSeguros] = useState(false);
  const [isLoadingSolicitudes, setIsLoadingSolicitudes] = useState(false);
const [cuentas, setCuentas] = useState([]);

  const fetchSegurosDisponibles = async () => {
    setIsLoadingSeguros(true);
    try {
      const data = await listarSegurosExcluyendoOtros();

      if (!data || data.error || !Array.isArray(data.seguros)) {
        throw new Error("Error al obtener los seguros disponibles.");
      }

      setSeguros(data.seguros);
    } catch (err) {
      toast.error(err?.message || "No se pudieron cargar los seguros.");
    } finally {
      setIsLoadingSeguros(false);
    }
  };

const fetchCuentaUsuario = async () => {
  try {
    const data = await myAccount();

    if (!data || data.error || !Array.isArray(data.account) || data.account.length === 0) {
      throw new Error("No se encontró una cuenta válida.");
    }

    setCuentas(data.account);
  } catch (err) {
    console.error("Error al obtener la cuenta del usuario:", err);
    toast.error(err?.message || "No se pudo obtener la cuenta.");
  }
};

const solicitarSeguro = async (servicioId, cuentaSeleccionada) => {
  try {
    const res = await crearSolicitudSeguro({ servicioId, numeroCuenta: cuentaSeleccionada });
    toast.success("¡Solicitud enviada!");
    fetchSegurosDisponibles();
    fetchSolicitudesUsuario();
  } catch (error) {
    toast.error("Error al enviar la solicitud.");
  }
};

  const fetchSolicitudesUsuario = async () => {
    setIsLoadingSolicitudes(true);
    try {
      const data = await obtenerSolicitudesSeguroUsuario();

      if (!data || data.error || !Array.isArray(data.solicitudes)) {
        throw new Error("Error al obtener las solicitudes.");
      }

      setSolicitudes(data.solicitudes);
    } catch (err) {
      toast.error(err?.message || "No se pudieron cargar las solicitudes.");
    } finally {
      setIsLoadingSolicitudes(false);
    }
  };

  useEffect(() => {
    fetchCuentaUsuario();
    fetchSegurosDisponibles();
    fetchSolicitudesUsuario();
  }, []);

  return {
    seguros,
    isLoadingSeguros,
    fetchSegurosDisponibles,

    solicitudes,
    isLoadingSolicitudes,
    fetchSolicitudesUsuario,

    solicitarSeguro,
    cuentas,
  };
};
