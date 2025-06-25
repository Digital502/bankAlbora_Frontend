import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavbarDashboardUser } from '../navs/NavbarDashboardUser';
import { useLoan } from "../../shared/hooks/useCreditUser";
import { useMyAccount } from "../../shared/hooks/useMyAccount";
import { Footer } from "../footer/Footer";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { User, Wallet, FileText } from "lucide-react";
import toast from "react-hot-toast";

export const CreditUser = () => {
  const { requestLoan, getLoanDetails, loanDetails, isLoading, payLoan } = useLoan();
  const { account, loading: accountLoading } = useMyAccount();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({ monto: "" });
  const [paymentData, setPaymentData] = useState({ montoPago: "" });
  const [errors, setErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  useEffect(() => {
    if (account && account.length > 0) {
      setSelectedAccount(account[0].numeroCuenta); 
      getLoanDetails(account[0].numeroCuenta); 
    }
  }, [account]);

  useEffect(() => {
    if (loanDetails) {
      setPaymentData({ montoPago: loanDetails.cuotaMensual }); 
    }
  }, [loanDetails]);

  const validateForm = () => {
    const newErrors = {};
    const montoValue = parseFloat(formData.monto);

    if (!formData.monto || isNaN(montoValue)) {
      newErrors.monto = "Ingrese un monto válido";
    } else if (montoValue <= 0) {
      newErrors.monto = "El monto debe ser mayor a 0";
    } else if (montoValue > 20000) {
      newErrors.monto = "El monto máximo para un préstamo es Q20,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await requestLoan({ cuentaDestino: selectedAccount, monto: formData.monto });
      toast.success("Solicitud de préstamo enviada exitosamente");
      setFormData({ monto: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Ocurrió un error al solicitar el préstamo");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      await payLoan({ cuentaUsuario: selectedAccount, montoPago: parseFloat(paymentData.montoPago) });
      toast.success("Pago realizado exitosamente");
      setPaymentData({ montoPago: loanDetails.cuotaMensual }); 
      await getLoanDetails(selectedAccount); 
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Ocurrió un error al realizar el pago");
    }
  };

  if (accountLoading || isLoading) return <LoadingSpinner />;

  return (
    <div>
      <NavbarDashboardUser />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-[#9AF241] mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Gestión de Préstamos
        </motion.h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#0f172a] border-4 border-[#9AF241]">
                <User size={32} className="text-[#9AF241]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#9AF241]">Usuario</h2>
                <p className="text-white">{account && account.length > 0 ? account[0].nombreUsuario : "Nombre no disponible"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-[#CDE5DD]">
                <strong>Número de cuenta:</strong> {account && account.length > 0 ? account[0].numeroCuenta : "No disponible"}
              </p>
              <p className="text-sm text-[#CDE5DD]">
                <strong>Saldo disponible:</strong> Q{account && account.length > 0 ? account[0].saldoCuenta?.toFixed(2) : "0.00"}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#0f172a] border-4 border-[#9AF241]">
                <FileText size={32} className="text-[#9AF241]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#9AF241]">Acuerdos del Préstamo</h2>
              </div>
            </div>
            <p className="text-sm text-[#CDE5DD]">
              Al solicitar un préstamo, el usuario acepta los términos y condiciones establecidos por el banco. Esto incluye el pago de cuotas mensuales, intereses aplicables, y la comisión correspondiente. Asegúrese de leer y comprender los acuerdos antes de proceder.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[#9AF241] mb-4">Solicitar Préstamo</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-[#9AF241]">Monto (Q) *</label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={(e) => setFormData({ monto: e.target.value })}
                  className={`w-full px-4 py-2 bg-[#0f172a] text-white border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.monto ? "border-red-500 focus:ring-red-500" : "border-[#9AF241] focus:ring-[#9AF241]"
                  }`}
                />
                {errors.monto && <p className="text-red-400 text-sm mt-1">{errors.monto}</p>}
              </div>
              <motion.button
                type="submit"
                className="bg-[#9AF241] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#baff63] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Solicitar Préstamo
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[#9AF241] mb-4">Detalles del Préstamo</h2>
            {loanDetails ? (
              <div className="space-y-4 text-[#CDE5DD]">
                <p><strong>Monto Original:</strong> Q{loanDetails.montoOriginal}</p>
                <p><strong>Monto Total con Comisión:</strong> Q{loanDetails.montoTotalConComision}</p>
                <p><strong>Cuota Mensual:</strong> Q{loanDetails.cuotaMensual}</p>
                <p><strong>Meses:</strong> {loanDetails.meses}</p>
                <p><strong>Pagos Realizados:</strong> {loanDetails.pagosRealizados}</p>
                <p><strong>Pagos Restantes:</strong> {loanDetails.pagosRestantes}</p>
              </div>
            ) : (
              <p className="text-[#CDE5DD]">Tu préstamo no ha sido aprobado aún.</p>
            )}

            {loanDetails && (
              <div>
                <h2 className="text-2xl font-bold text-[#9AF241] mt-6">Realizar Pago</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-1 font-medium text-[#9AF241]">Monto de Pago (Q) *</label>
                    <input
                      type="number"
                      name="montoPago"
                      value={paymentData.montoPago}
                      readOnly
                      className={`w-full px-4 py-2 bg-[#0f172a] text-white border rounded-lg focus:outline-none focus:ring-2 ${
                        paymentErrors.montoPago ? "border-red-500 focus:ring-red-500" : "border-[#9AF241] focus:ring-[#9AF241]"
                      }`}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="bg-[#9AF241] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#baff63] transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Realizar Pago
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  );
};