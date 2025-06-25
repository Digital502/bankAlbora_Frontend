import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, ArrowDownCircle ,ListOrdered, DollarSignIcon  } from "lucide-react";
import { Footer } from "../../components/footer/Footer";
import { NavbarDashboarOrganization } from "../../components/navs/NavbarDashboardOrganization";

export const DashboardOrganizationPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const organizationActions = [   
    {
      title: "Tu Cuenta",
      description: "Visualiza la cuenta y saldo de tu organización.",
      icon: <DollarSignIcon size={32} />,
      onClick: () => navigate("/myAccounOrganization"),
    },
    {
      title: "Depósitos",
      description: "Visualiza los depósitos realizados a tu organización.",
      icon: <ArrowDownCircle  size={32} />,
      onClick: () => navigate("/depositsOrganization"),
    },
    {
      title: "Productos",
      description: "Registra y administra los productos que ofrece tu organización.",
      icon: <Package size={32} />,
      onClick: () => navigate("/product"),
    },
    {
      title: "Tus Productos",
      description: "Visualiza los productos que ofrece tu organización.",
      icon: <ListOrdered size={32} />,
      onClick: () => navigate("/product-list"),
    },
  ];

  return (
    <div>
      <NavbarDashboarOrganization />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center text-[#9AF241] mb-8"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Panel de Organización
        </motion.h1>
    
        <motion.p
          className="text-center text-lg md:text-xl text-[#E2F9D9] mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
            Bienvenido, <strong>{user ? `${user.nombre} ` : 'Organización'}</strong>. 
            <br />Desde aquí puedes gestionar tu organización asociada a Albora Bank.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {organizationActions.map((action, index) => (
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

        <br />
        <Footer />
      </div>
    </div>
  );
};
