import { useEffect, useState } from 'react';
import { useListCards } from '../../shared/hooks/useListCards';
import { useListCardsByEstado } from '../../shared/hooks/useListCardAdmin'; 
import { Footer } from '../footer/Footer';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { NavbarDashboardAdmin } from '../navs/NavbarDashboardAdmin';

export const CardManagement = () => {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [tipoFiltro, setTipoFiltro] = useState('DEBITO');
  const [busquedaCuenta, setBusquedaCuenta] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarConfirmacionActivar, setMostrarConfirmacionActivar] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  const {
    tarjetasDebito,
    tarjetasCredito,
    isLoading: isLoadingSolicitudes,
    fetchTarjetasDebito,
    fetchTarjetasCredito,
    handleAprobarTarjeta,
  } = useListCards();

  const {
    tarjetas: tarjetasPorEstado,
    estado,
    setEstado,
    isLoading: isLoadingGestion,
    handleDesactivarTarjeta
  } = useListCardsByEstado("ACTIVA");

  useEffect(() => {
    if (tipoFiltro === 'DEBITO') {
      fetchTarjetasDebito();
    } else {
      fetchTarjetasCredito();
    }
  }, [tipoFiltro]);

  const tarjetasMostradas = tipoFiltro === 'DEBITO' ? tarjetasDebito : tarjetasCredito;

  return (
    <>
      <NavbarDashboardAdmin />
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white p-6">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
            Administración de Tarjetas
          </h2>

          <div className="flex justify-center space-x-6 mb-6">
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'solicitudes'
                  ? 'bg-[#9AF241] text-[#0f172a]'
                  : 'bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]'
              }`}
              onClick={() => setActiveTab('solicitudes')}
            >
              Ver Solicitudes
            </button>
            <button
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'tarjetas'
                  ? 'bg-[#9AF241] text-[#0f172a]'
                  : 'bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]'
              }`}
              onClick={() => setActiveTab('tarjetas')}
            >
              Gestión de Tarjetas
            </button>
          </div>

          {activeTab === 'solicitudes' && (
            <div>
              <div className="flex justify-end mb-6">
                <div className="flex space-x-2 bg-[#1e293b] border border-[#9AF241] rounded-full p-1 shadow-inner transition-all duration-300">
                  <button
                    onClick={() => setTipoFiltro('DEBITO')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                      tipoFiltro === 'DEBITO'
                        ? 'bg-[#9AF241] text-[#0f172a] shadow-md'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                    </svg>
                    Débito
                  </button>
                  <button
                    onClick={() => setTipoFiltro('CREDITO')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                      tipoFiltro === 'CREDITO'
                        ? 'bg-[#9AF241] text-[#0f172a] shadow-md'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 9V7a4 4 0 00-8 0v2M5 12h14M12 16v4" />
                    </svg>
                    Crédito
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl shadow-inner">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                  <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left">No. de Cuenta</th>
                      <th className="px-4 py-2 text-left">No. de Tarjeta</th>
                      <th className="px-4 py-2 text-left">Límite de Crédito</th>
                      <th className="px-4 py-2 text-left">Saldo Actual</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingSolicitudes ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-400">
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : tarjetasMostradas.length > 0 ? (
                      tarjetasMostradas.map((card, index) => (
                        <tr
                          key={index}
                          className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                        >
                          <td className="px-4 py-3 rounded-l-xl">{card.numeroCuenta || '—'}</td>
                          <td className="px-4 py-3 capitalize">{card.numeroTarjeta || '_'}</td>
                          <td className="px-4 py-3">{card.limiteCredito || '—'}</td>
                          <td className="px-4 py-3">{card.saldoDisponible || '—'}</td>
                          <td className="px-4 py-3 rounded-r-xl">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleAprobarTarjeta(card.uid, 'APROBADA')}
                                className="bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] font-bold py-1 px-4 rounded-xl transition"
                              >
                                Aprobar
                              </button>
                              <button
                                onClick={() => handleAprobarTarjeta(card.uid, 'RECHAZADA')}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-xl transition"
                              >
                                Rechazar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-white/70">
                          No hay solicitudes pendientes de tarjetas {tipoFiltro}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'tarjetas' && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="relative w-full max-w-sm">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#38BDF8]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar por número de cuenta..."
                    value={busquedaCuenta}
                    onChange={(e) => setBusquedaCuenta(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#38BDF8] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {['ACTIVA', 'VENCIDAS', 'RECHAZADA', 'DESACTIVADA'].map((estadoOption) => (
                  <button
                    key={estadoOption}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      estado === estadoOption
                        ? 'bg-[#38BDF8] text-[#0f172a] shadow-md scale-105'
                        : 'bg-transparent border border-[#38BDF8] text-[#38BDF8] hover:bg-[#1e293b]'
                    }`}
                    onClick={() => setEstado(estadoOption)}
                  >
                    {estadoOption}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto rounded-2xl shadow-inner">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                  <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left">No. de Cuenta</th>
                      <th className="px-4 py-2 text-left">No. de Tarjeta</th>
                      <th className="px-4 py-2 text-left">Límite de Crédito</th>
                      <th className="px-4 py-2 text-left">Saldo Actual</th>
                      <th className="px-4 py-2 text-left">Deuda Actual</th>
                      <th className="px-4 py-2 text-left">Fecha de Expiración</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingGestion ? (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-gray-400">
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : tarjetasPorEstado.length > 0 ? (
                      tarjetasPorEstado.map((card, index) => (
                        <tr
                          key={index}
                          className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                        >
                          <td className="px-4 py-3 rounded-l-xl">{card.numeroCuenta || '—'}</td>
                          <td className="px-4 py-3 capitalize">{card.numeroTarjeta || '_'}</td>
                          <td className="px-4 py-3">{card.limiteCredito || '—'}</td>
                          <td className="px-4 py-3">{card.saldoDisponible || '—'}</td>
                          <td className="px-4 py-3">{card.deudaActual || '—'}</td>
                          <td className="px-4 py-3">
                            {card.fechaExpiracion
                              ? new Date(card.fechaExpiracion).toLocaleDateString()
                              : '—'}
                          </td>
                          <td className="px-4 py-3 rounded-r-xl">
                            <td className="px-4 py-3 rounded-r-xl">
                              <div className="flex gap-2 justify-center">
                                {estado === 'ACTIVA' && (
                                  <button
                                    onClick={() => {setTarjetaSeleccionada(card);
                                    setMostrarConfirmacion(true);}}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-xl transition"
                                  >
                                    Desactivar
                                  </button>
                                )}
                                {estado === 'DESACTIVADA' && (
                                  <button
                                    onClick={() => {setTarjetaSeleccionada(card);
                                    setMostrarConfirmacionActivar(true);}}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded-xl transition"
                                  >
                                    Activar
                                  </button>
                                )}
                              </div>
                            </td>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-white/70">
                          No hay tarjetas con estado "{estado}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {mostrarConfirmacion && tarjetaSeleccionada && (
                  <div className="fixed inset-0 bg-[#1e293b]/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative bg-[#1e293b] border border-[#9AF241] rounded-2xl p-8 shadow-2xl w-full max-w-md text-white overflow-hidden animate-fade-in mx-4">

                      <h2 className="text-2xl font-bold mb-4 text-[#9AF241]">
                        Desactivar Tarjeta
                      </h2>

                      <p className="mb-6 text-sm text-slate-300">
                        ¿Estás seguro de que deseas 
                        <span className="text-red-400 font-semibold"> desactivar </span>
                        esta tarjeta?
                      </p>

                      <p className="mb-6 text-xs text-gray-300 border border-[#45858c] p-3 rounded-lg bg-[#334155]">
                        Número de tarjeta: <strong className="text-white">{tarjetaSeleccionada.numeroTarjeta}</strong>
                      </p>

                      <div className="flex justify-end gap-4 mt-4">
                        <button
                          onClick={() => {
                            setMostrarConfirmacion(false);
                            setTarjetaSeleccionada(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 shadow-lg"
                        >
                          Cancelar
                        </button>

                        <button
                          onClick={async () => {
                            await handleDesactivarTarjeta(tarjetaSeleccionada.uid, false);
                            setMostrarConfirmacion(false);
                            setTarjetaSeleccionada(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#9AF241] hover:bg-[#0ea5e9] text-[#1e293b] font-semibold shadow-lg transition-all duration-300"
                        >
                          Desactivar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {mostrarConfirmacionActivar && tarjetaSeleccionada && (
                  <div className="fixed inset-0 bg-[#1e293b]/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] border border-[#9AF241] rounded-2xl p-8 shadow-2xl w-full max-w-md text-white overflow-hidden mx-4">

                      <h2 className="text-2xl font-bold mb-4 text-[#9AF241]">
                        Activar Tarjeta
                      </h2>

                      <p className="mb-6 text-sm text-slate-300">
                        ¿Estás seguro de que deseas 
                        <span className="text-green-400 font-semibold"> activar </span>
                        esta tarjeta?
                      </p>

                      <p className="mb-6 text-xs text-gray-300 border border-[#45858c] p-3 rounded-lg bg-[#334155]">
                        Número de tarjeta: <strong className="text-white">{tarjetaSeleccionada.numeroTarjeta}</strong>
                      </p>

                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => {
                            setMostrarConfirmacionActivar(false);
                            setTarjetaSeleccionada(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 shadow-lg"
                        >
                          Cancelar
                        </button>

                        <button
                          onClick={async () => {
                            await handleDesactivarTarjeta(tarjetaSeleccionada.uid, true);
                            setMostrarConfirmacionActivar(false);
                            setTarjetaSeleccionada(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0ea5e9] text-[#1e293b] font-semibold shadow-lg transition-all duration-300"
                        >
                          Activar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};
