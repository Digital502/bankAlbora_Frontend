import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, Banknote, Home, HeartPulse, ShieldCheck, Zap } from "lucide-react";
import { NavbarDashboardAdmin } from "../../components/navs/NavbarDashboardAdmin";
import { Footer } from "../../components/footer/Footer";

export const ServiceAdminPage = () => {
  const navigate = useNavigate();

  const servicios = [
    {
      titulo: "Tarjetas de Débito y Crédito",
      descripcion: "Administra las solicitudes y operaciones con las tarjetas de débito y crédito.",
      icono: <CreditCard size={32} />,
      ruta: "/tarjetas-management",
    },
    {
      titulo: "Cuentas de Inversión",
      descripcion: "Visualiza y administra las cuentas de inversión.",
      icono: <Banknote size={32} />,
      ruta: "/servicios/cuentas-de-inversion",
    },
    {
      titulo: "Seguros",
      descripcion: "Consulta y administra las solicitudes de seguros.",
      icono: <HeartPulse size={32} />,
      ruta: "/insurance-administrator",
    }
  ];

  return (
    <div>
      <NavbarDashboardAdmin />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-[#9AF241] mb-10"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Administración de Servicios
        </motion.h1>

        <motion.p
          className="text-center text-lg text-[#E2F9D9] mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Desde esta sección puedes administrar cada uno de los servicios financieros y de seguros que ofrece el banco Albora.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {servicios.map((servicio, index) => (
            <motion.div
              key={index}
              className="bg-[#1e293b] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(servicio.ruta)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
            >
              <div className="flex items-center gap-4 mb-4 text-[#9AF241]">
                {servicio.icono}
                <h2 className="text-xl font-semibold">{servicio.titulo}</h2>
              </div>
              <p className="text-[#CDE5DD] mb-4">{servicio.descripcion}</p>
              <div className="text-right">
                <span className="bg-[#9AF241] text-[#0f172a] px-4 py-2 rounded-xl font-medium hover:bg-[#b6f880] transition duration-200">
                  Ver Solicitudes
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <Footer />
        </div>
      </div>
    </div>
  );
};
 