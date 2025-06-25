import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wallet2, Search, Filter, Calendar } from "lucide-react";
import { NavbarDashboarOrganization } from "../navs/NavbarDashboardOrganization";
import { Footer } from "../footer/Footer";
import { useMyOrganizationAccount } from "../../shared/hooks/useAccountOrganization";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DepositOrganization = () => {
  const { depositos, loading } = useMyOrganizationAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("reciente");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const filteredAndSortedDepositos = useMemo(() => {
    const filtered = depositos.filter((dep) => {
      const matchesSearch =
        (dep.referencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dep.cuentaOrigen?.toLowerCase().includes(searchTerm.toLowerCase())));

      const depositDate = new Date(dep.fecha);
      const matchesDate = 
        (!startDate || depositDate >= startDate) && 
        (!endDate || depositDate <= endDate);

      return matchesSearch && matchesDate;
    });

    const sorted = [...filtered];
    switch (sortOption) {
      case "reciente":
        sorted.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        break;
      case "antiguo":
        sorted.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        break;
      case "mayor":
        sorted.sort((a, b) => b.monto - a.monto);
        break;
      case "menor":
        sorted.sort((a, b) => a.monto - b.monto);
        break;
      default:
        break;
    }

    return sorted;
  }, [depositos, searchTerm, sortOption, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortOption("reciente");
    setDateRange([null, null]);
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
      <NavbarDashboarOrganization />

      <main className="max-w-6xl mx-auto px-6 py-14">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wider drop-shadow-lg"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Depósitos Recibidos
        </motion.h1>

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Primera fila de filtros */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Búsqueda */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Buscar por cuenta de origen o referencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1e293b]/60 border border-[#9AF241]/30 rounded-xl px-5 py-3 text-white placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#9AF241] transition"
              />
              <Search className="absolute top-3 right-4 text-[#9AF241]" size={20} />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-[#9AF241]" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
              >
                <option value="reciente">Más recientes</option>
                <option value="antiguo">Más antiguos</option>
                <option value="mayor">Monto más alto</option>
                <option value="menor">Monto más bajo</option>
              </select>
            </div>
          </div>

          {/* Segunda fila de filtros */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Filtro por fecha */}
            <div className="flex items-center gap-2 w-full">
              <Calendar className="text-[#9AF241]" />
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText="Filtrar por rango de fechas"
                className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
              />
            </div>

            <button
              onClick={handleClearFilters}
              className="bg-[#9AF241]/20 hover:bg-[#9AF241]/30 text-[#9AF241] border border-[#9AF241] px-12 py-1 rounded-xl transition w-full md:w-auto"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <p className="text-center text-lg animate-pulse text-[#cbd5e1]">
            Cargando depósitos...
          </p>
        ) : filteredAndSortedDepositos.length === 0 ? (
          <p className="text-center text-[#94a3b8]">No se encontraron depósitos.</p>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredAndSortedDepositos.map((dep) => (
              <motion.div
                key={dep._id}
                className="bg-[#1e293b]/70 border border-[#9AF241]/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl hover:scale-[1.02] transition-transform hover:border-[#9AF241]/30"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold tracking-wide text-white">Depósito</h2>
                  <Wallet2 className="text-[#9AF241]" size={26} />
                </div>

                <p className="text-3xl font-extrabold text-[#9AF241] mb-3">
                  Q{dep.monto.toFixed(2)}
                </p>

                <div className="text-sm text-[#CDE5DD] space-y-1">
                  <p>
                    <span className="text-white font-medium">Fecha:</span>{" "}
                    {new Date(dep.fecha).toLocaleString()}
                  </p>
                  <p>
                    <span className="text-white font-medium">Tipo de Pago:</span>{" "}
                    {dep.tipo || "N/A"}
                  </p>
                  <p>
                    <span className="text-white font-medium">Cuenta origen:</span>{" "}
                    {dep.cuentaOrigen || "Desconocida"}
                  </p>
                  <p>
                    <span className="text-white font-medium">Referencia:</span>{" "}
                    {dep.referencia || "N/A"}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};