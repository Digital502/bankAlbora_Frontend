import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { useMyOrganizationAccount } from "../../shared/hooks/useAccountOrganization";
import { Footer } from "../footer/Footer";
import { NavbarDashboarOrganization } from "../navs/NavbarDashboardOrganization";

export const MyOrganizationAccount = () => {
  const { organizationAccount: account, loading } = useMyOrganizationAccount();
  const [showBalance, setShowBalance] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <p className="text-white text-xl animate-pulse">
          Cargando cuenta de la organización...
        </p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <p className="text-white text-xl">
          No se encontró la cuenta de la organización.
        </p>
      </div>
    );
  }

  return (
    <div>
    <NavbarDashboarOrganization/>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#9AF241] tracking-wide">
              Panel Financiero de la Organización
            </h1>
            <p className="text-[#CDE5DD] text-lg mt-2">
              Visualiza y gestiona la cuenta institucional con claridad y
              estilo.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* INFO PRINCIPAL */}
            <div className="bg-[#1e293b]/60 border border-[#9AF241]/20 p-8 rounded-3xl shadow-xl backdrop-blur-lg">
              <div className="flex items-center mb-6">
                <Building2 className="text-[#9AF241] mr-3" size={32} />
                <h2 className="text-2xl font-bold">Datos generales</h2>
              </div>
              <p className="text-sm text-[#CDE5DD] mb-2">
                <span className="font-semibold text-white">
                  Número de cuenta:
                </span>{" "}
                {account.numeroCuenta}
              </p>
              <p className="text-sm text-[#CDE5DD] mb-2">
                <span className="font-semibold text-white">
                  Tipo de cuenta:
                </span>{" "}
                {account.tipoCuenta}
              </p>
              <p className="text-sm text-[#CDE5DD]">
                <span className="font-semibold text-white">
                  Ingresos mensuales:
                </span>{" "}
                Q{account.ingresosMensuales?.toFixed(2) || "0.00"}
              </p>
            </div>

            {/* SALDO */}
            <div className="bg-[#1e293b]/60 border border-[#9AF241]/20 p-8 rounded-3xl shadow-xl backdrop-blur-lg flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#9AF241]">
                  Saldo disponible
                </h3>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:text-[#9AF241] transition"
                  aria-label="Mostrar/Ocultar saldo"
                >
                  {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
              <div>
                <p className="text-5xl font-extrabold text-white tracking-widest">
                  {showBalance
                    ? `Q${account.saldoCuenta.toFixed(2)}`
                    : "Q****.**"}
                </p>
                <p className="text-sm text-[#CDE5DD] mt-2">
                  Puedes ocultar el saldo para mayor privacidad.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer/>
      </div>
    </div>
  );
};
