import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  validateEmail,
  validatePassword,
  validateEmailMessage,
  validatePasswordMessage,
} from '../shared/validators';
import { useLogin } from '../shared/hooks/useLogin';
import { LoadingSpinner } from './LoadingSpinner/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const shootingStarColors = ["#145259", "#45858c"];
const particleColors = ["#145259", "#45858c"];

const shootingStarVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  visible: (custom) => ({
    opacity: [0, 1, 0],
    x: [0, 120 + custom * 60],
    y: [0, 40 * (custom % 2 === 0 ? 1 : -1), 0],
    transition: {
      duration: 1.5,
      delay: custom * 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

const particleVariants = {
  animate: {
    opacity: [0.3, 0.8, 0.3],
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const Login = ({ switchAuthHandler }) => {
  const { loginUser, isLoading } = useLogin();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    nombreUsuario: { value: '', isValid: false, showError: false },
    contraseña: { value: '', isValid: false, showError: false },
  });

  const [clickedLogin, setClickedLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], value },
    }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    let isValid = false;
    switch (field) {
      case 'nombreUsuario':
        isValid = validateEmail(value);
        break;
      case 'contraseña':
        isValid = validatePassword(value);
        break;
      default:
        break;
    }
    setFormState((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], isValid, showError: !isValid },
    }));
  };

    const handleLogin = (event) => {
    event.preventDefault();

    if (isLoading) return <LoadingSpinner/>;

    setClickedLogin(true); 
    loginUser(formState.nombreUsuario.value, formState.contraseña.value);
    };

  const isSubmitDisabled =
    isLoading || !formState.nombreUsuario.isValid || !formState.contraseña.isValid;

  const particlesArray = Array(40).fill(0);

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex items-center justify-center px-4">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Video_Login.mp4" type="video/mp4" />
      </video>

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
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            duration: 0.8,
            delay: 0.2,
        }}
        className="relative z-10 w-full max-w-lg bg-[#1e293b] border border-[#9AF241] rounded-2xl shadow-2xl p-10"
        >
        <h2 className="text-3xl font-bold text-center text-[#9AF241] mb-2">
          Banca Virtual
        </h2>
        <p className="text-center text-sm text-gray-300 mb-8">
          Ingresa con tu cuenta bancaria para continuar
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="w-full">
            <label htmlFor="nombreUsuario" className="block text-sm font-medium text-white w-full">
              Correo electrónico
            </label>
            <input
              type="text"
              id="nombreUsuario"
              value={formState.nombreUsuario.value}
              onChange={(e) => handleInputValueChange(e.target.value, 'nombreUsuario')}
              onBlur={(e) => handleInputValidationOnBlur(e.target.value, 'nombreUsuario')}
              className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none"
            />
            {formState.nombreUsuario.showError && (
              <p className="text-red-400 text-sm mt-1">{validateEmailMessage}</p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="contraseña" className="block text-sm font-medium text-white w-full">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="contraseña"
                value={formState.contraseña.value}
                onChange={(e) => handleInputValueChange(e.target.value, 'contraseña')}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, 'contraseña')}
                className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white text-sm"
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            {formState.contraseña.showError && (
              <p className="text-red-400 text-sm mt-1">{validatePasswordMessage}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitDisabled}
            whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.96 }}
            animate={{ scale: clickedLogin ? 0.96 : 1 }}
            transition={{ duration: 0.2 }}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
              isSubmitDisabled
                ? 'bg-gray-500 cursor-not-allowed text-white'
                : 'bg-[#9AF241] hover:shadow-[0_0_10px_#9AF241] text-[#022873]'
            }`}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            ¿Haz olvidado tu contraseña? Haz click{' '}
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#9AF241] hover:underline font-medium"
            >
              aquí
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

Login.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};