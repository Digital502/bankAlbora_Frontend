import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';
import { useDepositUsers } from "../../shared/hooks/useDepositUsers";
import toast from "react-hot-toast";
import { Footer } from "../footer/Footer";
import { NavbarDashboardUser } from "../navs/NavbarDashboardUser";

export const DepositUser = () => {
  const location = useLocation();
  const { 
    accounts,
    allAccounts,
    processTransaction, 
    isLoading,
    fetchAccounts,
    fetchAllAccounts
  } = useDepositUsers();

  const [fromFavorite, setFromFavorite] = useState(false);
  const [preselectedAccount, setPreselectedAccount] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fromFavoriteParam = searchParams.get('fromFavorite');
    const accountParam = searchParams.get('account');
    
    if (fromFavoriteParam && accountParam) {
      setFromFavorite(true);
      setPreselectedAccount(accountParam);
      setFormData(prev => ({
        ...prev,
        cuentaDestino: accountParam
      }));
    }
  }, [location.search]);

  const [formData, setFormData] = useState({
    cuentaOrigen: "",
    monto: "",
    cuentaDestino: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    if (fromFavorite && name === "cuentaDestino") return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const montoValue = parseFloat(formData.monto);

    if (!formData.cuentaOrigen) newErrors.cuentaOrigen = "Cuenta origen es requerida";
    if (!formData.monto || isNaN(montoValue)) {
      newErrors.monto = "Ingrese un monto válido";
    } else if (montoValue <= 0) {
      newErrors.monto = "Monto debe ser mayor a 0";
    } else if (montoValue > 2000) {
      newErrors.monto = "Monto máximo es Q2000 por transacción";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.monto)) {
      newErrors.monto = "Formato inválido (use hasta 2 decimales)";
    }
    if (!formData.cuentaDestino) newErrors.cuentaDestino = "Cuenta destino es requerida para transferencias";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const monto = parseFloat(formData.monto);
      await processTransaction({
        tipo: "transferencia",
        cuentaOrigen: formData.cuentaOrigen,
        monto,
        cuentaDestino: formData.cuentaDestino
      });
      toast.success(`Transferencia por Q${monto.toFixed(2)} realizada con éxito`);
      setFormData({ 
        cuentaOrigen: "", 
        monto: "", 
        cuentaDestino: fromFavorite ? preselectedAccount : "" 
      });

      await fetchAccounts();
      await fetchAllAccounts();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Ocurrió un error al procesar la transferencia");
    }
  };

  const userAccounts = accounts;
  const otherAccounts = allAccounts.filter(acc => acc.numeroCuenta !== formData.cuentaOrigen);

  const selectedAccount = allAccounts.find(acc => acc.numeroCuenta === formData.cuentaDestino);

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
              Transferencia Bancaria
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-300" 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
            >
              {fromFavorite ? "Transferencia rápida a favoritos" : "Realiza transferencias entre cuentas"}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#9AF241]">Cuenta Origen *</label>
              <select
                name="cuentaOrigen"
                value={formData.cuentaOrigen}
                onChange={handleChange}
                className={`w-full bg-[#334155] border ${errors.cuentaOrigen ? "border-red-500" : "border-[#9AF241]"} rounded-lg px-4 py-3`}
              >
                <option value="">Selecciona tu cuenta</option>
                {userAccounts.map(acc => (
                  <option key={acc.numeroCuenta} value={acc.numeroCuenta}>
                    {acc.numeroCuenta} - {acc.tipoCuenta} (Q{acc.saldoCuenta?.toFixed(2) || '0.00'})
                  </option>
                ))}
              </select>
              {errors.cuentaOrigen && (
                <motion.p 
                  className="text-sm text-red-400" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                >
                  {errors.cuentaOrigen}
                </motion.p>
              )}
            </div>


            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#9AF241]">Monto (Q) *</label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                max="2000"
                placeholder="0.00"
                className={`w-full bg-[#334155] border ${errors.monto ? "border-red-500" : "border-[#9AF241]"} rounded-lg px-4 py-3`}
              />
              {errors.monto && (
                <motion.p 
                  className="text-sm text-red-400" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                >
                  {errors.monto}
                </motion.p>
              )}
              <p className="text-xs text-gray-400">Máximo Q2,000 por transacción (formato: 0.00)</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#9AF241]">Cuenta Destino *</label>
              {fromFavorite ? (
                <div className="w-full bg-[#334155]/50 border border-[#9AF241] rounded-lg px-4 py-3 text-gray-100">
                  <p>
                    {formData.cuentaDestino} - {selectedAccount?.tipoCuenta || 'Cuenta favorita'} 
                    (Q{selectedAccount?.saldoCuenta?.toFixed(2) || '0.00'})
                  </p>
                  <input type="hidden" name="cuentaDestino" value={formData.cuentaDestino} />
                </div>
              ) : (
                <select
                  name="cuentaDestino"
                  value={formData.cuentaDestino}
                  onChange={handleChange}
                  className={`w-full bg-[#334155] border ${errors.cuentaDestino ? "border-red-500" : "border-[#9AF241]"} rounded-lg px-4 py-3`}
                >
                  <option value="">Selecciona una cuenta destino</option>
                  {otherAccounts.map(acc => (
                    <option key={acc.numeroCuenta} value={acc.numeroCuenta}>
                      {acc.numeroCuenta} - {acc.tipoCuenta} (Q{acc.saldoCuenta?.toFixed(2) || '0.00'})
                    </option>
                  ))}
                </select>
              )}
              {errors.cuentaDestino && (
                <motion.p 
                  className="text-sm text-red-400" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                >
                  {errors.cuentaDestino}
                </motion.p>
              )}
            </div>

            <motion.div 
              className="p-4 bg-[#334155]/50 rounded-lg border border-[#45858c]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-sm font-semibold text-[#9AF241] mb-2">Requisitos para transferencias:</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Máximo Q2,000 por transacción</li>
                <li>• Límite diario: Q10,000 en transferencias</li>
                <li>• Fondos suficientes requeridos</li>
                <li>• Formato: 0.00 (ej. 50.00)</li>
              </ul>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.03 } : {}}
              whileTap={{ scale: 0.97 }}
              className={`mt-6 py-3 px-6 rounded-xl font-medium w-full ${isLoading ? "bg-gray-500/50 cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 to-cyan-700"}`}
            >
              {isLoading ? "Procesando..." : "Realizar Transferencia"}
            </motion.button>
          </form>
        </div>
      </motion.div>
      <Footer />
    </div>
    </>
    
  );
};