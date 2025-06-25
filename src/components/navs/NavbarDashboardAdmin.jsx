import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import { User, Settings, LogOut } from 'lucide-react';

export const NavbarDashboardAdmin = () => {
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
        onClick={() => navigate('/administrator')}
        className="flex items-center gap-2 cursor-pointer select-none"
        title="Ir al panel administrativo"
      >
        <img
          src="./logo_albora.png"  
          alt="Logo Albora Bank"
          className="w-12 h-12 object-contain"  
        />
        <div className="text-[#9AF241] font-extrabold text-2xl">
          Albora Bank
        </div>
      </div>

      <ul className="hidden md:flex space-x-8 text-[#E2F9D9] font-medium">
        <li>
          <button
            onClick={() => navigate('/users-administrator')}
            className="hover:text-[#9AF241] transition-colors"
          >
            Usuarios
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/deposit')}
            className="hover:text-[#9AF241] transition-colors"
          >
            Depósitos
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/history')}
            className="hover:text-[#9AF241] transition-colors"
          >
            Movimientos
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/product-list-admin')}
            className="hover:text-[#9AF241] transition-colors"
          >
            Productos
          </button>
        </li>
      </ul>

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
              {user ? `${user.nombre} ${user.apellido}` : 'Admin'}
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] rounded-xl shadow-lg z-10">
                <button
                  onClick={() => {
                    navigate('/profileAdmin');
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