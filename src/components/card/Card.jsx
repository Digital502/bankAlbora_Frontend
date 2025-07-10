import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEmitirTarjeta } from "../../shared/hooks/useServiceCard";
import toast from "react-hot-toast";
import { NavbarDashboardUser } from "../navs/NavbarDashboardUser";
import { Footer } from "../footer/Footer";
import { useNavigate } from "react-router-dom";

export const Card = () => {
  const { accounts, emitirNuevaTarjeta, isLoading, fetchAccounts } = useEmitirTarjeta();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numeroCuenta: "",
    tipo: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFormData(prev => ({ ...prev, numeroCuenta: '' }));

    if (value.trim() === '') {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }

    const match = accounts.find(acc => acc.numeroCuenta === value.trim());
    if (match) {
      setFormData(prev => ({ ...prev, numeroCuenta: match.numeroCuenta }));
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (accountNumber) => {
    setSearchTerm(accountNumber);
    setFormData(prev => ({ ...prev, numeroCuenta: accountNumber }));
    setShowSuggestions(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.numeroCuenta) newErrors.numeroCuenta = "Seleccione una cuenta";
    if (!formData.tipo) newErrors.tipo = "Seleccione un tipo de tarjeta";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const respuesta = await emitirNuevaTarjeta({
        numeroCuenta: formData.numeroCuenta,
        tipo: formData.tipo,
      });

      toast.success("Tarjeta emitida con éxito");
      setFormData({ numeroCuenta: "", tipo: "" });
      setSearchTerm("");
      await fetchAccounts();
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setShowModal(false);
      toast.error("Error al emitir la tarjeta");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleMyServices = () => {
    navigate("/user/servicios");
  }

  return (
    <>
      <NavbarDashboardUser />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative z-10 w-full max-w-md bg-[#1e293b] border border-[#9AF241] rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.h2
                className="text-3xl font-bold mb-2 text-[#9AF241]"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Emitir Nueva Tarjeta
              </motion.h2>
              <motion.p
                className="text-lg text-gray-300"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Selecciona la cuenta y tipo de tarjeta a emitir
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#9AF241]">
                  Cuenta *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Buscar cuenta por número"
                    className={`w-full bg-[#334155] border ${errors.numeroCuenta ? "border-red-500" : "border-[#9AF241]"
                      } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                    disabled={isLoading}
                  />
                  {showSuggestions && (
                    <ul className="absolute z-10 w-full bg-[#1e293b] border border-[#9AF241] mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                      {accounts
                        .filter(acc =>
                          acc.numeroCuenta.toLowerCase().includes(searchTerm.toLowerCase()) &&
                          acc.numeroCuenta !== searchTerm
                        )
                        .map(acc => (
                          <li
                            key={acc.numeroCuenta}
                            onClick={() => handleSuggestionClick(acc.numeroCuenta)}
                            className="px-4 py-2 hover:bg-[#334155] cursor-pointer text-white text-sm"
                          >
                            {acc.numeroCuenta} - {acc.tipoCuenta} (Q{acc.saldoCuenta?.toFixed(2) || '0.00'})
                          </li>
                        ))}
                      {accounts.filter(acc => acc.numeroCuenta.includes(searchTerm)).length === 0 && (
                        <li className="px-4 py-2 text-gray-400 text-sm">No se encontraron coincidencias</li>
                      )}
                    </ul>
                  )}
                </div>
                {errors.numeroCuenta && (
                  <motion.p
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.numeroCuenta}
                  </motion.p>
                )}
                {formData.numeroCuenta && (
                  <div className="mt-2 text-sm text-green-400">
                    Cuenta seleccionada: {formData.numeroCuenta}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#9AF241]">
                  Tipo de Tarjeta *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`w-full bg-[#334155] border ${errors.tipo ? "border-red-500" : "border-[#9AF241]"
                    } rounded-lg px-4 py-3`}
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="DEBITO">DEBITO</option>
                  <option value="CREDITO">CREDITO</option>
                </select>
                {errors.tipo && (
                  <motion.p
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.tipo}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.03 } : {}}
                whileTap={{ scale: 0.97 }}
                className={`mt-6 py-3 px-6 rounded-xl font-medium w-full ${isLoading
                    ? "bg-gray-500/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-cyan-700"
                  }`}
              >
                {isLoading ? "Enviando Solicitud..." : "Solictar Tarjeta"}
              </motion.button>
            </form>
          </div>
        </motion.div>
        <Footer />
        {showModal && (
          <div className="fixed inset-0 bg-[#1e293b] bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-[#1e293b] border border-[#9AF241] rounded-2xl shadow-xl p-8 w-full max-w-lg mx-4 relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-[#9AF241] hover:text-[#7ad327] text-xl font-bold"
              >
                ✕
              </button>

              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                  className="bg-[#9AF241] p-4 rounded-full"
                >
                  <svg className="h-8 w-8 text-[#0f172a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>

              <h3 className="text-center text-2xl font-bold text-[#9AF241] mb-4">
                ¡Solicitud Enviada Exitosamente!
              </h3>

              <div className="bg-[#334155] p-4 rounded-lg border border-[#45858c] text-gray-100 space-y-2">
                <p>Tu solicitud ha sido registrada correctamente.</p>
                <p>Te notificaremos por correo electrónico cuando sea aprobada.</p>
              </div>

              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMyServices}
                  className="bg-[#9AF241] hover:bg-[#7ad327] text-[#0f172a] font-semibold py-2 px-6 rounded-lg transition"
                >
                  Ver Mis Servicios
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};