import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaEnvelope, FaKey } from 'react-icons/fa';
import { usePassword } from '../shared/hooks/usePassword';
import toast from 'react-hot-toast';
import { validatePassword, validatePasswordMessage } from '../shared/validators';

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

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendRecoveryCode, changePassword, verificationCode, loading, error } = usePassword();
  
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showError, setShowError] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  
  const particlesArray = Array(40).fill(0);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setShowError(true);
      return;
    }
    
    try {
      await sendRecoveryCode(email);
      setStep(2);
      setShowError(false);
    } catch (err) {
      setShowError(true);
      console.error("Error al enviar el código:", err);
      toast.error(err.message || 'Error al enviar el código de verificación');
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (!verificationCode || code !== verificationCode.toString()) {
      setShowError(true);
      return;
    }
    
    setStep(3);
    setShowError(false);
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    const isValid = validatePassword(value);
    setPasswordValid(isValid);
    if (!isValid) {
      setPasswordError(validatePasswordMessage);
    } else if (confirmPassword && value !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    const isValid = value === newPassword;
    setConfirmPasswordValid(isValid);
    if (!isValid) {
      setPasswordError('Las contraseñas no coinciden');
    } else if (!validatePassword(newPassword)) {
      setPasswordError(validatePasswordMessage);
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValid || !confirmPasswordValid) {
      if (!validatePassword(newPassword)) {
        setPasswordError(validatePasswordMessage);
      } else if (newPassword !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
      }
      return;
    }
    
    try {
      await changePassword({ email, newPassword });
      setStep(4);
      setPasswordError('');
      toast.success('Contraseña actualizada exitosamente');
    } catch (err) {
      setPasswordError(err.message || 'Error al actualizar la contraseña');
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

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
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-[#022873] p-4 rounded-full border-4 border-[#9AF241]">
                  <FaEnvelope className="text-3xl text-[#9AF241]" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center text-[#9AF241] mb-2">
                Recuperar Contraseña
              </h2>
              <p className="text-center text-sm text-gray-300 mb-8">
                Ingresa tu correo electrónico para recibir un código de verificación
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium text-white w-full">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsValidEmail(validateEmail(e.target.value));
                    setShowError(false);
                  }}
                  className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none"
                />
                {showError && (
                  <p className="text-red-400 text-sm mt-1">Por favor ingresa un correo electrónico válido</p>
                )}
                {error && (
                  <p className="text-red-400 text-sm mt-1">{error.message || "Error al enviar el código"}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={!isValidEmail || loading}
                whileHover={isValidEmail ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.96 }}
                className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                  !isValidEmail || loading
                    ? 'bg-gray-500 cursor-not-allowed text-white'
                    : 'bg-[#9AF241] hover:shadow-[0_0_10px_#9AF241] text-[#022873]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : 'Enviar Código'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-[#9AF241] hover:underline font-medium"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-[#022873] p-4 rounded-full border-4 border-[#9AF241]">
                  <FaLock className="text-3xl text-[#9AF241]" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center text-[#9AF241] mb-2">
                Verifica tu identidad
              </h2>
              <p className="text-center text-sm text-gray-300 mb-4">
                Hemos enviado un código de 6 dígitos a tu correo electrónico
              </p>
              <p className="text-center text-sm font-medium text-[#9AF241] mb-8">
                {email}
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="w-full">
                <label htmlFor="code" className="block text-sm font-medium text-white w-full">
                  Código de verificación
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setShowError(false);
                  }}
                  maxLength="6"
                  className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none text-center tracking-widest font-mono text-xl"
                />
                {showError && (
                  <p className="text-red-400 text-sm mt-1">Código incorrecto. Por favor intenta nuevamente.</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={code.length !== 6 || loading}
                whileHover={code.length === 6 ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.96 }}
                className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                  code.length !== 6 || loading
                    ? 'bg-gray-500 cursor-not-allowed text-white'
                    : 'bg-[#9AF241] hover:shadow-[0_0_10px_#9AF241] text-[#022873]'
                }`}
              >
                {loading ? 'Validando...' : 'Validar Código'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-[#9AF241] hover:underline font-medium"
              >
                Cambiar correo electrónico
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-[#022873] p-4 rounded-full border-4 border-[#9AF241]">
                  <FaKey className="text-3xl text-[#9AF241]" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center text-[#9AF241] mb-2">
                Establecer nueva contraseña
              </h2>
              <p className="text-center text-sm text-gray-300 mb-4">
                Por favor ingresa una nueva contraseña para tu cuenta
              </p>
              <p className="text-center text-sm font-medium text-[#9AF241] mb-8">
                {email}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="w-full">
                <label htmlFor="newPassword" className="block text-sm font-medium text-white w-full">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={(e) => handlePasswordChange(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none"
                />
                {!passwordValid && newPassword && (
                  <p className="text-red-400 text-sm mt-1">{validatePasswordMessage}</p>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white w-full">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  onBlur={(e) => handleConfirmPasswordChange(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none"
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading || !passwordValid || !confirmPasswordValid}
                whileHover={passwordValid && confirmPasswordValid ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.96 }}
                className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                  loading || !passwordValid || !confirmPasswordValid
                    ? 'bg-gray-500 cursor-not-allowed text-white'
                    : 'bg-[#9AF241] hover:shadow-[0_0_10px_#9AF241] text-[#022873]'
                }`}
              >
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-sm text-[#9AF241] hover:underline font-medium"
              >
                Volver a verificar código
              </button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-[#022873] p-4 rounded-full border-4 border-[#9AF241]">
                  <FaCheckCircle className="text-3xl text-[#9AF241]" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center text-[#9AF241] mb-2">
                ¡Contraseña actualizada!
              </h2>
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-300 mb-2">
                  Tu contraseña ha sido actualizada correctamente.
                </p>
                <p className="text-sm font-medium text-[#9AF241]">
                  {email}
                </p>
              </div>
              <p className="text-sm text-gray-300 mb-8">
                Ahora puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>

            <motion.button
              onClick={handleBackToLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-3 rounded-xl font-semibold shadow-md bg-[#9AF241] hover:shadow-[0_0_10px_#9AF241] text-[#022873]"
            >
              Iniciar sesión
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};