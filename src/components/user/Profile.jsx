import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMyUser } from "../../../src/shared/hooks/useMyUser";
import { Footer } from "../../components/footer/Footer";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import {
  validateText,
  validateTextMessage,
  validatePositiveNumber,
  validatePositiveNumberMessage,
  validatePassword,
  validatePasswordMessage,
  validateDifferentPasswords,
  validateDifferentPasswordsMessage,
} from "../../shared/validators";
import {
  User,
  MapPin,
  Briefcase,
  DollarSign,
  BadgeCheck,
  Mail,
  Phone,
  IdCard,
  Lock,
} from "lucide-react";

export const PerfilUsuario = () => {
  const { user, loading, error, successMessage, updateMyUser } = useMyUser();

  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    trabajo: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);

  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    viejaContraseña: "",
    nuevaContraseña: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        direccion: user.direccion || "",
        trabajo: user.trabajo || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { changePassword } = useMyUser(); 

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const { viejaContraseña, nuevaContraseña } = passwordData;
    const errors = {};

    if (!validatePassword(nuevaContraseña)) {
      errors.nuevaContraseña = validatePasswordMessage;
    }

    if (!validateDifferentPasswords(viejaContraseña, nuevaContraseña)) {
      errors.nuevaContraseña = validateDifferentPasswordsMessage;
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    await changePassword(passwordData);
    setPasswordData({ viejaContraseña: "", nuevaContraseña: "" });
    setShowPasswordForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    ["nombre", "direccion", "trabajo"].forEach((field) => {
      if (!validateText(formData[field])) {
        newErrors[field] = validateTextMessage;
      }
    });


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateMyUser(formData);
    setIsEditable(false);
  };

  if (loading) return <LoadingSpinner/>;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-[#9AF241] mb-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Perfil del Usuario
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Columna izquierda */}
        <motion.div
          className="bg-[#1e293b] w-full md:w-1/3 p-6 rounded-2xl shadow-lg text-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#0f172a] border-4 border-[#9AF241]">
            <User size={64} className="text-[#9AF241]" />
          </div>
          <h2 className="text-xl font-semibold mb-6">{formData.nombre}</h2>
          <div className="space-y-4">
              <button
                className={`w-full bg-[#134e4a] hover:bg-[#0f3e3b] text-white py-2 rounded-lg font-semibold ${
                  !showPasswordForm ? "ring-2 ring-[#9AF241]" : ""
                }`}
                onClick={() => {
                  setShowPasswordForm(false);
                  setIsEditable(false);
                }}
              >
                Cuenta
              </button>           
               <button
              className={`w-full bg-[#134e4a] hover:bg-[#0f3e3b] text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                showPasswordForm ? "ring-2 ring-[#9AF241]" : ""
              }`}
              onClick={() => {
                setShowPasswordForm(true);
                setIsEditable(false); 
              }}
            >
              <Lock size={16} /> Cambiar Contraseña
            </button>
          </div>
        </motion.div>

        {/* Columna derecha */}
        <motion.div
          className="bg-[#1e293b] w-full md:w-2/3 p-6 rounded-2xl shadow-lg relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
        {!showPasswordForm && (
          <div className="space-y-4 text-[#CDE5DD] mb-4">
            <p className="flex items-center gap-2"><BadgeCheck size={18} /><strong>Usuario:</strong> {user?.nombreUsuario}</p>
            <p className="flex items-center gap-2"><Mail size={18} /><strong>Correo:</strong> {user?.correo}</p>
            <p className="flex items-center gap-2"><IdCard size={18} /><strong>DPI:</strong> {user?.DPI}</p>
            <p className="flex items-center gap-2"><Phone size={18} /><strong>Celular:</strong> {user?.celular}</p>
          </div>
        )}

      {showPasswordForm ? (
        <form onSubmit={handlePasswordChange} className="space-y-6 mt-10">
        {[
          {
            label: "Contraseña Anterior",
            name: "viejaContraseña",
            type: showOldPassword ? "text" : "password",
            toggle: () => setShowOldPassword(!showOldPassword),
            toggleState: showOldPassword,
          },
          {
            label: "Nueva Contraseña",
            name: "nuevaContraseña",
            type: showNewPassword ? "text" : "password",
            toggle: () => setShowNewPassword(!showNewPassword),
            toggleState: showNewPassword,
          }
        ].map(({ label, name, type, toggle, toggleState }) => (
          <div key={name}>
            <label className="block mb-1 font-medium text-[#9AF241]">
              {label}
            </label>
            <div className="relative">
              <input
                type={type}
                name={name}
                value={passwordData[name]}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, [name]: e.target.value }))
                }
                className={`w-full px-4 py-2 bg-[#0f172a] text-white border rounded-lg focus:outline-none focus:ring-2 ${
                  passwordErrors[name]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#9AF241] focus:ring-[#9AF241]"
                }`}
              />
              <button
                type="button"
                onClick={toggle}
                className="absolute right-3 top-2 text-sm text-[#9AF241] hover:underline"
              >
                {toggleState ? "Ocultar" : "Ver"}
              </button>
            </div>
            {passwordErrors[name] && (
              <p className="text-red-400 text-sm mt-1">{passwordErrors[name]}</p>
            )}
          </div>
        ))}

          <div className="flex justify-center gap-4">
            <motion.button
              type="submit"
              className="bg-[#9AF241] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#baff63] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Guardar
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {
                setShowPasswordForm(false);
                setPasswordData({ viejaContraseña: "", nuevaContraseña: "" });
              }}
              className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancelar
            </motion.button>
          </div>
        </form>
          ):!isEditable ? (
            <>
              <div className="space-y-4 text-[#CDE5DD] mt-1">
                <p className="flex items-center gap-2"><User size={18} /> <strong>Nombre:</strong> {formData.nombre}</p>
                <p className="flex items-center gap-2"><MapPin size={18} /> <strong>Dirección:</strong> {formData.direccion}</p>
                <p className="flex items-center gap-2"><Briefcase size={18} /> <strong>Trabajo:</strong> {formData.trabajo}</p>
              </div>

              <div className="flex justify-center mt-10">
                <motion.button
                  type="button"
                  onClick={() => setIsEditable(true)}
                  className="bg-[#9AF241] text-black font-semibold px-15 py-2 rounded-lg hover:bg-[#baff63] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Editar
                </motion.button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 mt-10">
              {[
                { label: "Nombre", name: "nombre", type: "text" },
                { label: "Dirección", name: "direccion", type: "text" },
                { label: "Trabajo", name: "trabajo", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block mb-1 font-medium text-[#9AF241]">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-[#0f172a] text-white border rounded-lg focus:outline-none focus:ring-2
                      ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-[#9AF241] focus:ring-[#9AF241]"}`}
                  />
                  {errors[name] && (
                    <p className="text-red-400 text-sm mt-1">{errors[name]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-center gap-4">
                <motion.button
                  type="submit"
                  className="bg-[#9AF241] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#baff63] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Guardar Cambios
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    setIsEditable(false);
                    setFormData({
                      nombre: user?.nombre || "",
                      direccion: user?.direccion || "",
                      trabajo: user?.trabajo || "",
                    });
                    setErrors({});
                  }}
                  className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </form>
          )}

          <div className="flex justify-center">
            {successMessage && (
              <p className="text-green-400 mt-10">{successMessage}</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-70">
        <Footer />
      </div>
    </div>
  );
};
