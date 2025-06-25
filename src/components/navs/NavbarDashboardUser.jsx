import {
  Bell,
  FileClock,
  Inbox,
  LogOut,
  PiggyBank,
  Settings,
  User
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

export const NavbarDashboardUser = () => {
  const { isLogged, logout, user } = useUserDetails();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  return (
    <nav className="bg-[#1e293b] px-6 py-4 flex justify-between items-center shadow-md">
      <div
        onClick={() => navigate('/bankAlbora')}
        className="flex items-center gap-2 cursor-pointer select-none"
        title="Ir al panel administrativo"
      >
        <img
          src="../logo_albora.png"
          alt="Logo Albora Bank"
          className="w-12 h-12 object-contain"
        />
        <div className="text-[#9AF241] font-extrabold text-2xl">
          Albora Bank
        </div>
      </div>

      <ul className="hidden md:flex space-x-8 text-[#E2F9D9] font-medium items-center">
        <li>
          <button
            onClick={() => navigate('/user/history')}
            className="flex items-center gap-2 hover:text-[#9AF241] transition-colors"
            title="Historial de clientes"
          >
            <FileClock size={18} />
            Historial
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/user/deposit')}
            className="flex items-center gap-2 hover:text-[#9AF241] transition-colors"
            title="Ver depósitos realizados"
          >
            <PiggyBank size={18} />
            Depósitos
          </button>
        </li>
        <li className="relative">
          <button
            onClick={() => navigate('/user/received')}
            className="flex items-center gap-2 hover:text-[#9AF241] transition-colors"
            title="Ver productos recibidos"
          >
            <Inbox size={18} />
            Recibidos
          </button>
        </li>
        <li className="relative">
          <button
            onClick={() => navigate('/notifications')}
            className="hover:text-[#9AF241] transition-colors"
            title="Notificaciones"
          >
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                
              </span>
            </div>
          </button>
        </li>
      </ul>

      {/* Perfil */}
      <div className="relative">
        {isLogged ? (
          <>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 bg-[#9AF241] text-[#022873] px-4 py-2 rounded-2xl shadow-md hover:bg-[#A5F66C] transition"
              aria-haspopup="true"
              aria-expanded={profileMenuOpen}
            >
              <User size={20} />
              {user ? `${user.nombre} ${user.apellido}` : 'Tu Perfil'}
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] rounded-xl shadow-lg z-10">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setProfileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-[#E2F9D9] hover:bg-[#9AF241] hover:text-[#022873] rounded-t-xl transition"
                >
                  <Settings size={18} />
                  Configuración
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-[#E2F9D9] hover:bg-[#9AF241] hover:text-[#022873] rounded-b-xl transition"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="bg-[#9AF241] text-[#022873] px-4 py-2 rounded-2xl shadow-md hover:bg-[#A5F66C] transition"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};
