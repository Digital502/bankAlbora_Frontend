import { useState } from "react";
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
        <select
          value={monedaDestino}
          onChange={(e) => {
            setMonedaDestino(e.target.value);
            setConversionRealizada(false);
          }}
          className="bg-[#1e293b] border border-gray-600 rounded-md px-2 py-2 text-white cursor-pointer w-full sm:w-auto max-w-full"
        >
          {monedas.map((moneda) => (
            <option key={moneda.code} value={moneda.code}>
              {moneda.nombre}
            </option>
          ))}
        </select>
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