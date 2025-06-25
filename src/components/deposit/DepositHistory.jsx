import { useState, useEffect } from 'react';
import { useDeposit } from '../../shared/hooks/useDeposit';
import { latestMovementsAccount, reverseDeposit } from '../../services/api';
import { Footer } from '../footer/Footer';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

export const DepositHistory = () => {
  const { accounts, isLoading: isLoadingAccounts, fetchAccounts } = useDeposit();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [movements, setMovements] = useState([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);
  const [reversingId, setReversingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    if (selectedAccount) {
      fetchMovements(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchMovements = async (accountNumber) => {
    setIsLoadingMovements(true);
    try {
      const response = await latestMovementsAccount(accountNumber);
      if (response.error) {
        throw new Error('Error al obtener movimientos');
      }
      setMovements(response.movimientos || []);
    } catch (error) {
      console.error('Error fetching movements:', error);
      toast.error(error.message || 'Error al cargar movimientos');
      setMovements([]);
    } finally {
      setIsLoadingMovements(false);
    }
  };

  const isWithinOneMinute = (fechaTransaccion) => {
    const ahora = new Date();
    const fechaTrans = new Date(fechaTransaccion);
    const diferenciaMs = ahora - fechaTrans;
    return diferenciaMs <= 60000;
  };

  const handleReverse = async (id) => {
    if (!id) {
      toast.error('No se pudo obtener el ID de la transacción');
      return;
    }

    setReversingId(id);
    try {
      const response = await reverseDeposit(id, {});
      if (response.error) {
        throw new Error(response.message || 'Error al revertir el depósito');
      }
      
      toast.success('Depósito revertido exitosamente');
      if (selectedAccount) {
        await fetchMovements(selectedAccount);
        await fetchAccounts();
      }
    } catch (error) {
      console.error('Error al revertir depósito:', error);
      toast.error(error.message || 'Error al revertir el depósito');
    } finally {
      setReversingId(null);
    }
  };

const handleInputChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  setSelectedAccount(''); 
  if (value.trim() === '') {
    setShowSuggestions(false);
  } else {
    setShowSuggestions(true);
  }

  const match = accounts.find(acc => acc.numeroCuenta === value.trim());
  if (match) {
    setSelectedAccount(match.numeroCuenta);
    setShowSuggestions(false);
  }
};

const handleSuggestionClick = (accountNumber) => {
  setSearchTerm(accountNumber);
  setSelectedAccount(accountNumber);
  setShowSuggestions(false);
};


  return (
    <div>
      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
            Movimientos de Cuenta
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#9AF241] mb-2">
              Seleccionar Cuenta
            </label>
<div className="mb-6 relative">
  <label className="block text-sm font-medium text-[#9AF241] mb-2">
    Buscar Cuenta por Número
  </label>
  <input
    type="text"
    value={searchTerm}
    onChange={handleInputChange}
    placeholder="Ingrese el número de cuenta"
    className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
    disabled={isLoadingAccounts}
  />
  {showSuggestions && (
    <ul className="absolute z-10 w-full bg-[#1e293b] border border-[#9AF241] mt-1 rounded-lg max-h-60 overflow-y-auto">
      {accounts
        .filter(acc =>
          acc.numeroCuenta.toLowerCase().includes(searchTerm.toLowerCase()) &&
          acc.numeroCuenta !== searchTerm
        )
        .map(acc => (
          <li
            key={acc.numeroCuenta}
            onClick={() => handleSuggestionClick(acc.numeroCuenta)}
            className="px-4 py-2 hover:bg-[#334155] cursor-pointer text-white text-sm"
          >
            {acc.numeroCuenta} - {acc.tipoCuenta} (Q{acc.saldoCuenta?.toFixed(2) || '0.00'})
          </li>
        ))}
      {accounts.filter(acc => acc.numeroCuenta.includes(searchTerm)).length === 0 && (
        <li className="px-4 py-2 text-gray-400 text-sm">No se encontraron coincidencias</li>
      )}
    </ul>
  )}
</div>

          </div>

          <div className="overflow-x-auto rounded-2xl shadow-inner">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Cuenta Origen</th>
                  <th className="px-4 py-2 text-left">Cuenta Destino</th>
                  <th className="px-4 py-2 text-left">Monto (Q)</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingMovements ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      <LoadingSpinner/>
                    </td>
                  </tr>
                ) : movements.length > 0 ? (
                  movements.map((movimiento) => (
                    <tr
                      key={movimiento.uid}
                      className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                    >
                      <td className="px-4 py-3 rounded-l-xl capitalize">{movimiento.tipo}</td>
                      <td className="px-4 py-3">{movimiento.cuentaOrigen}</td>
                      <td className="px-4 py-3">{movimiento.cuentaDestino || '-'}</td>
                      <td className="px-4 py-3">{movimiento.monto.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {new Date(movimiento.fecha).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 rounded-r-xl">
                        {movimiento.revertido ? (
                          <span className="text-red-400">Revertido</span>
                        ) : movimiento.tipo === 'deposito' && isWithinOneMinute(movimiento.fecha) ? (
                          <button
                            onClick={() => handleReverse(movimiento.uid)}
                            disabled={reversingId === movimiento.uid}
                            className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors ${
                              reversingId === movimiento.uid ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {reversingId === movimiento.uid ? 'Revertiendo...' : 'Revertir'}
                          </button>
                        ) : (
                          <span className="text-[#9AF241]">Completado</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-white/70">
                      {selectedAccount ? 'No se encontraron movimientos' : 'Seleccione una cuenta para ver movimientos'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
};