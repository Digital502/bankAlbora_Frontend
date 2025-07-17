import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const particleColors = ["#145259", "#45858c"];

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

export const NotFound = () => {
  const navigate = useNavigate();
  const particlesArray = Array(35).fill(0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col items-center justify-center text-white px-6">
      
      {/* Partículas animadas */}
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

      <motion.h1
        className="text-7xl font-extrabold text-center"
        style={{ color: "#9AF241" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        404
      </motion.h1>

      <motion.p
        className="mt-4 text-xl text-center text-[#E2F9D9]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Lo sentimos, la página que buscas no fue encontrada.
      </motion.p>

      <motion.button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 rounded-xl bg-[#9AF241] text-[#022873] font-semibold shadow-lg hover:bg-[#9CF25E] transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Volver al Inicio
      </motion.button>
    </div>
  );
};
