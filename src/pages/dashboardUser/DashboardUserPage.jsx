import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { latestMovementsAccount, getAccountById  } from "../../services/api";
import {
  ArrowUpRight,
  Banknote,
  Star,
  HandCoins,
  CreditCard,
  PiggyBank,
  Home,
  Shield ,
  Globe,
  Inbox,
  ChevronLeft, ChevronRight, Wrench
} from "lucide-react";
import { Footer } from "../../components/footer/Footer";
import { NavbarDashboardUser } from "../../components/navs/NavbarDashboardUser";
import { MyAccounts } from "../../components/myAccount/MyAccounts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ConvertDivisas } from "../../components/convertDivisas/ConvertDivisas";
import { ListOrganization } from "../../components/product/ListOrganization"; 


const getUserIdFromToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    return parsed.uid;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};


export const DashboardUserPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [currency, setCurrency] = useState("GTQ");
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentMovements, setRecentMovements] = useState([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const token = user?.token;

  const handleActionClick = (index) => {
    switch (index) {
      case 0:
        navigate("/user/deposit");
        break;
      case 1:
        navigate("/favoriteAccounts");
        break;
      case 2:
        navigate("/user/history");
        break;
      case 3:
        navigate("/prestamos");
        break;
      case 4:
        navigate("/misTarjetas")
        break;
      case 5:
        navigate("/misServicios")
        break;
      default:
        break;
    }
  };

  const fetchUserAccounts = async () => {
    const userId = getUserIdFromToken(token);
    if (!userId) {
      toast.error("No se encontró el ID del usuario");
      return;
    }

    setIsLoadingAccounts(true);
    try {
      const data = await getAccountById(userId);
      
      if (!data || data.error || !Array.isArray(data.account)) {
        throw new Error("Error al obtener las cuentas o lista vacía");
      }

      const formattedAccounts = data.account.map(account => ({
        numeroCuenta: account.numeroCuenta,
        tipoCuenta: account.tipoCuenta,
        saldoCuenta: account.saldoCuenta
      }));

      setAccounts(formattedAccounts);
      if (formattedAccounts.length > 0) {
        setSelectedAccount(formattedAccounts[0].numeroCuenta);
      }
    } catch (err) {
      console.error("Error al obtener cuentas:", err);
      toast.error(err.message || "Error al cargar cuentas");
      setAccounts([]);
    } finally {
      setIsLoadingAccounts(false);
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


  const fetchAccountMovements = async (accountNumber) => {
    if (!accountNumber) return;
    
    setIsLoadingMovements(true);
    try {
      const response = await latestMovementsAccount(accountNumber);
      if (response.error) {
        throw new Error(response.message || "Error al obtener movimientos");
      }
      setRecentMovements(response.movimientos || []);
    } catch (error) {
      console.error("Error obteniendo movimientos:", error);
      toast.error(error.message || "Error al cargar movimientos");
      setRecentMovements([]);
    } finally {
      setIsLoadingMovements(false);
    }
  };

  useEffect(() => {
    fetchUserAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountMovements(selectedAccount);
    }
  }, [selectedAccount]);

  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };


const servicios = [
  {
    id: 3,
    icon: <HandCoins size={28} />,
    title: "Préstamos para ti",
    description: "Solicita préstamos personales rápidos y seguros con tasas accesibles.",
    color: "#10b981", 
  },
  {
    id: 4,
    icon: <CreditCard size={28} />, 
    title: "Tarjetas de Débito",
    description: "Controla tus gastos diarios con tarjetas seguras y sin comisiones.",
    color: "#3b82f6",
    onClick: () => navigate("/emitir-tarjeta")
  },
  {
    id: 6,
    icon: <PiggyBank size={28} />, 
    title: "Cuentas de Inversión",
    description: "Haz crecer tu dinero con opciones de inversión confiables y rentables.",
    color: "#8b5cf6", 
    onClick: () => navigate("/servicios/inversiones")
  },
  {
    id: 7,
    icon: <Home size={28} />, 
    title: "Pago de servicios de hogar",
    description: "Gestiona tus servicios como luz, agua e internet desde un solo lugar.",
    color: "#f472b6", 
  },
  {
    id: 11,
    icon: <Shield  size={28} />, 
    title: "Seguros de Salud",
    description: "Protege a tu familia con planes de salud adaptados a tus necesidades.",
    color: "#ef4444", 
  },
];

const serviciosPorVista = 2; 

const extendServicios = (arr) => [
  ...arr.slice(-serviciosPorVista), 
  ...arr,
  ...arr.slice(0, serviciosPorVista), 
];

const serviciosExtendidos = extendServicios(servicios);

const [currentIndex, setCurrentIndex] = useState(serviciosPorVista); 
const [isTransitioning, setIsTransitioning] = useState(false);

const handleNext = () => {
  if (isTransitioning) return;
  setIsTransitioning(true);
  setCurrentIndex((prev) => prev + 1);
};

const handlePrev = () => {
  if (isTransitioning) return;
  setIsTransitioning(true);
  setCurrentIndex((prev) => prev - 1);
};

const onTransitionEnd = () => {
  if (currentIndex >= servicios.length + serviciosPorVista) {
    setIsTransitioning(false);
    setCurrentIndex(serviciosPorVista);
  } else if (currentIndex <= serviciosPorVista - 1) {
    setIsTransitioning(false);
    setCurrentIndex(servicios.length + serviciosPorVista - 1);
  } else {
    setIsTransitioning(false);
  }
};

const [conversionData, setConversionData] = useState({});

const handleConversionSuccess = (resultados) => {
  setConversionData(resultados); 
  setAccounts(prevAccounts => 
    prevAccounts.map(account => 
      resultados[account.numeroCuenta] 
        ? { 
            ...account, 
            saldoCuenta: resultados[account.numeroCuenta].conversionAmount 
          } 
        : account
    )
  );
};

  return (
    <div>
      <NavbarDashboardUser />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-10">
        <br />
        <br />
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-[#9AF241] text-center mb-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Bienvenido de vuelta, {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
        </motion.h1>

        <motion.p
          className="text-center text-[#CDE5DD] mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Tu banca personalizada y segura, con total control.
        </motion.p>
        <motion.div>
          <ConvertDivisas 
  cuentas={accounts} 
  onConversionSuccess={handleConversionSuccess} 
/>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {[
            { icon: <ArrowUpRight size={24} />, title: "Transferir", color: "#9AF241" },
            { icon: <Star size={24} />, title: "Favoritos", color: "#facc15"},
            { icon: <Banknote size={24} />, title: "Historial", color: "#60a5fa" },
            { icon: <HandCoins size={24} />, title: "Solicitar Préstamo", color: "#f472b6" },
          ].map((action, index) => (
            <motion.div
              key={index}
              onClick={() => handleActionClick(index)}
              className="bg-[#1e293b] p-5 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-4 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
            >
              <div className="p-3 rounded-full" style={{ backgroundColor: action.color + "20", color: action.color }}>
                {action.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{action.title}</h3>
                <p className="text-sm text-[#CDE5DD]">Acción rápida</p>
              </div>
            </motion.div>
          ))}
        </div>
        <MyAccounts 
          account={accounts} 
          loading={isLoadingAccounts}
          conversionData={conversionData}
        />
        <br />
        <br />
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
        <motion.div
          className="bg-[#1e293b]/80 rounded-2xl p-6 shadow-lg flex items-center gap-4 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{
            scale: 1.05,
            zIndex: 10,
          }}
          onClick={() => navigate('/user/received')}
        >
          <Inbox size={36} className="text-[#9AF241]" />
          <div>
            <h2 className="text-xl font-semibold text-[#9AF241]">Recibidos</h2>
            <p className="text-[#CDE5DD] mt-1 text-sm">Aquí verás los pagos o transferencias que has recibido.</p>
          </div>
        </motion.div>

        {/* Tus Servicios */}
        <motion.div
          className="bg-[#1e293b]/80 rounded-2xl p-6 shadow-lg flex items-center gap-4 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{
            scale: 1.05,
            zIndex: 10,
          }}
          onClick={() => navigate('/user/servicios')}
        >
          <Wrench size={36} className="text-[#60A5FA]" />
          <div>
            <h2 className="text-xl font-semibold text-[#60A5FA]">Tus Servicios</h2>
            <p className="text-[#D1D5DB] mt-1 text-sm">Gestiona los servicios que tienes contratados.</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#1e293b]/80 rounded-2xl p-6 shadow-lg flex items-center gap-4 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{
            scale: 1.05,
            zIndex: 10,
          }}
          onClick={() => navigate('/myCards')}
        >
          <CreditCard size={36} className="text-[#FBBF24]" />
          <div>
            <h2 className="text-xl font-semibold text-[#FBBF24]">Tus Tarjetas</h2>
            <p className="text-[#FDE68A] mt-1 text-sm">Consulta y administra tus tarjetas registradas.</p>
          </div>
        </motion.div>
      </div>
        {/* PRODUCTOS PARA TI */}

        <motion.div>
          <ListOrganization/>
        </motion.div>

      <motion.div
          className="max-w-6xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <h2 className="text-2xl font-semibold text-[#9AF241] mb-8 text-center">Servicios para ti</h2>

          <div className="relative">
            {/* Botón Izquierda */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1e293b] bg-opacity-80 p-3 rounded-full shadow-lg z-10 hover:scale-110 transition"
            >
              <ChevronLeft className="text-white" size={24} />
            </button>

            {/* Slider */}
            <div className="overflow-hidden">
              <div
                className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
                style={{
                  transform: `translateX(-${currentIndex * (100 / serviciosPorVista)}%)`,
                  width: `${(serviciosExtendidos.length / serviciosPorVista) * 100}%`,
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {serviciosExtendidos.map(({ id, icon, title, description, color, onClick }, index) => (
                  <div
                    key={`${id}-${index}`}
                    className="w-1/2 px-2 flex-shrink-0"
                    onClick={onClick}
                  >
                    <div className="bg-[#1e293b]/80 rounded-xl mx-17 p-6 w-250 shadow-lg backdrop-blur-md transition-transform transform h-full">
                      <div
                        className="w-14 h-14 flex items-center justify-center rounded-full mb-3"
                        style={{ backgroundColor: `${color}30`, color }}
                      >
                        {icon}
                      </div>
                      <h3 className="text-base font-semibold mb-1 text-white">{title}</h3>
                      <p className="text-sm text-[#CDE5DD]">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón Derecha */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1e293b] bg-opacity-80 p-3 rounded-full shadow-lg z-10 hover:scale-110 transition"
            >
              <ChevronRight className="text-white" size={24} />
            </button>
          </div>
        </motion.div>

        {/* Selector de cuentas - AÑADIDO */}
      <motion.div
        className="max-w-6xl mx-auto mb-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <label className="block text-sm font-medium text-[#9AF241] mb-2">
          Seleccionar Cuenta
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Buscar cuenta por número"
            className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            disabled={isLoadingAccounts}
          />
          {showSuggestions && (
            <ul className="absolute z-10 w-full bg-[#1e293b] border border-[#9AF241] mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
              {accounts
                .filter(acc =>
                  acc.numeroCuenta.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  acc.numeroCuenta !== searchTerm
                )
                .map(account => (
                  <li
                    key={account.numeroCuenta}
                    onClick={() => handleSuggestionClick(account.numeroCuenta)}
                    className="px-4 py-2 hover:bg-[#334155] cursor-pointer text-white text-sm"
                  >
                    {account.numeroCuenta} - {account.tipoCuenta} (Q{account.saldoCuenta?.toFixed(2) || '0.00'})
                  </li>
                ))}
              {accounts.filter(acc => acc.numeroCuenta.includes(searchTerm)).length === 0 && (
                <li className="px-4 py-2 text-gray-400 text-sm">No se encontraron coincidencias</li>
              )}
            </ul>
          )}
        </div>
        {selectedAccount && (
          <div className="mt-2 text-sm text-green-400">
            Cuenta seleccionada: {selectedAccount}
          </div>
        )}
      </motion.div>

        {/* Movimientos recientes - MODIFICADO */}
      <motion.div
        className="max-w-6xl mx-auto bg-[#1e293b]/80 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <h2 className="text-xl font-semibold text-[#9AF241] mb-4">
          Movimientos recientes {selectedAccount && `(Cuenta: ${selectedAccount})`}
        </h2>
        {isLoadingMovements ? (
          <div className="text-center py-4 text-[#CDE5DD]">Cargando movimientos...</div>
        ) : recentMovements.length > 0 ? (
          <ul className="divide-y divide-[#334155]">
            {recentMovements.map((movement) => (
              <li key={movement.uid} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-white capitalize">{movement.tipo}</p>
                  <p className="text-sm text-[#94a3b8]">
                    {new Date(movement.fecha).toLocaleString()}
                  </p>
                </div>
                <div className={`text-lg font-bold ${
                  movement.tipo === "retiro" ? "text-red-400" : "text-green-400"
                }`}>
                  {movement.tipo === "retiro" ? "-" : "+"}Q{Math.abs(movement.monto).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-[#CDE5DD]">
            {selectedAccount ? 'No se encontraron movimientos' : 'Busque y seleccione una cuenta para ver movimientos'}
          </div>
        )}
      </motion.div>
        <Footer />
      </div>
    </div>
  );
};
