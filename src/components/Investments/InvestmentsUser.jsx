import { useState, useEffect } from "react";
import { useMyInvestments } from "../../shared/hooks/useMyInvestments";
import { validateMontoInversion, montoInversionMessage } from '../../shared/validators/investmentPolicyValidators';
import toast from "react-hot-toast";
import { NavbarDashboardUser } from "../../components/navs/NavbarDashboardUser";
import { Footer } from "../../components/footer/Footer";
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner'

export const InvestmentBase = () => {
  const {
    investments,
    policies,
    accounts,
    isLoading,
    isLoadingInvestments,
    isLoadingAccounts,
    fetchPolicies,
    fetchInvestments,
    fetchAccounts,
    registerInvestment,
    simulate,
    simulationResult,
    isSimulating,
  } = useMyInvestments();

  const [view, setView] = useState("investments");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [simulationData, setSimulationData] = useState({ monto: "", plazoMeses: "" });
  const [investmentData, setInvestmentData] = useState({ numeroCuenta: "", montoInvertido: "", plazoMeses: "" });
  const [searchTermCuenta, setSearchTermCuenta] = useState("");
  const [showSuggestionsCuenta, setShowSuggestionsCuenta] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  const estados = ["TODOS", "PENDIENTE", "APROBADA", "RECHAZADA", "ACTIVA", "VENCIDA", "CERRADA"];

  const inversionesFiltradas = estadoFiltro === "TODOS"
    ? investments
    : investments.filter((inv) => inv.estado === estadoFiltro);

  // Si no tiene inversiones
  if (!isLoadingInvestments && investments.length === 0 && view === "investments") {
    return (
      <div>
        <NavbarDashboardUser />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-[#9AF241] mb-6 drop-shadow-lg">
              ¿Aún no tienes inversiones?
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Comienza a construir tu futuro financiero de forma inteligente y segura. Explora nuestras políticas de inversión y simula tu primera inversión.
            </p>
            <button
              onClick={() => { fetchPolicies(); setView("policies"); }}
              className="bg-[#9AF241] text-[#0f172a] text-2xl font-semibold px-10 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              Empezar a invertir
            </button>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarDashboardUser />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-10">

        {view === "investments" && (
          <>
            <div className="min-h-screen text-white px-6 py-10 flex flex-col items-center">
              <div className="w-full max-w-5xl">
                <h2 className="text-4xl font-extrabold text-[#9AF241] mb-10 text-center drop-shadow-md">
                  Mis Inversiones
                </h2>

                <div className="mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <label htmlFor="estadoFiltro" className="text-lg font-semibold">
                    Filtrar por estado:
                  </label>
                  <select
                    id="estadoFiltro"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                  >
                    {estados.map((estado) => (
                      <option
                        key={estado}
                        value={estado}
                        className="text-white bg-[#1e293b] hover:bg-[#374151]"
                      >
                        {estado}
                      </option>
                    ))}
                  </select>
                  {/* Botón "Ver políticas de inversión" alineado con el filtro */}
                  <button
                    onClick={() => {
                      fetchPolicies();
                      setView("policies");
                    }}
                    className="bg-[#9AF241] text-[#0f172a] font-semibold text-lg px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
                  >
                    Ver políticas de inversión
                  </button>
                </div>

                {isLoadingInvestments ? (
                  <div className="flex justify-center items-center min-h-[250px]">
                    <LoadingSpinner />
                  </div>
                ) : inversionesFiltradas.length === 0 ? (
                  <p className="text-center text-gray-400 text-lg">
                    No tienes inversiones con ese estado.
                  </p>
                ) : (
                  <ul className="space-y-6">
                    {inversionesFiltradas.map((inv) => (
                      <li
                        key={inv.uid}
                        className="bg-[#1e293b] border border-[#9AF241] rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-transform duration-300"
                      >
                        <p className="text-xl font-semibold text-[#9AF241] mb-2">
                          Monto invertido:{" "}
                          <span className="text-white">${inv.montoInvertido.toLocaleString()}</span>
                        </p>
                        <p className="text-white mb-1">
                          Plazo: <span className="font-medium">{inv.plazoMeses} meses</span>
                        </p>
                        <p className="text-white">
                          Estado:{" "}
                          <span
                            className={`font-semibold ${inv.estado.toLowerCase() === "activo"
                                ? "text-green-400"
                                : inv.estado.toLowerCase() === "finalizado"
                                  ? "text-gray-400"
                                  : "text-yellow-400"
                              }`}
                          >
                            {inv.estado}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            </div>
          </>
        )}

        {view === "policies" && (
          <div>
            <div>
              <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-extrabold text-[#9AF241] text-center mb-10 drop-shadow-lg">
                  Políticas de Inversión
                </h1>

                {isLoading ? (
                  <div className="flex justify-center items-center min-h-[300px]">
                    <p className="text-xl text-gray-300">Cargando políticas...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {policies.map((policy) => (
                      <div key={policy.uid} className="bg-[#1e293b] rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                        <div>
                          <h2 className="text-3xl font-bold text-[#9AF241] mb-4">{policy.nombre}</h2>
                          <p className="text-gray-300 mb-6">{policy.descripcion}</p>
                        </div>
                        <div className="flex flex-col gap-4">
                          <button
                            onClick={() => { setSelectedPolicy(policy); setView("simulate"); }}
                            className="bg-[#9AF241] text-[#0f172a] font-semibold text-lg py-3 rounded-xl hover:scale-105 transition-all duration-300"
                          >
                            Simular inversión
                          </button>
                          <button
                            onClick={() => { setSelectedPolicy(policy); fetchAccounts(); setView("create"); }}
                            className="bg-white text-[#0f172a] font-semibold text-lg py-3 rounded-xl hover:scale-105 transition-all duration-300"
                          >
                            Crear inversión
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setView("investments")}
                    className="bg-gray-700 text-white px-8 py-3 rounded-xl text-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "simulate" && (
          <>
            <div className="min-h-screen text-white px-6 py-12 flex flex-col items-center justify-center">
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
                      Simular Inversión: {selectedPolicy.nombre}
                    </motion.h2>
                  </div>

                  {!simulationResult ? (
                    <>
                      <form className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#9AF241]">Monto</label>
                          <input
                            type="number"
                            value={simulationData.monto}
                            onChange={(e) =>
                              setSimulationData({
                                ...simulationData,
                                monto: e.target.value,
                              })
                            }
                            className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3"
                            placeholder={`Entre Q${selectedPolicy.minMonto} y Q${selectedPolicy.maxMonto}`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-[#9AF241]">Plazo (meses)</label>
                          <select
                            value={simulationData.plazoMeses}
                            onChange={(e) =>
                              setSimulationData({
                                ...simulationData,
                                plazoMeses: e.target.value,
                              })
                            }
                            className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3"
                          >
                            <option value="">Seleccione</option>
                            {selectedPolicy.plazosDisponibles.map((plazo) => (
                              <option key={plazo} value={plazo}>
                                {plazo} meses
                              </option>
                            ))}
                          </select>
                        </div>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (!validateMontoInversion(simulationData.monto, selectedPolicy.minMonto, selectedPolicy.maxMonto)) {
                              toast.error(`El monto debe estar entre ${selectedPolicy.minMonto} y ${selectedPolicy.maxMonto}.`);
                              return;
                            }
                            simulate({
                              investmentPolicyId: selectedPolicy.uid,
                              monto: Number(simulationData.monto),
                              plazoMeses: Number(simulationData.plazoMeses),
                            });
                          }}
                          className="mt-6 py-3 px-6 rounded-xl font-medium w-full bg-gradient-to-r from-cyan-600 to-cyan-700"
                        >
                          Simular
                        </motion.button>
                      </form>

                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => setView("policies")}
                          className="bg-gray-700 text-white px-6 py-3 rounded-xl text-lg hover:bg-gray-600 transition-colors duration-300"
                        >
                          Volver
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold text-[#9AF241] mb-4">Resultado de la simulación</h3>
                      <p><strong>Monto Invertido:</strong> {simulationResult.monto}</p>
                      <p><strong>Plazo (meses):</strong> {simulationResult.plazoMeses}</p>
                      <p><strong>Tasa de Interés Anual:</strong> {simulationResult.tasaInteresAnual}</p>
                      <p><strong>Ganancia Mensual Estimada:</strong> {simulationResult.mensual}</p>
                      <p><strong>Total Estimado:</strong> {simulationResult.totalEstimado}</p>
                      <p><strong>Ganancia Anual Proyectada:</strong> {simulationResult.anualProyectada}</p>

                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => setView("policies")}
                          className="bg-gray-700 text-white px-6 py-3 rounded-xl text-lg hover:bg-gray-600 transition-colors duration-300"
                        >
                          Volver
                        </button>
                      </div>
                    </div>
                  )}

                  {isSimulating && <p className="text-xl text-gray-300 text-center mt-4">Simulando...</p>}
                </div>
              </motion.div>
            </div>
          </>
        )}


        {view === "create" && (
          <>
            <div className="min-h-screen text-white px-6 py-12 flex flex-col items-center justify-center">
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
                      Crear Inversión
                    </motion.h2>
                    <motion.p
                      className="text-lg text-gray-300"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Política: {selectedPolicy.nombre}
                    </motion.p>
                  </div>

                  {isLoadingAccounts ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                      <p className="text-xl text-gray-300">Cargando cuentas...</p>
                    </div>
                  ) : (
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#9AF241]">
                          Selecciona tu cuenta
                        </label>
                        <div className="space-y-2 relative">
                          <label className="block text-sm font-medium text-[#9AF241]">
                            Selecciona tu cuenta *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={searchTermCuenta}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSearchTermCuenta(value);

                                // Buscar coincidencia exacta con número de cuenta
                                const cuentaExacta = accounts.find(acc =>
                                  acc.numeroCuenta === value.trim() ||
                                  `${acc.numeroCuenta} - Saldo: Q${acc.saldoCuenta.toFixed(2)}` === value.trim()
                                );

                                if (cuentaExacta) {
                                  setInvestmentData({ ...investmentData, numeroCuenta: cuentaExacta.numeroCuenta });
                                  setShowSuggestionsCuenta(false);
                                } else {
                                  setShowSuggestionsCuenta(true);
                                }
                              }}
                              onFocus={() => setShowSuggestionsCuenta(true)}
                              onBlur={() => setTimeout(() => setShowSuggestionsCuenta(false), 200)}
                              placeholder="Buscar cuenta por número"
                              className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <input type="hidden" name="numeroCuenta" value={investmentData.numeroCuenta} />

                            {showSuggestionsCuenta && (
                              <ul className="absolute z-10 w-full bg-[#1e293b] border border-[#9AF241] mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                                {accounts
                                  .filter(acc =>
                                    acc.numeroCuenta.includes(searchTermCuenta) ||
                                    acc.saldoCuenta.toString().includes(searchTermCuenta)
                                  )
                                  .map(acc => (
                                    <li
                                      key={acc.uid}
                                      onClick={() => {
                                        setInvestmentData({ ...investmentData, numeroCuenta: acc.numeroCuenta });
                                        setSearchTermCuenta(`${acc.numeroCuenta} - Saldo: Q${acc.saldoCuenta.toFixed(2)}`);
                                        setShowSuggestionsCuenta(false);
                                      }}
                                      className="px-4 py-2 hover:bg-[#334155] cursor-pointer text-white text-sm"
                                    >
                                      {acc.numeroCuenta} - Saldo: Q{acc.saldoCuenta.toFixed(2)}
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#9AF241]">
                          Monto a invertir (Q)
                        </label>
                        <input
                          type="number"
                          value={investmentData.montoInvertido}
                          onChange={(e) =>
                            setInvestmentData({
                              ...investmentData,
                              montoInvertido: e.target.value,
                            })
                          }
                          className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3"
                          placeholder={`Entre Q${selectedPolicy.minMonto} y Q${selectedPolicy.maxMonto}`}
                        />
                        <p className="text-xs text-gray-400">
                          Mínimo: Q{selectedPolicy.minMonto} - Máximo: Q{selectedPolicy.maxMonto}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#9AF241]">
                          Plazo (meses)
                        </label>
                        <select
                          value={investmentData.plazoMeses}
                          onChange={(e) =>
                            setInvestmentData({
                              ...investmentData,
                              plazoMeses: e.target.value,
                            })
                          }
                          className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3"
                        >
                          <option value="">Seleccione</option>
                          {selectedPolicy.plazosDisponibles.map((plazo) => (
                            <option key={plazo} value={plazo}>
                              {plazo} meses
                            </option>
                          ))}
                        </select>
                      </div>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (!validateMontoInversion(investmentData.montoInvertido, selectedPolicy.minMonto, selectedPolicy.maxMonto)) {
                            toast.error(`El monto debe estar entre ${selectedPolicy.minMonto} y ${selectedPolicy.maxMonto}.`);
                            return;
                          }
                          registerInvestment({
                            investmentPolicyId: selectedPolicy.uid,
                            numeroCuenta: investmentData.numeroCuenta,
                            montoInvertido: Number(investmentData.montoInvertido),
                            plazoMeses: Number(investmentData.plazoMeses),
                          });
                          setView("investments");
                        }}
                        className="mt-6 py-3 px-6 rounded-xl font-medium w-full bg-gradient-to-r from-cyan-600 to-cyan-700"
                      >
                        Confirmar inversión
                      </motion.button>
                    </form>
                  )}

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setView("policies")}
                      className="bg-gray-700 text-white px-6 py-3 rounded-xl text-lg hover:bg-gray-600 transition-colors duration-300"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
        <Footer />
      </div>
    </div>
  );
};
