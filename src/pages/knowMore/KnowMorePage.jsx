import {
  PiggyBank,
  CreditCard,
  Send,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
  Wallet,
  BarChart,
  ShieldCheck,
  PhoneCall,
  BookOpenCheck,
  BadgeDollarSign,
  Briefcase,
  HandCoins,
  UserPlus,
  LogIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Footer } from "../../components/footer/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const shootingStarColors = ["#145259", "#45858c"];
const particleColors = ["#145259", "#45858c"];

const shootingStarVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  visible: (custom) => ({
    opacity: [0, 1, 0],
    x: [0, 120 + custom * 60],
    y: [0, 40 * (custom % 2 === 0 ? 1 : -1), 0],
    transition: {
      duration: 1.5,
      delay: custom * 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

const particleVariants = {
  animate: {
    opacity: [0.3, 0.8, 0.3],
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.09,
    rotate: -2,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 3,
      duration: 0.1,
    },
  },
};

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-bold text-[#9AF241] mb-6 text-center">
    {children}
  </h2>
);

const InfoCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    className="bg-[#1e293b] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center text-center"
    variants={cardVariants}
    whileHover={{ scale: 0.4 }}
  >
    <Icon size={40} className="mb-4" style={{ color }} />
    <h3 className="text-xl font-semibold mb-2" style={{ color }}>
      {title}
    </h3>
    <p className="text-gray-200">{description}</p>
  </motion.div>
);

const servicioCards = [
  {
    icon: CreditCard,
    title: "Tarjetas de Débito y Crédito",
    description:
      "Compra con seguridad y gestiona tus gastos desde cualquier lugar.",
    color: "#2196F3",
  },
  {
    icon: BarChart,
    title: "Inversiones",
    description:
      "Diversifica tu dinero en políticas con rentabilidad proyectada y crea tus propias inversiones.",
    color: "#388E3C",
  },
  {
    icon: ShieldCheck,
    title: "Seguros",
    description:
      "Protege tu salud, vida y hogar con seguros accesibles y personalizados.",
    color: "#FF9800",
  },
  {
    icon: PhoneCall,
    title: "Atención al Cliente",
    description:
      "Estamos disponibles para ayudarte por teléfono, correo o en sucursales.",
    color: "#FFEB3B",
  },
  {
    icon: BookOpenCheck,
    title: "Educación Financiera",
    description:
      "Accede a simuladores y contenidos para aprender a manejar mejor tus finanzas.",
    color: "#9C27B0",
  },
];

const sections = [
  {
    icon: HandCoins,
    title: "Préstamos",
    description:
      "Solicita préstamos personales o comerciales al instante. Analizamos tu perfil y te damos una respuesta en minutos, sin papeleo excesivo.",
  },
  {
    icon: ShoppingCart,
    title: "Adquiere Productos Exclusivos",
    description:
      "Compra celulares, laptops, electrodomésticos y más con precios especiales. Financia tus compras desde tu cuenta.",
  },
  {
    icon: Briefcase,
    title: "Organizaciones y Empresas",
    description:
      "Registra tu entidad y abre cuentas corporativas con servicios financieros exclusivos para organizaciones.",
  },
];

const pasos = [
  {
    icon: UserPlus,
    text: "Crear cuentas monetarias, de ahorro o caja de ahorro en una sucursal.",
  },
  {
    icon: CreditCard,
    text: "Solicitar tus tarjetas y vincularlas a tu cuenta.",
  },
  {
    icon: LogIn,
    text: "Iniciar sesión en nuestra banca en línea desde cualquier dispositivo.",
  },
];

const beneficios = [
  "Plataforma segura y moderna para todos tus movimientos.",
  "Acceso a promociones, descuentos y productos financieros exclusivos.",
  "Asistencia personalizada y humana en todo momento.",
  "Participación en programas de fidelización y recompensas.",
  "Actualizaciones constantes con nuevas funcionalidades.",
];

const serviciosBancarios = [
  {
    id: 1,
    icon: <ArrowDownCircle size={28} />,
    title: "Depósitos",
    description:
      "Ingresa dinero fácilmente desde nuestras sucursales o por transferencia electrónica.",
    color: "#10b981",
  },
  {
    id: 2,
    icon: <ArrowUpCircle size={28} />,
    title: "Retiros",
    description:
      "Retira fondos cuando lo necesites, ya sea en ventanilla o en cajeros automáticos.",
    color: "#ef4444",
  },
  {
    id: 3,
    icon: <Send size={28} />,
    title: "Transferencias",
    description:
      "Envía dinero a otras cuentas en segundos, dentro o fuera del banco.",
    color: "#3b82f6",
  },
  {
    id: 4,
    icon: <ShoppingCart size={28} />,
    title: "Compras",
    description:
      "Utiliza tus tarjetas para pagar de forma segura en tiendas físicas o en línea.",
    color: "#f59e0b",
  },
  {
    id: 5,
    icon: <DollarSign size={28} />,
    title: "Créditos",
    description:
      "Solicita préstamos personales o comerciales y mejora tu liquidez rápidamente.",
    color: "#8b5cf6",
  },
  {
    id: 6,
    icon: <CreditCard size={28} />,
    title: "Pagos de Tarjeta",
    description:
      "Mantén tus tarjetas al día con pagos simples y programados desde tu cuenta.",
    color: "#f472b6",
  },
];

const serviciosPorVista = 2;
const extendServicios = (arr) => [
  ...arr.slice(-serviciosPorVista),
  ...arr,
  ...arr.slice(0, serviciosPorVista),
];

export const KnowMorePage = () => {
  const particlesArray = Array(40).fill(0);
  const [currentIndex, setCurrentIndex] = useState(serviciosPorVista);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate()

  const serviciosExtendidos = extendServicios(serviciosBancarios);

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
    if (currentIndex >= serviciosBancarios.length + serviciosPorVista) {
      setIsTransitioning(false);
      setCurrentIndex(serviciosPorVista);
    } else if (currentIndex <= serviciosPorVista - 1) {
      setIsTransitioning(false);
      setCurrentIndex(serviciosBancarios.length + serviciosPorVista - 1);
    } else {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {" "}
      {particlesArray.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const color = particleColors[i % particleColors.length];
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: color,
              filter: `drop-shadow(0 0 5px ${color})`,
            }}
            variants={particleVariants}
            animate="animate"
            initial={{ opacity: 0.3, y: 0 }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        );
      })}
      {[...Array(12)].map((_, i) => {
        const color = shootingStarColors[i % shootingStarColors.length];
        return (
          <motion.div
            key={`shooting-star-${i}`}
            custom={i}
            className="absolute rounded-lg blur-md"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 50}%`,
              width: 6 + Math.random() * 8,
              height: 1.5 + Math.random() * 2,
              rotate: 45,
              backgroundColor: color,
              opacity: 0,
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
            variants={shootingStarVariants}
            initial="hidden"
            animate="visible"
          />
        );
      })}
      <div className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#9AF241] motion-safe:animate-fade-up shadow-2xl">
          Explora y conoce a Banco Albora
        </h1>
        <button 
            onClick={() => navigate('/')}
            className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-[#1e293b]/80 hover:bg-[#1e293b] text-[#9AF241] px-4 py-2 rounded-full transition-all shadow-lg"
        >
        <ChevronLeft size={20} />
        <span>Regresar</span>
      </button>
        <br></br>
        <br></br>
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/2">
            <motion.h2
              className="text-2xl font-semibold text-[#9AF241] mb-4"
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95,
                color: "rgba(154, 242, 65, 0.5)",
                textShadow: "0 0 10px rgba(154, 242, 65, 0.5)",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                color: "#9AF241",
                textShadow: "0 0 20px rgba(154, 242, 65, 1)",
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              ¿Cómo registrarte?
            </motion.h2>
            <p className="text-gray-200 mb-6">
              Solo necesitas visitar una de nuestras sucursales para abrir tu
              cuenta. Luego podrás:
            </p>
            <ol className="space-y-6">
              {pasos.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-4"
                  initial={{
                    opacity: 0,
                    x: -30,
                    scale: 0.95,
                    color: "rgba(255, 255, 255, 0.5)",
                    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    color: "white",
                  }}
                  transition={{
                    delay: i * 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Icon size={28} className="text-[#9AF241]" />
                  </div>
                  <p className="text-gray-300">{text}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="md:w-1/2">
            <motion.h2
              className="text-2xl font-semibold text-[#9AF241] mb-4"
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95,
                color: "rgba(154, 242, 65, 0.5)",
                textShadow: "0 0 10px rgba(154, 242, 65, 0.5)",
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                color: "#9AF241",
                textShadow: "0 0 20px rgba(154, 242, 65, 1)",
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              Beneficios de ser parte de Banco Albora
            </motion.h2>
            <ul className="space-y-4">
              {beneficios.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{
                    opacity: 0,
                    x: -20,
                    scale: 0.95,
                    color: "rgba(255, 255, 255, 0.5)",
                    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    color: "white",
                  }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle size={22} className="text-[#9AF241]" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="space-y-12 text-[#E2F9D9]">
          <section>
            <SectionTitle>Tipos de Cuenta</SectionTitle>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              <InfoCard
                icon={PiggyBank}
                title="Cuenta de Ahorro"
                description="Aumenta tu dinero con intereses mensuales y mantén tu capital seguro para el futuro."
                color="#4CAF50"
              />
              <InfoCard
                icon={CreditCard}
                title="Cuenta Monetaria"
                description="Ideal para el manejo diario. Realiza pagos, transferencias y controla tu saldo al instante."
                color="#2196F3"
              />
              <InfoCard
                icon={Wallet}
                title="Caja de Ahorro"
                description="Perfecta para guardar dinero a largo plazo o crear un fondo de emergencias."
                color="#FFC107"
              />
            </motion.div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#9AF241] mb-8 text-center">
              Movimientos Bancarios
            </h2>
            <div className="relative">
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1e293b] bg-opacity-80 p-3 rounded-full shadow-lg z-10 hover:scale-110 transition"
              >
                <ChevronLeft className="text-white" size={24} />
              </button>

              <div className="overflow-hidden">
                <div
                  className={`flex ${
                    isTransitioning
                      ? "transition-transform duration-500 ease-in-out"
                      : ""
                  }`}
                  style={{
                    transform: `translateX(-${
                      currentIndex * (100 / serviciosPorVista)
                    }%)`,
                    width: `${
                      (serviciosExtendidos.length / serviciosPorVista) * 100
                    }%`,
                  }}
                  onTransitionEnd={onTransitionEnd}
                >
                  {serviciosExtendidos.map(
                    ({ id, icon, title, description, color }, index) => (
                      <div
                        key={`${id}-${index}`}
                        className="w-1/2 px-2 flex-shrink-0"
                      >
                        <div className="bg-[#1e293b]/80 rounded-xl mx-4 p-6 shadow-lg backdrop-blur-md h-full">
                          <div
                            className="w-14 h-14 flex items-center justify-center rounded-full mb-3"
                            style={{ backgroundColor: `${color}30`, color }}
                          >
                            {icon}
                          </div>
                          <h3 className="text-base font-semibold mb-1 text-white">
                            {title}
                          </h3>
                          <p className="text-sm text-[#CDE5DD]">
                            {description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1e293b] bg-opacity-80 p-3 rounded-full shadow-lg z-10 hover:scale-110 transition"
              >
                <ChevronRight className="text-white" size={24} />
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-[#9AF241] mb-6 text-center">
              Servicios del Banco
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{
                staggerChildren: 0.2,
                duration: 0.4,
              }}
            >
              {servicioCards.map(
                ({ icon: Icon, title, description, color }, i) => (
                  <motion.div
                    key={i}
                    className="bg-[#1e293b] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center text-center transform hover:scale-80"
                    variants={cardVariants}
                    whileHover={{
                      scale: 0.5,
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Icon size={40} className="mb-4" style={{ color }} />
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color }}
                    >
                      {title}
                    </h3>
                    <p className="text-gray-200">{description}</p>
                  </motion.div>
                )
              )}
            </motion.div>
          </section>
          <section>
            <motion.div
              className="bg-[#1e293b] rounded-2xl p-8 shadow-xl text-center"
              initial={{ opacity: 0, x: -100, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <BadgeDollarSign
                size={50}
                className="text-[#9AF241] mx-auto mb-4"
              />
              <h2 className="text-3xl font-bold text-[#9AF241] mb-4">
                Convertidor de Divisas
              </h2>
              <p className="text-gray-200 max-w-3xl mx-auto">
                Consulta tu saldo en tiempo real en diferentes monedas. Nuestro
                sistema de cambio está vinculado a tasas oficiales, asegurando
                transparencia en tus conversiones.
              </p>
            </motion.div>
          </section>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
          >
            {sections.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={i}
                className="p-6 transition-all text-center flex flex-col items-center"
                initial={{ opacity: 0, x: -50, rotate: -10 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.15 }}
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <Icon size={40} className="text-[#9AF241] mb-4" />
                <h3 className="text-xl font-semibold text-[#9AF241] mb-2">
                  {title}
                </h3>
                <p className="text-gray-200">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
      <br /><br /><br />
    </div>
  );
};
