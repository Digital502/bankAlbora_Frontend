import { useState } from 'react';
import { useOrganizations } from '../../shared/hooks/useOrganizations';
import { useOrganizationAccount } from '../../shared/hooks/useOrganizationAccount';
import { OrganizationAccount } from '../account/OrganizationAccount';
import { NavbarDashboardAdmin } from '../navs/NavbarDashboardAdmin';
import { Footer } from '../footer/Footer';

export const Organizations = () => {
  const {
    organizations = [], 
    isFetching,
    updateUseOrganization,
    deleteOrganization
  } = useOrganizations();

  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    user: selectedOrganization,
    account: organizationAccounts,
  } = useOrganizationAccount(selectedOrganizationId);

  const handleOpenModal = (organization) => {
    setSelectedOrganizationId(organization.uid);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrganizationId(null);
  };

  return (
    <div>
      <NavbarDashboardAdmin />
      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
            Lista de Organizaciones
          </h2>

          <div className="overflow-x-auto rounded-2xl shadow-inner">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">NIT</th>
                  <th className="px-4 py-2 text-left">Dirección</th>
                  <th className="px-4 py-2 text-left">Correo</th>
                  <th className="px-4 py-2 text-left">Representante</th>
                  <th className="px-4 py-2 text-left">Correo Rep.</th>
                  <th className="px-4 py-2 text-center">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      Cargando organizaciones...
                    </td>
                  </tr>
                ) : organizations.length > 0 ? (
                  organizations.map((organizacion) => (
                    <tr
                      key={organizacion.uid}
                      className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                    >
                      <td className="px-4 py-3 rounded-l-xl">{organizacion.nombre}</td>
                      <td className="px-4 py-3">{organizacion.nit}</td>
                      <td className="px-4 py-3">{organizacion.direccion}</td>
                      <td className="px-4 py-3">{organizacion.correo}</td>
                      <td className="px-4 py-3">
                        {organizacion.representante?.[0]?.nombre ?? 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {organizacion.representante?.[0]?.correo ?? 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center rounded-r-xl">
                        <button
                          onClick={() => handleOpenModal(organizacion)}
                          className="bg-[#9AF241] text-gray-900 hover:bg-[#b9fc60] transition-all px-4 py-2 rounded-md font-semibold"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-white/70">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="text-lg">No hay organizaciones registradas.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && selectedOrganization && (
          <OrganizationAccount
            organization={selectedOrganization}
            accounts={organizationAccounts || []}
            onClose={handleCloseModal}
            onUpdate={updateUseOrganization}
            onDelete={deleteOrganization}
          />
        )}
        <Footer />
      </div>
    </div>
  );
};