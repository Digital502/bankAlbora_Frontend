import { useState, useEffect  } from "react";
import { motion } from "framer-motion";
import { Globe, RefreshCw } from "lucide-react";
import { useConvertidor } from "../../shared/hooks/useConvertDivisas";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import { toast } from "react-hot-toast";
import { monedas } from './Monedas'

export const ConvertDivisas = ({ cuentas = [], onConversionSuccess }) => {
  const [monedaDestino, setMonedaDestino] = useState("GTQ");
  const { convert, isLoading } = useConvertidor();
  const [resultados, setResultados] = useState({});
  const [conversionRealizada, setConversionRealizada] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const monedaInicial = monedas.find(m => m.code === monedaDestino);
    if (monedaInicial) {
      setSearchTerm(monedaInicial.nombre);
    }
  }, [monedaDestino]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim() !== '');
    setConversionRealizada(false);

    if (value.trim() === '') {
      setMonedaDestino("GTQ");
    }
  };

  const handleSuggestionClick = (currencyCode) => {
    const selectedCurrency = monedas.find(m => m.code === currencyCode);
    if (selectedCurrency) {
      setSearchTerm(selectedCurrency.nombre);
      setMonedaDestino(currencyCode);
      setShowSuggestions(false);
      setConversionRealizada(false);
    }
  };

  const handleConvertirTodas = async () => {
    if (cuentas.length === 0) {
      toast.error("No hay cuentas para convertir");
      return;
    }

    try {
      setConversionRealizada(false);
      const conversiones = await Promise.all(
        cuentas.map(async (cuenta) => {
          if (cuenta.saldoCuenta > 0) {
            const resultado = await convert({
              from: "GTQ",
              to: monedaDestino,
              amount: cuenta.saldoCuenta,
            });
            return {
              numeroCuenta: cuenta.numeroCuenta,
              resultado: {
                ...resultado,
                currencySymbol: monedas.find(m => m.code === monedaDestino)?.symbol || "",
                convertedIncome: cuenta.ingresosMensuales 
                  ? await convert({
                      from: "GTQ",
                      to: monedaDestino,
                      amount: cuenta.ingresosMensuales
                    }).then(res => res.convertedAmount)
                  : null
              }
            };
          }
          return null;
        })
      );

      const nuevosResultados = {};
      conversiones.forEach(conv => {
        if (conv) {
          nuevosResultados[conv.numeroCuenta] = conv.resultado;
        }
      });

      setResultados(nuevosResultados);
      setConversionRealizada(true);
      
      if (typeof onConversionSuccess === 'function') {
        onConversionSuccess(nuevosResultados);
      }

      toast.success("Conversiones completadas");
    } catch (error) {
      toast.error("Error al convertir algunas cuentas");
      console.error(error);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto bg-[#1e293b]/80 rounded-2xl p-6 shadow-lg flex flex-col gap-4 mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe size={28} className="text-[#9AF241]" />
          <p className="font-semibold text-lg text-white">Convertir Saldo a:</p>
        </div>
        <div className="relative w-full sm:w-64"> 
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Buscar moneda..."
            className="bg-[#1e293b] border border-gray-600 rounded-md px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
          />
          {showSuggestions && (
            <ul className="absolute z-50 w-full bg-[#1e293b] border border-[#9AF241] mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
              {monedas
                .filter(m => 
                  m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.code.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(moneda => (
                  <li
                    key={moneda.code}
                    onMouseDown={() => handleSuggestionClick(moneda.code)} 
                    className="px-4 py-2 hover:bg-[#334155] cursor-pointer text-white text-sm flex items-center gap-2"
                  >
                    <span className="font-bold">{moneda.code}</span>
                    <span>{moneda.nombre}</span>
                    <span className="ml-auto">{moneda.symbol}</span>
                  </li>
                ))}
              {monedas.filter(m => 
                m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.code.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <li className="px-4 py-2 text-gray-400 text-sm">No se encontraron coincidencias</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="text-center mt-2">
        <button
          onClick={handleConvertirTodas}
          disabled={isLoading || cuentas.length === 0}
          className="bg-[#9AF241] hover:bg-[#84dd35] text-[#1e293b] font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={18} />
              Convirtiendo...
            </span>
          ) : "Convertir Saldo"}
        </button>
      </div>

      <div className="text-center mt-4 min-h-8">
        {isLoading ? (
          <div className="flex justify-center items-center gap-2 text-white">
            <LoadingSpinner />
            Procesando conversiones...
          </div>
        ) : conversionRealizada ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold text-[#9AF241] mb-2"
          >
            Conversión realizada a {monedas.find(m => m.code === monedaDestino)?.nombre}
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};