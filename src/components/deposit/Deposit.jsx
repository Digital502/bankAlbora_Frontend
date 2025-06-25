import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useDeposit } from "../../shared/hooks/useDeposit";
import toast from "react-hot-toast";
import { Footer } from "../footer/Footer";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";

export const Deposit = () => {
  const { 
    accounts, 
    processTransaction, 
    isLoading,
    fetchAccounts
  } = useDeposit();

  const [formData, setFormData] = useState({
    tipo: "",
    cuentaOrigen: "",
    monto: "",
    cuentaDestino: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tipo) {
      newErrors.tipo = "Selecciona un tipo de transacción";
    }
    
    if (!formData.cuentaOrigen) {
      newErrors.cuentaOrigen = "Cuenta origen es requerida";
    }
    
    const montoValue = parseFloat(formData.monto);
    if (!formData.monto || isNaN(montoValue)) {
      newErrors.monto = "Ingrese un monto válido";
    } else if (montoValue <= 0) {
      newErrors.monto = "Monto debe ser mayor a 0";
    } else if (montoValue > 2000) {
      newErrors.monto = "Monto máximo es Q2000 por transacción";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.monto)) {
      newErrors.monto = "Formato inválido (use hasta 2 decimales)";
    }
    
    if (formData.tipo === "transferencia" && !formData.cuentaDestino) {
      newErrors.cuentaDestino = "Cuenta destino es requerida para transferencias";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {

      const monto = parseFloat(formData.monto);
      
      await processTransaction({
        tipo: formData.tipo,
        cuentaOrigen: formData.cuentaOrigen,
        monto: monto,
        cuentaDestino: formData.cuentaDestino
      });

      toast.success(`Transacción de ${formData.tipo} por Q${monto.toFixed(2)} realizada con éxito`);
      
      setFormData({
        tipo: "",
        cuentaOrigen: "",
        monto: "",
        cuentaDestino: ""
      });
      
      await fetchAccounts();
    } catch (error) {
      console.error("Error en la transacción:", error);
      toast.error(error.message || "Ocurrió un error al procesar la transacción");
    }
  };

  return (
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
            className="text-3xl font-bold mb-2 text-[#9AF241] tracking-tight"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Transacción Bancaria
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Realiza depósitos, transferencias o retiros
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#9AF241]">
              Tipo de Transacción *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full bg-[#334155] border ${
                errors.tipo ? "border-red-500" : "border-[#9AF241]"
              } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
            >
              <option value="">Selecciona un tipo</option>
              <option value="deposito">Depósito</option>
              <option value="transferencia">Transferencia</option>
              <option value="retiro">Retiro</option>
            </select>
            {errors.tipo && (
              <motion.p
                className="text-sm text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.tipo}
              </motion.p>
            )}
          </div>


          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#9AF241]">
              Cuenta Origen *
            </label>
            <select
              name="cuentaOrigen"
              value={formData.cuentaOrigen}
              onChange={handleChange}
              className={`w-full bg-[#334155] border ${
                errors.cuentaOrigen ? "border-red-500" : "border-[#9AF241]"
              } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
            >
              <option value="">Selecciona una cuenta</option>
              {accounts.map(account => (
                <option key={account.numeroCuenta} value={account.numeroCuenta}>
                  {account.numeroCuenta} - {account.tipoCuenta} (Q{account.saldoCuenta?.toFixed(2) || '0.00'})
                </option>
              ))}
            </select>
            {errors.cuentaOrigen && (
              <motion.p
                className="text-sm text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.cuentaOrigen}
              </motion.p>
            )}
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#9AF241]">
              Monto (Q) *
            </label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              max="2000"
              placeholder="0.00"
              className={`w-full bg-[#334155] border ${
                errors.monto ? "border-red-500" : "border-[#9AF241]"
              } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
            />
            {errors.monto && (
              <motion.p
                className="text-sm text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.monto}
              </motion.p>
            )}
            <p className="text-xs text-gray-400">Máximo Q2,000 por transacción (formato: 0.00)</p>
          </div>


          {formData.tipo === "transferencia" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-[#9AF241]">
                Cuenta Destino *
              </label>
              <select
                name="cuentaDestino"
                value={formData.cuentaDestino}
                onChange={handleChange}
                className={`w-full bg-[#334155] border ${
                  errors.cuentaDestino ? "border-red-500" : "border-[#9AF241]"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
              >
                <option value="">Selecciona una cuenta</option>
                {accounts
                  .filter(account => account.numeroCuenta !== formData.cuentaOrigen)
                  .map(account => (
                    <option key={account.numeroCuenta} value={account.numeroCuenta}>
                      {account.numeroCuenta} - {account.tipoCuenta} (Q{account.saldoCuenta?.toFixed(2) || '0.00'})
                    </option>
                  ))}
              </select>
              {errors.cuentaDestino && (
                <motion.p
                  className="text-sm text-red-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.cuentaDestino}
                </motion.p>
              )}
            </motion.div>
          )}

          {formData.tipo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-[#334155]/50 rounded-lg border border-[#45858c]"
            >
              <h4 className="text-sm font-semibold text-[#9AF241] mb-2">
                Requisitos para {formData.tipo}:
              </h4>
              <ul className="text-xs text-gray-300 space-y-1">
                {formData.tipo === "deposito" && (
                  <>
                    <li>• Máximo Q2,000 por transacción</li>
                    <li>• Límite diario: Q10,000 en depósitos</li>
                    <li>• Formato: 0.00 (ej. 50.00)</li>
                  </>
                )}
                {formData.tipo === "transferencia" && (
                  <>
                    <li>• Máximo Q2,000 por transacción</li>
                    <li>• Límite diario: Q10,000 en transferencias</li>
                    <li>• Fondos suficientes requeridos</li>
                    <li>• Formato: 0.00 (ej. 50.00)</li>
                  </>
                )}
                {formData.tipo === "retiro" && (
                  <>
                    <li>• Solo cuentas de AHORRO o MONETARIA</li>
                    <li>• Máximo Q2,000 por transacción</li>
                    <li>• Límite diario: Q10,000 en retiros</li>
                    <li>• Fondos suficientes requeridos</li>
                    <li>• Formato: 0.00 (ej. 50.00)</li>
                  </>
                )}
              </ul>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.03, boxShadow: "0 0 15px #06b6d4" } : {}}
            whileTap={{ scale: 0.97 }}
            className={`mt-6 py-3 px-6 rounded-xl font-medium tracking-wide shadow-lg transition-all w-full ${
              isLoading
                ? "bg-gray-500/50 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:shadow-[0_0_15px_#06b6d4]"
            }`}
          >
            {isLoading ? <LoadingSpinner/> : "Realizar Transacción"}
          </motion.button>
        </form>


        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/history" 
            className="text-[#9AF241] hover:text-cyan-300 transition-colors underline underline-offset-4 text-sm"
          >
            Ver el historial de transacciones aquí
          </Link>
        </motion.div>
      </div>
    </motion.div>
    <Footer/>
  </div>
);
};