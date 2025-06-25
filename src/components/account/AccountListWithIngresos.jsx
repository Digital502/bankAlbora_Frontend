import { useState } from "react";
import { useMyAccountsAndIngresos } from "../../shared/hooks/useMyIngresos";
import { Footer } from "../../components/footer/Footer";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

export const AccountListWithIngresos = () => {
  const { accounts, ingresos, loading, error } = useMyAccountsAndIngresos();
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [filters, setFilters] = useState({
    tipo: "",
    desde: "",
    hasta: "",
    montoMin: "",
    montoMax: "",
  });

  if (loading) return <LoadingSpinner/>
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!accounts.length) return <p className="text-white">No tienes cuentas registradas.</p>;

  const filtrarIngresos = (lista) => {
    return lista.filter((mov) => {
      const fecha = new Date(mov.fecha);
      const desde = filters.desde ? new Date(filters.desde) : null;
      const hasta = filters.hasta ? new Date(filters.hasta) : null;
      const montoMin = filters.montoMin ? parseFloat(filters.montoMin) : null;
      const montoMax = filters.montoMax ? parseFloat(filters.montoMax) : null;

      return (
        (!filters.tipo || mov.tipo === filters.tipo) &&
        (!desde || fecha >= desde) &&
        (!hasta || fecha <= hasta) &&
        (!montoMin || mov.monto >= montoMin) &&
        (!montoMax || mov.monto <= montoMax)
      );
    });
  };

  const limpiarFiltros = () => {
    setFilters({
      tipo: "",
      desde: "",
      hasta: "",
      montoMin: "",
      montoMax: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="bg-[#1e293b] rounded-2xl p-6 shadow-xl text-white max-w-5xl mx-auto mt-8 mb-10">
          <h2 className="flex items-center justify-center text-2xl font-semibold text-[#9AF241] mb-4 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#9AF241]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a4 4 0 00-8 0v2M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
            </svg>
            Tus Cuentas
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {accounts.map((cuenta) => {
              const isSelected = selectedCuenta === cuenta.numeroCuenta;
              return (
                <li key={cuenta.uid}>
                  <button
                    onClick={() => setSelectedCuenta(cuenta.numeroCuenta)}
                    className={`w-full text-left p-4 rounded-xl shadow transition duration-200 ${
                      isSelected
                        ? "bg-[#334155] border border-[#9AF241]"
                        : "bg-[#334155] hover:bg-[#475569] text-white"
                    }`}
                  >
                    <p className="text-white font-medium">{cuenta.tipoCuenta}</p>
                    <p className="text-white text-sm">N° {cuenta.numeroCuenta}</p>
                    <p className="text-[#9AF241] font-semibold">Q{cuenta.saldoCuenta}</p>
                  </button>
                </li>
              );
            })}
          </ul>

          {selectedCuenta && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-[#9AF241] mb-4">
                Ingresos de la cuenta: {selectedCuenta}
              </h3>

              <div className="mb-6">
                <button
                  onClick={() => setMostrarFiltros((prev) => !prev)}
                  className="bg-[#9AF241] text-black font-bold rounded p-2 transition transform hover:scale-105 shadow"
                >
                  {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
                </button>
              </div>

              {mostrarFiltros && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <select
                    value={filters.tipo}
                    onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                    className="bg-[#334155] text-white p-2 rounded"
                  >
                    <option value="">Todos</option>
                    <option value="deposito">Depósito</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="credito">Crédito</option>
                  </select>

                  <input
                    type="date"
                    value={filters.desde}
                    onChange={(e) => setFilters({ ...filters, desde: e.target.value })}
                    className="bg-[#334155] text-white p-2 rounded"
                  />

                  <input
                    type="date"
                    value={filters.hasta}
                    onChange={(e) => setFilters({ ...filters, hasta: e.target.value })}
                    className="bg-[#334155] text-white p-2 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Monto mínimo"
                    value={filters.montoMin}
                    onChange={(e) => setFilters({ ...filters, montoMin: e.target.value })}
                    className="bg-[#334155] text-white p-2 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Monto máximo"
                    value={filters.montoMax}
                    onChange={(e) => setFilters({ ...filters, montoMax: e.target.value })}
                    className="bg-[#334155] text-white p-2 rounded"
                  />

                  <button
                    onClick={limpiarFiltros}
                    className="bg-[#9AF241] text-black font-bold rounded p-2 transition transform hover:scale-105 shadow"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {filtrarIngresos(ingresos[selectedCuenta] || []).length > 0 ? (
                <ul className="divide-y divide-[#334155]">
                  {filtrarIngresos(ingresos[selectedCuenta]).map((mov) => (
                    <li key={mov.uid} className="bg-[#0f172a] rounded-lg p-4 border border-[#334155] mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium capitalize">{mov.tipo}</p>
                          <p className="text-sm text-[#94a3b8]">
                            {new Date(mov.fecha).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-green-400 font-bold text-lg">
                          +Q{mov.monto.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#cbd5e1]">No hay movimientos de ingreso con esos filtros.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
