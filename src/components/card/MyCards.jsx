import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CreditCard } from "lucide-react";
import { useMyCards } from "../../shared/hooks/useMyCard";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { NavbarDashboardUser } from "../navs/NavbarDashboardUser";
import { Footer } from "../footer/Footer";
import { Link, useNavigate } from "react-router-dom";

export const MyCards = () => {
  const { cards, loading } = useMyCards();
  const [showCardMap, setShowCardMap] = useState({});
  const navigate = useNavigate();

  const toggleCardNumber = (id) => {
    setShowCardMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <NavbarDashboardUser />
      <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] py-16 px-10">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-3">
            <CreditCard size={36} className="text-[#9AF241]" />
            <h1 className="text-4xl font-bold text-[#9AF241]">Mis Tarjetas</h1>
          </div>
          <p className="text-gray-300 mt-2 max-w-xl">
            Aquí puedes consultar la información de tus tarjetas activas.
          </p>
        </div>

        {!cards || cards.length === 0 ? (
          <div className="text-center text-white">
            <div className="flex justify-center mt-12">
              <div className="bg-[#334155] border border-[#9AF241] text-[#9AF241] p-5 rounded-lg flex items-start max-w-3xl w-full">
                <div className="text-left w-full">
                  <p className="font-semibold text-lg mb-1 text-center">
                    ¿No Tienes Tarjetas?
                  </p>
                  <br />
                  <p className="text-sm mb-4 text-center">
                    Solicita una nueva tarjeta fácilmente haciendo clic en el
                    siguiente botón.
                  </p>
                  <br />
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate("/emitir-tarjeta")}
                      className="px-6 py-2 bg-[#9AF241] text-[#0f172a] font-semibold rounded-md hover:bg-cyan-700 transition"
                    >
                      Solicitar nueva tarjeta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
          <div className="relative z-10 grid gap-6 max-w-6xl mx-auto sm:grid-cols-1 md:grid-cols-2">
            {cards.map((card, index) => {
              const isDebito =
                card.tipo.toLowerCase() === "débito" ||
                card.tipo.toLowerCase() === "debito";

              return (
                <motion.div
                  key={card._id}
                  className={`relative rounded-xl text-white p-6 w-full h-60 overflow-hidden shadow-xl ${
                    isDebito ? "bg-green-800" : "bg-[#002c5f]"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    backgroundImage: isDebito
                      ? "linear-gradient(135deg, #14532d 60%, #166534)"
                      : "linear-gradient(135deg, #002c5f 60%, #023e8a)",
                  }}
                >
                  <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-0 opacity-30">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 500 300"
                      preserveAspectRatio="none"
                    >
                      {isDebito ? (
                        <>
                          <path
                            d="M0,150 C150,0 350,300 500,150"
                            stroke="#22c55e"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path
                            d="M0,250 C100,100 400,100 500,250"
                            stroke="#a7f3d0"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </>
                      ) : (
                        <>
                          <path
                            d="M0,100 C100,200 400,0 500,100"
                            stroke="#00b4d8"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <path
                            d="M0,200 C150,50 350,350 500,200"
                            stroke="#ffd60a"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </>
                      )}
                    </svg>
                  </div>

                  <div className="relative z-10 flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg font-bold leading-4">BA</h2>
                      <p className="text-xs">
                        {isDebito ? "Banco Regional" : "ALBORA BANK"}
                      </p>
                    </div>
                    <div className="text-right">
                      <svg width="24" height="24" fill="#fff">
                        <path
                          d="M4 12a8 8 0 0116 0"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-8 rounded-sm ${
                        isDebito ? "bg-lime-300" : "bg-gray-200"
                      }`}
                    />
                    <p className="text-sm capitalize">Tarjeta de {card.tipo}</p>
                  </div>

                  <p className="relative z-10 text-xl font-mono tracking-widest mb-3">
                    {showCardMap[card._id]
                      ? card.numeroTarjeta
                      : "•••• •••• •••• ••••"}
                  </p>

                  <div className="relative z-10 flex justify-between text-xs">
                    <div>
                      <p className="text-cyan-100">Expira</p>
                      <p>
                        {card.fechaExpiracion
                          ? new Date(card.fechaExpiracion).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-cyan-100">Últimos 4</p>
                      <p>{card.ultimosCuatro}</p>
                    </div>
                    <div>
                      <p className="text-cyan-100">Saldo</p>
                      <p>Q{card.saldoDisponible?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between items-end mt-5">
                    <p className="text-sm">{card.user.nombre}</p>
                    <p className="text-lg font-bold tracking-wide">
                      {isDebito ? "DEBITO" : "VISA"}{" "}
                      <span className="text-xs">
                        {isDebito ? "Express" : "Classic"}
                      </span>
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={() => toggleCardNumber(card._id)}
                      className="text-cyan-300 hover:text-white transition"
                      aria-label="Mostrar u ocultar número"
                    >
                      {showCardMap[card._id] ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center mt-12">
              <div className="bg-[#334155] border border-[#9AF241] text-[#9AF241] p-5 rounded-lg flex items-start max-w-3xl w-full">
                <div className="text-left w-full">
                  <p className="font-semibold text-lg mb-1 text-center">
                    ¿Necesitas otra tarjeta?
                  </p>
                  <br />
                  <p className="text-sm mb-4 text-center">
                    Solicita una nueva tarjeta fácilmente haciendo clic en el
                    siguiente botón.
                  </p>
                  <br />
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate("/emitir-tarjeta")}
                      className="px-6 py-2 bg-[#9AF241] text-[#0f172a] font-semibold rounded-md hover:bg-cyan-700 transition"
                    >
                      Solicitar nueva tarjeta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <Footer />
      </div>
    </>
  );
};
