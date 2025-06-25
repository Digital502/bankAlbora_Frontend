import { useState } from 'react';
import { useEffect } from 'react';
import { useUsers } from '../../shared/hooks/useUsers';
import { useUserAccount } from '../../shared/hooks/useAccount';
import { UserAccount } from '../account/AccountDetails';
import { NavbarDashboardAdmin } from '../navs/NavbarDashboardAdmin';
import { Footer } from '../footer/Footer';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

export const Users = () => {
  const { users, isFetching, updateUseUser, deleteUser } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    user: selectedUser,
    accounts: userAccounts,
    loading,
  } = useUserAccount(selectedUserId);

  const handleOpenModal = (user) => {
    console.log(user)
    setSelectedUserId(user.uid);
    setModalOpen(true)
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUserId(null);
  };

  const filteredUsers = users.filter((usuario) =>
    [usuario.nombre, usuario.apellido, usuario.nombreUsuario]
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div>
      <NavbarDashboardAdmin />
      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
            Lista de Usuarios
          </h2>
          <div className="mb-6 relative max-w-md mx-auto">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o usuario..."
              className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-inner">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Apellido</th>
                  <th className="px-4 py-2 text-left">Usuario</th>
                  <th className="px-4 py-2 text-left">Correo</th>
                  <th className="px-4 py-2 text-left">Celular</th>
                  <th className="px-4 py-2 text-left">Dirección</th>
                  <th className="px-4 py-2 text-left">Trabajo</th>
                  <th className="px-4 py-2 text-center">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan="8">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((usuario) => (
                    <tr
                      key={usuario.uid}
                      className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                    >
                      <td className="px-4 py-3 rounded-l-xl">{usuario.nombre}</td>
                      <td className="px-4 py-3">{usuario.apellido}</td>
                      <td className="px-4 py-3">{usuario.nombreUsuario}</td>
                      <td className="px-4 py-3">{usuario.correo}</td>
                      <td className="px-4 py-3">{usuario.celular}</td>
                      <td className="px-4 py-3">{usuario.direccion}</td>
                      <td className="px-4 py-3">{usuario.trabajo}</td>
                      <td className="px-4 py-3 text-center rounded-r-xl">
                        <button
                          onClick={() => handleOpenModal(usuario)}
                          className="bg-[#9AF241] text-gray-900 hover:bg-[#b9fc60] transition-all px-4 py-2 rounded-md font-semibold"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-white/70">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && selectedUser && (
          <UserAccount
            user={selectedUser}
            accounts={userAccounts || []}
            onClose={handleCloseModal}
            onUpdate={updateUseUser}
            onDelete={deleteUser}
          />
        )}
        <Footer />
      </div>
    </div>
  );
};