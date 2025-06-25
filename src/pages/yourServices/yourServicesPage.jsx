import React from 'react';
import { NavbarDashboardUser } from '../../components/navs/NavbarDashboardUser';
import { Footer } from '../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaBoxOpen } from 'react-icons/fa';

export const YouSevices = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <FaChartLine size={40} className="text-[#4ADE80]" />,
      title: 'Inversiones',
      description: 'Explora políticas de inversión y administra tus fondos para maximizar tus rendimientos.',
      route: '/servicios/inversiones',
      color: '#4ADE80',
    },
    {
      icon: <FaShieldAlt size={40} className="text-[#60A5FA]" />,
      title: 'Seguros',
      description: 'Accede a seguros médicos, de vida, de vehículo y más, para proteger lo que más importa.',
      route: '/servicios/seguros',
      color: '#60A5FA',
    },
    {
      icon: <FaBoxOpen size={40} className="text-[#FBBF24]" />,
      title: 'Productos Bancarios',
      description: 'Adquiere nuestros productos, como electrónicos, electrodomésticos y más, con facilidades de pago.',
      route: '/product-list-all',
      color: '#FBBF24',
    },
  ];

  return (
    <div>
      <NavbarDashboardUser />

      {/* Contenedor principal con flex y fondo completo */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-30">

        {/* Contenido principal con flex-1 para empujar el footer hacia abajo */}
        <div className="flex-1 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-14"
          >
            <h1 className="text-5xl font-extrabold text-[#9AF241] mb-6 drop-shadow-lg">
              Tus Servicios
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Desde acá puedes verificar los servicios que ofrecemos y los que hayas adquirido.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl px-4">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                onClick={() => navigate(card.route)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.1,
                  ease: 'easeOut',
                }}
                whileHover={{
                  scale: 1.07,
                  y: -8,
                  boxShadow: `0 12px 25px ${card.color}88`,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer bg-[#1e293b] border rounded-2xl p-8 text-center transition-transform"
                style={{ borderColor: card.color }}
              >
                <div className="mb-5 flex justify-center">{card.icon}</div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: card.color }}>
                  {card.title}
                </h2>
                <p className="text-gray-300 text-base">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer siempre abajo */}
        <Footer />
      </div>
    </div>
  );
};

export default YouSevices;
