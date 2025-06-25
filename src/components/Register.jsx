import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useRegister } from "../shared/hooks/useRegister";
import {
  validateEmail,
  validateNumber,
  validateText,
  validateDPI,
  validateTextMessage,
  validateDPIMessage,
  validateNumberMessage,
  validateEmailMessage
} from "../shared/validators";
import { Footer } from "./footer/Footer";
import { useNavigate } from "react-router-dom";

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

export const Register = ({ switchAuthHandler }) => {
  const { registerUser, isLoading } = useRegister();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    nombre: { value: "", isValid: false, showError: false, isFocused: false },
    apellido: { value: "", isValid: false, showError: false, isFocused: false },
    nombreUsuario: { value: "", isValid: false, showError: false, isFocused: false },
    DPI: { value: "", isValid: false, showError: false, isFocused: false },
    direccion: { value: "", isValid: false, showError: false, isFocused: false },
    celular: { value: "", isValid: false, showError: false, isFocused: false },
    correo: { value: "", isValid: false, showError: false, isFocused: false },
    trabajo: { value: "", isValid: false, showError: false, isFocused: false },
    role: { value: "ROLE_CLIENTE", isValid: true, showError: false },
  });

  const [clickedRegister, setClickedRegister] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const particlesArray = Array(60).fill(0);

  const handleInputValueChange = (value, field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { 
        ...prev[field], 
        value,
        showError: false 
      }
    }));
  };

  const validateField = (field, value) => {
    switch (field) {
      case "nombre":
      case "apellido":
      case "direccion":
      case "trabajo":
      case "nombreUsuario":
        return validateText(value);
      case "DPI":
        return validateDPI(value);
      case "celular":
        return validateNumber(value);
      case "correo":
        return validateEmail(value);
      default:
        return true;
    }
  };

  const handleInputFocus = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], isFocused: true }
    }));
  };

  const handleInputBlur = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], isFocused: false }
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setClickedRegister(true);
    
    const updatedState = { ...formState };
    let formIsValid = true;

    const requiredFields = ["nombre", "apellido", "nombreUsuario", "DPI", "direccion", "celular", "correo", "trabajo"];
    
    requiredFields.forEach(field => {
      const isValid = validateField(field, updatedState[field].value);
      updatedState[field] = {
        ...updatedState[field],
        isValid,
        showError: !isValid
      };
      if (!isValid) formIsValid = false;
    });

    setFormState(updatedState);

    if (!formIsValid) return;

    try {
      const response = await registerUser({
        nombre: formState.nombre.value,
        apellido: formState.apellido.value,
        nombreUsuario: formState.nombreUsuario.value,
        DPI: formState.DPI.value,
        direccion: formState.direccion.value,
        celular: formState.celular.value,
        correo: formState.correo.value,
        trabajo: formState.trabajo.value,
        role: formState.role.value,
      });
      
      if (response) {
        setRegistrationData(response);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/administrator");
  };

  const allFieldsFilled = () => {
    const requiredFields = ["nombre", "apellido", "nombreUsuario", "DPI", "direccion", "celular", "correo", "trabajo"];
    return requiredFields.every(field => formState[field].value.trim() !== "");
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
            fieldState.showError ? 'border-red-500' : 'border-[#9AF241]'
          } rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 peer transition-all`}
        />
        <label 
          htmlFor={field}
          className={`absolute left-4 ${
            fieldState.value || fieldState.isFocused 
              ? 'top-1 text-xs text-[#9AF241]' 
              : 'top-1/2 -translate-y-1/2 text-gray-400'
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
          type: 'spring',
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
            Registro de Usuario
          </motion.h2>

          <motion.form 
            onSubmit={handleRegister} 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {renderInputField("nombre", "Nombre", "text", validateTextMessage)}
            {renderInputField("apellido", "Apellido", "text", validateTextMessage)}
            {renderInputField("nombreUsuario", "Nombre de Usuario", "text", validateTextMessage)} 
            {renderInputField("DPI", "DPI", "text", validateDPIMessage)}
            {renderInputField("direccion", "Dirección", "text", validateTextMessage)}
            {renderInputField("celular", "Celular", "tel", validateNumberMessage)}
            {renderInputField("correo", "Correo Electrónico", "email", validateEmailMessage)}
            {renderInputField("trabajo", "Trabajo", "text", validateTextMessage)}
     
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
                  ? "bg-gray-500 cursor-not-allowed" 
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
            Registra cuentas bancarias{" "}
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
      <Footer/>

      {/* Registration Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1e293b] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] border border-[#9AF241] rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="text-[#9AF241] hover:text-[#7ad327]"
              >
                ✕
              </button>
            </div>
            <h3 className="font-bold text-2xl text-[#9AF241] mb-4">¡Registro Exitoso!</h3>
            
            {registrationData && (
              <div className="space-y-4">
                <div className="bg-[#334155] p-4 rounded-lg border border-[#45858c]">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">Tus credenciales:</h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="text-gray-300 mr-2">Correo:</span>
                      <span className="font-medium text-white">{registrationData.correo}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-300 mr-2">Usuario:</span>
                      <span className="font-medium text-white">{registrationData.nombreUsuario}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-300 mr-2">Contraseña:</span>
                      <span className="font-medium text-white">{registrationData.contraseña}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#334155] border border-yellow-500 text-yellow-300 p-3 rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Guarda estas credenciales en un lugar seguro.</span>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button 
                className="bg-[#9AF241] hover:bg-[#7ad327] text-[#0f172a] font-medium py-2 px-4 rounded-lg"
                onClick={handleCloseModal}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Register.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};