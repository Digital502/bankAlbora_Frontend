import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useRegisterAccount } from "../shared/hooks/useRegisterAccount";
import {
  validateNumber,
  validateNumberMessage,
} from "../shared/validators";
import { getOrganization } from "../services";
import toast from "react-hot-toast";
import { Footer } from "./footer/Footer";

// Animaciones
const shootingStarColors = ["#145259", "#45858c"];
const particleColors = ["#145259", "#45858c"];

const shootingStarVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  visible: (custom) => ({
    opacity: [0, 0.8, 0],
    x: [0, 200 + custom * 80],
    y: [0, 60 * (custom % 2 === 0 ? 1 : -1), 0],
    transition: {
      duration: 2,
      delay: custom * 0.3,
      repeat: Infinity,
      repeatDelay: Math.random() * 5,
      ease: "easeInOut",
    },
  }),
};

const particleVariants = {
  animate: {
    opacity: [0.2, 0.6, 0.2],
    y: [0, -20, 0],
    x: [0, Math.random() * 20 - 10, 0],
    transition: {
      duration: 5 + Math.random() * 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const RegisterBancarioOrganization = ({ switchAuthHandler }) => {
  const { accounts, getUseAccounts, isLoading, registerAccountOrganization } = useRegisterAccount();
  const [users, setUsers] = useState([]);

  const [formState, setFormState] = useState({
    ingresosMensuales: { value: "", isValid: false, showError: false, isFocused: false },
    tipoCuenta: { value: "AHORRO", isValid: true, showError: false },
    saldoCuenta: { value: "", isValid: true, showError: false },
    organization: { value: "", isValid: true, showError: false },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getOrganization();
        if (response?.organizations?.length) {
          const formattedUsers = response.organizations.map((organization) => ({
            label: organization.nombre || organization.name || organization.correo,
            value: organization.uid || organization.id,
          }));
          setUsers(formattedUsers);
        } else {
          toast.error("No se encontraron organizaciones.");
        }
      } catch (error) {
        toast.error("Hubo un error al obtener las organizaciones.");
      }
    };

    fetchUsers();
  }, []);

  const [clickedRegister, setClickedRegister] = useState(false);
  const particlesArray = Array(60).fill(0);

  const handleInputValueChange = (value, field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case "ingresosMensuales":
        return validateNumber(value) && parseFloat(value) > 0;
      default:
        return true;
    }
  };

  const handleInputFocus = (field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], isFocused: true },
    }));
  };

  const handleInputBlur = (field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], isFocused: false },
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setClickedRegister(true);

    const updatedState = { ...formState };
    let formIsValid = true;

    const requiredFields = ["ingresosMensuales"];

    requiredFields.forEach((field) => {
      const isValid = validateField(field, updatedState[field].value);
      updatedState[field] = {
        ...updatedState[field],
        isValid,
        showError: !isValid,
      };
      if (!isValid) formIsValid = false;
    });

    setFormState(updatedState);

    if (!formIsValid) return;

    if (!formState.ingresosMensuales.value || parseFloat(formState.ingresosMensuales.value) <= 0) {
      toast.error("Los ingresos mensuales deben ser mayores a 0");
      return;
    }

    if (!formState.tipoCuenta.value) {
      toast.error("Debe seleccionar un tipo de cuenta");
      return;
    }

    if (!formState.organization.value) {
      toast.error("Debe seleccionar una organización");
      return;
    }

    try {
      const dataToSend = {
        ingresosMensuales: formState.ingresosMensuales.value,
        tipoCuenta: formState.tipoCuenta.value,
        saldoCuenta: formState.saldoCuenta ? formState.saldoCuenta.value : "0",
        organization: formState.organization.value,
      };
      await registerAccountOrganization(dataToSend);
    } catch (error) {
      toast.error(error.message || "Error al registrar la cuenta");
    }
  };

  const allFieldsFilled = () => {
    const requiredFields = ["ingresosMensuales"];
    return requiredFields.every((field) => formState[field].value.trim() !== "");
  };

  const isSubmitDisabled = isLoading || !allFieldsFilled();

  const renderInputField = (field, label, type = "text", validationMessage) => {
    const fieldState = formState[field];
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <input
          id={field}
          type={type}
          value={fieldState.value}
          onChange={(e) => handleInputValueChange(e.target.value, field)}
          onFocus={() => handleInputFocus(field)}
          onBlur={() => handleInputBlur(field)}
          className={`w-full bg-[#334155] border ${
            fieldState.showError ? "border-red-500" : "border-[#9AF241]"
          } rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 peer transition-all`}
        />
        <label
          htmlFor={field}
          className={`absolute left-4 ${
            fieldState.value || fieldState.isFocused
              ? "top-1 text-xs text-[#9AF241]"
              : "top-1/2 -translate-y-1/2 text-gray-400"
          } peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#9AF241] transition-all duration-200`}
        >
          {label}
        </label>
        {fieldState.showError && (
          <motion.p
            className="mt-1 text-sm text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {validationMessage || "Este campo es requerido"}
          </motion.p>
        )}
      </motion.div>
    );
  };

  const renderSelectField = (field, label, options) => {
    const fieldState = formState[field];
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <select
          id={field}
          value={fieldState.value}
          onChange={(e) => handleInputValueChange(e.target.value, field)}
          className={`w-full bg-[#334155] border ${
            fieldState.showError ? "border-red-500" : "border-[#9AF241]"
          } rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 peer transition-all`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={field}
          className={`absolute left-4 ${
            fieldState.value || fieldState.isFocused
              ? "top-1 text-xs text-[#9AF241]"
              : "top-1/2 -translate-y-1/2 text-gray-400"
          } peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#9AF241] transition-all duration-200`}
        >
          {label}
        </label>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12 flex flex-col items-center justify-center space-y-4">
      {particlesArray.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const color = particleColors[i % particleColors.length];
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: color,
              filter: `drop-shadow(0 0 5px ${color})`,
            }}
            variants={particleVariants}
            animate="animate"
            initial={{ opacity: 0.3, y: 0 }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        );
      })}

      {[...Array(12)].map((_, i) => {
        const color = shootingStarColors[i % shootingStarColors.length];
        return (
          <motion.div
            key={`shooting-star-${i}`}
            custom={i}
            className="absolute rounded-lg blur-md"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 50}%`,
              width: 6 + Math.random() * 8,
              height: 1.5 + Math.random() * 2,
              rotate: 45,
              backgroundColor: color,
              opacity: 0,
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
            variants={shootingStarVariants}
            initial="hidden"
            animate="visible"
          />
        );
      })}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.5,
        }}
        className="relative z-10 w-full max-w-3xl bg-[#1e293b] border border-[#9AF241] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h2
              className="text-4xl font-bold mb-2 text-[#9AF241] tracking-tight"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Banco Albora
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Únete a la revolución financiera del mañana, hoy.
            </motion.p>
          </div>

          <motion.h2
            className="text-2xl font-bold text-center mb-6 text-[#9AF241] tracking-tighter"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Registro de Cuenta de Organizaciones
          </motion.h2>

          <motion.form
            onSubmit={handleRegister}
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {renderInputField("ingresosMensuales", "Ingresos Mensuales (Q)", "number", "Ingresos deben ser mayores a 100")}
            {renderInputField("saldoCuenta", "Saldo de Cuenta (Q)", "number", "El saldo debe ser mayor a 0")}
            {renderSelectField("tipoCuenta", "Tipo de Cuenta", [
              { value: "" },
              { value: "AHORRO", label: "Ahorro" },
              { value: "MONETARIA", label: "Monetaria" },
            ])}
            {renderSelectField("organization", "Organización Referencia", [
              { value: "" },
              ...users,
            ])}

            <motion.button
              type="submit"
              disabled={isSubmitDisabled}
              whileHover={!isSubmitDisabled ? {
                scale: 1.03,
                boxShadow: "0 0 15px #06b6d4"
              } : {}}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: clickedRegister ? 0.97 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`mt-6 py-3 px-6 rounded-xl font-medium tracking-wide shadow-lg transition-all w-full col-span-2 ${
                isSubmitDisabled
                  ? "bg-gray-500/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:shadow-[0_0_15px_#06b6d4]"
              }`}
            >
              {isLoading ? (
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Creando cuenta...
                </motion.span>
              ) : "Crear Cuenta"}
            </motion.button>
          </motion.form>

          <motion.p
            className="text-sm text-center mt-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Registra cuentas de organizaciones{" "}
            <button
              onClick={switchAuthHandler}
              className="text-[#9AF241] underline cursor-pointer"
            >
              aquí
            </button>
          </motion.p>

          <motion.p
            className="text-xs mt-6 text-center text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            ©Copyright 2024. Banco Albora.
          </motion.p>
        </div>
      </motion.div>

      <br /><br />
      <Footer />
    </div>
  );
};

RegisterBancarioOrganization.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};
