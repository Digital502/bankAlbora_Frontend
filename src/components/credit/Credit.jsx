import { useState, useEffect } from "react";
import { useCredit } from "../../shared/hooks/useCredit";
import { Footer } from "../footer/Footer";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

export const Credit = () => {
  const { loans, processLoan, fetchLoansByStatus, isLoading } = useCredit();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("en espera");

  useEffect(() => {
    fetchLoansByStatus(filterState);
  }, [filterState]);

  const handleLoanAction = async (cuentaDestino, estado) => {
    try {
      await processLoan({ cuentaDestino, estado });
      toast.success(`Préstamo ${estado === "aprobado" ? "aprobado" : "rechazado"} exitosamente.`);
      fetchLoansByStatus(filterState); 
    } catch (error) {
      console.error("Error al gestionar el préstamo:", error.message);
      toast.error("Hubo un problema al gestionar el préstamo.");
    }
  };

  const filteredLoans = loans
    .filter((loan) => {
      if (!loan.usuario) return false;
      return [loan.usuario.nombre, loan.usuario.apellido, loan.usuario.correo]
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .reduce((uniqueLoans, loan) => {
      const exists = uniqueLoans.some((item) => item.cuentaDestino === loan.cuentaDestino);
      return exists ? uniqueLoans : [...uniqueLoans, loan];
    }, []);

  return (
    <div>
      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
            Gestión de Préstamos
          </h2>
          <div className="flex flex-wrap justify-center gap-2 px-4 pb-4">
            {["en espera", "rechazados", "aprobados", "pagados"].map((state) => (
              <button
                key={state}
                className={`px-3 py-1.5 text-sm rounded-md font-semibold transition-all ${
                  filterState === state
                    ? "bg-[#9AF241] text-black"
                    : "bg-white/10 text-white hover:bg-[#9AF241] hover:text-black"
                }`}
                onClick={() => setFilterState(state)}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </button>
            ))}
          </div>
          <div className="mb-6 relative max-w-md mx-auto">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o correo..."
              className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-inner">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Apellido</th>
                  <th className="px-4 py-2 text-left">Correo</th>
                  <th className="px-4 py-2 text-left">Monto</th>
                  <th className="px-4 py-2 text-left">Cuenta</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <tr
                      key={loan.cuentaDestino}
                      className={`bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg ${
                        !loan.usuario ? "bg-red-900/50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 rounded-l-xl">
                        {loan.usuario?.nombre || `Usuario no encontrado (Cuenta: ${loan.cuentaDestino})`}
                      </td>
                      <td className="px-4 py-3">{loan.usuario?.apellido || "—"}</td>
                      <td className="px-4 py-3">{loan.usuario?.correo || "—"}</td>
                      <td className="px-4 py-3">Q{loan.monto.toFixed(2)}</td>
                      <td className="px-4 py-3">{loan.cuentaDestino}</td>
                      <td className="px-4 py-3">{loan.estado}</td>
                    <td className="px-4 py-3 text-center rounded-r-xl">
                      {filterState === "en espera" ? (
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleLoanAction(loan.cuentaDestino, "aprobado")}
                            className="bg-[#9AF241] text-gray-900 hover:bg-[#b9fc60] transition-all px-4 py-2 rounded-md font-semibold"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleLoanAction(loan.cuentaDestino, "rechazado")}
                            className="bg-red-600 text-white hover:bg-red-700 transition-all px-4 py-2 rounded-md font-semibold"
                          >
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="text-white/60 italic">No hay acciones</span>
                      )}
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-white/70">
                      No se encontraron préstamos con estado: <strong>{filterState}</strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};