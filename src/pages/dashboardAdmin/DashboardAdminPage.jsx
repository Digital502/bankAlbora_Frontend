import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users, Banknote, CreditCardIcon, Clock, DollarSign,Building,Package,Wrench,FolderKanban	} from "lucide-react";
import { Footer } from "../../components/footer/Footer";
import { NavbarDashboardAdmin } from '../../components/navs/NavbarDashboardAdmin';

export const DashboardAdminPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const adminActions = [
    {
      title: "Registrar Clientes",
      description: "Registra nuevos clientes para crear su cuenta bancaria.",
      icon: <UserPlus size={32} />,
      onClick: () => navigate("/register"),
    },
    {
      title: "Registrar Cuenta",
      description: "Registrar nuevas cuentas para el cliente.",
      icon: <CreditCardIcon size={32} />,
      onClick: () => navigate("/register?form=bancario"),
    },
    {
      title: "Gestionar Usuarios",
      description: "Crear, editar y visualizar cuentas de clientes y administradores.",
      icon: <Users size={32} />,
      onClick: () => navigate("/users-administrator"),
    },
    {
      title: "Realizar Depósitos",
      description: "Depositar fondos y revisar historial de operaciones recientes.",
      icon: <Banknote size={32} />,
      onClick: () => navigate("/deposit"),
    },
    {
      title: "Préstamos",
      description: "Gestiona y visualiza los préstamos otorgados a los clientes.",
      icon: <DollarSign size={32} />,
      onClick: () => navigate("/admin/credit"),
    },
    {
      title: "Ver Movimientos",
      description: "Consulta los movimientos más frecuentes por usuario.",
      icon: <Clock size={32} />,
      onClick: () => navigate("/history"),
    },
    {
      title: "Servicios Bancarios",
      description: "Agrega y administra servicios exclusivos del banco.",
      icon: <Wrench size={32} />,
      onClick: () => navigate("/service-administrator"),
    },
    {
      title: "Registrar Organizaciones",
      description: "Agrega y administra las organizaciones asociadas.",
      icon: <Building size={32} />,
      onClick: () => navigate("/registerOrganization"),
    },
    {
      title: "Cuenta de Organización",
      description: "Registra y visualiza las cuentas de organizaciones asociadas.",
      icon: <FolderKanban size={32} />,
      onClick: () => navigate("/organization-administrator"),
    },
    {
      title: "Productos",
      description: "Visualiza los productos de organizaciones asociadas.",
      icon: <Package size={32} />,
      onClick: () => navigate("/product-list-admin"),
    },
  ];

  return (
    <div>
    <NavbarDashboardAdmin />  
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-center text-[#9AF241] mb-8"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Panel Administrativo
      </motion.h1>

      <motion.p
        className="text-center text-lg md:text-xl text-[#E2F9D9] mb-12 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Bienvenido, <strong>{user ? `${user.nombre} ${user.apellido}` : 'Admin'}</strong>. Desde aquí puedes gestionar todo el ecosistema bancario de Albora.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {adminActions.map((action, index) => (
          <motion.div
            key={index}
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={action.onClick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4 text-[#9AF241]">
              {action.icon}
              <h2 className="text-xl font-semibold">{action.title}</h2>
            </div>
            <p className="text-[#CDE5DD]">{action.description}</p>
          </motion.div>
        ))}
      </div>
      <br /><br /><br /><br /><br />
      <Footer/>
   </div>
   </div>
  );
};
