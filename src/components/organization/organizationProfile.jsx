import React from "react";
import { motion } from "framer-motion";
import { useMyOrganization } from "../../shared/hooks/useMyOrganization";
import { Footer } from "../../components/footer/Footer";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import {
  Building2,
  Mail,
  MapPin,
  Users,
  UserCheck,
  ShieldCheck
} from "lucide-react";

export const PerfilOrganizacion = () => {
  const { organization, loading, error } = useMyOrganization();

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-[#9AF241] mb-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Perfil de la Organización
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <motion.div
          className="bg-[#1e293b] w-full md:w-1/3 p-6 rounded-2xl shadow-lg text-center"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#0f172a] border-4 border-[#9AF241]">
            <Building2 size={64} className="text-[#9AF241]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{organization?.nombre}</h2>
          <p className="text-[#CDE5DD]"><ShieldCheck size={45} className="inline-block mr-2" /> </p>
        </motion.div>

        <motion.div
          className="bg-[#1e293b] w-full md:w-2/3 p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4 text-[#CDE5DD]">
            <p className="flex items-center gap-2"><Mail size={18} /> <strong>Correo:</strong> {organization?.correo}</p>
            <p className="flex items-center gap-2"><MapPin size={18} /> <strong>Dirección:</strong> {organization?.direccion}</p>
            <p className="flex items-center gap-2"><UserCheck size={18} /> <strong>NIT:</strong> {organization?.nit}</p>
            <p className="flex items-center gap-2"><Users size={18} /> <strong>Representante:</strong> {organization?.representante[0]?.nombre}</p>
            <p className="flex items-center gap-2"><Mail size={18} /> <strong>Correo Representante:</strong> {organization?.representante[0]?.correo}</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};
