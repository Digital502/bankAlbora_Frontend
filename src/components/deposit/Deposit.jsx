import React, { useState, useEffect } from "react";
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
  const [searchTermOrigen, setSearchTermOrigen] = useState("");
  const [searchTermDestino, setSearchTermDestino] = useState("");
  const [showSuggestionsOrigen, setShowSuggestionsOrigen] = useState(false);
  const [showSuggestionsDestino, setShowSuggestionsDestino] = useState(false);

  useEffect(() => {
    const exactMatchOrigen = accounts.find(
      account => account.numeroCuenta === searchTermOrigen.trim()
    );
    if (exactMatchOrigen && formData.cuentaOrigen !== exactMatchOrigen.numeroCuenta) {
      setFormData(prev => ({ ...prev, cuentaOrigen: exactMatchOrigen.numeroCuenta }));
      setShowSuggestionsOrigen(false);
    }

    const exactMatchDestino = accounts.find(
      account => account.numeroCuenta === searchTermDestino.trim()
    );
    if (exactMatchDestino && formData.cuentaDestino !== exactMatchDestino.numeroCuenta) {
      setFormData(prev => ({ ...prev, cuentaDestino: exactMatchDestino.numeroCuenta }));
      setShowSuggestionsDestino(false);
    }
  }, [searchTermOrigen, searchTermDestino, accounts, formData.cuentaOrigen, formData.cuentaDestino]);

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

  const handleAccountSearchChange = (e, type) => {
    const value = e.target.value;
    
    if (type === 'origen') {
      setSearchTermOrigen(value);
      setFormData(prev => ({ ...prev, cuentaOrigen: '' }));
      setShowSuggestionsOrigen(value.trim() !== '');
    } else {
      setSearchTermDestino(value);
      setFormData(prev => ({ ...prev, cuentaDestino: '' }));
      setShowSuggestionsDestino(value.trim() !== '');
    }
  };

  const handleAccountSelect = (accountNumber, type) => {
    if (type === 'origen') {
      setFormData(prev => ({ ...prev, cuentaOrigen: accountNumber }));
      const selectedAccount = accounts.find(acc => acc.numeroCuenta === accountNumber);
      setSearchTermOrigen(selectedAccount ? `${accountNumber} - ${selectedAccount.tipoCuenta}` : accountNumber);
      setShowSuggestionsOrigen(false);
    } else {
      setFormData(prev => ({ ...prev, cuentaDestino: accountNumber }));
      const selectedAccount = accounts.find(acc => acc.numeroCuenta === accountNumber);
      setSearchTermDestino(selectedAccount ? `${accountNumber} - ${selectedAccount.tipoCuenta}` : accountNumber);
      setShowSuggestionsDestino(false);
    }
  };

  const filteredAccountsOrigen = accounts.filter(account => 
    account.numeroCuenta.includes(searchTermOrigen) ||
    account.tipoCuenta.toLowerCase().includes(searchTermOrigen.toLowerCase())
  );

  const filteredAccountsDestino = accounts
    .filter(account => account.numeroCuenta !== formData.cuentaOrigen)
    .filter(account => 
      account.numeroCuenta.includes(searchTermDestino) ||
      account.tipoCuenta.toLowerCase().includes(searchTermDestino.toLowerCase())
    );

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
      
      setSearchTermOrigen("");
      setSearchTermDestino("");
      
      await fetchAccounts();
    } catch (error) {
      console.error("Error en la transacción:", error);
      toast.error(error.message || "Ocurrió un error al procesar la transacción");
    }
  };

  const renderAccountSearchField = (type) => {
    const isOrigen = type === 'origen';
    const searchTerm = isOrigen ? searchTermOrigen : searchTermDestino;
    const showSuggestions = isOrigen ? showSuggestionsOrigen : showSuggestionsDestino;
    const filteredAccounts = isOrigen ? filteredAccountsOrigen : filteredAccountsDestino;
    const error = isOrigen ? errors.cuentaOrigen : errors.cuentaDestino;
    const value = isOrigen ? formData.cuentaOrigen : formData.cuentaDestino;

    return (
      <div className="space-y-2 relative">
        <label className="block text-sm font-medium text-[#9AF241]">
          {isOrigen ? "Cuenta Origen *" : "Cuenta Destino *"}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleAccountSearchChange(e, type)}
            onFocus={() => isOrigen ? setShowSuggestionsOrigen(true) : setShowSuggestionsDestino(true)}
            onBlur={() => setTimeout(() => isOrigen ? setShowSuggestionsOrigen(false) : setShowSuggestionsDestino(false), 200)}
            placeholder={`Buscar cuenta por número o tipo`}
            className={`w-full bg-[#334155] border ${
              error ? "border-red-500" : "border-[#9AF241]"
            } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
          />
          <input type="hidden" name={isOrigen ? "cuentaOrigen" : "cuentaDestino"} value={value} />
          
          {showSuggestions && (
            <ul className="absolute z-10 w-full bg-[#1e293b] border border-[#9AF241] mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map(account => (
                  <li
                    key={account.numeroCuenta}
                    onClick={() => handleAccountSelect(account.numeroCuenta, type)}
                    className={`px-4 py-2 hover:bg-[#334155] cursor-pointer text-white text-sm ${
                      account.numeroCuenta === value ? 'bg-[#334155]' : ''
                    }`}
                  >
                    {account.numeroCuenta} - {account.tipoCuenta} (Q{account.saldoCuenta?.toFixed(2) || '0.00'})
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400 text-sm">No se encontraron coincidencias</li>
              )}
            </ul>
          )}
        </div>
        {error && (
          <motion.p
            className="text-sm text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
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

            {renderAccountSearchField('origen')}

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
              >
                {renderAccountSearchField('destino')}
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