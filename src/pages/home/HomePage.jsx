import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight} from "lucide-react";
import { Footer } from "../../components/footer/Footer";

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

export const HomePage = () => {
  const particlesArray = Array(40).fill(0);
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col items-center justify-center px-4">

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

      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-center"
        style={{ color: "#9AF241" }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <br />
        Banco Albora
      </motion.h1>

      <motion.p
        className="mt-4 text-xl md:text-2xl text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Tu futuro financiero comienza hoy. Tecnología de punta, seguridad y control total en tus manos.
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={() => navigate("/auth")}
          className="bg-[#9AF241] hover:bg-[#9CF25E] text-[#022873] font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Iniciar Sesión
        </motion.button>
        <motion.button
          onClick={() => navigate("/knowMore")}
          className="flex items-center justify-center bg-white text-[#145259] hover:text-white hover:bg-[#59818B] px-6 py-3 rounded-2xl shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Conocer más <ArrowRight className="ml-2" size={20} />
        </motion.button>
      </motion.div>

      <motion.div
        className="mt-20 max-w-5xl w-full grid md:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {[
          {
            title: "Seguridad Avanzada",
            description: "Protección total de tus datos con autenticación por tokens y cifrado moderno.",
          },
          {
            title: "Transferencias Inteligentes",
            description: "Gestiona tus movimientos con límites y control de saldo en tiempo real.",
          },
          {
            title: "Administración Exclusiva",
            description: "Solo administradores autorizados pueden crear y gestionar cuentas clientes.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-[#1e293b] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.05 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            animate={{
              y: [0, -10, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <h3 className="text-xl font-semibold text-[#9AF241] mb-2">{item.title}</h3>
            <p className="text-[#E2F9D9]">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
      <br />
      <Footer/>
      <br /><br /><br />
    </div>
  );
};
