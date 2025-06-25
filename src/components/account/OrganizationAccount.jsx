import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  X, Building, Mail, MapPin, User, Briefcase, Phone, CreditCard,
  DollarSign, Wallet, Banknote, Save, Trash2, Pencil
} from 'lucide-react';

export const OrganizationAccount = ({ organization, accounts, onClose, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formData, setFormData] = useState({
    nombre: organization.nombre,
    nit: organization.nit,
    direccion: organization.direccion,
    correo: organization.correo,
    representante: organization.representante?.[0] || {}
  });

  if (!organization) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('representante.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        representante: {
          ...prev.representante,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const success = await onUpdate(organization.uid, formData);
    if (success) {
      setEditMode(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(organization.uid);
    setConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative border border-white/20 text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl font-bold"
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-extrabold mb-6 text-[#9AF241] text-center tracking-wide flex items-center justify-center gap-2">
          <Building /> Detalles de la Organización
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <p>
              <Building className="inline mr-2 text-[#9AF241]" />
              <span className="font-semibold">Nombre:</span>{" "}
              {editMode ? (
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white w-full"
                />
              ) : (
                organization.nombre
              )}
            </p>
            <p>
              <Briefcase className="inline mr-2 text-[#9AF241]" />
              <span className="font-semibold">NIT:</span>{" "}
              {editMode ? (
                <input
                  name="nit"
                  value={formData.nit}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white w-full"
                />
              ) : (
                organization.nit
              )}
            </p>
            <p>
              <Mail className="inline mr-2 text-[#9AF241]" />
              <span className="font-semibold">Correo:</span>{" "}
              {editMode ? (
                <input
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white w-full"
                />
              ) : (
                organization.correo
              )}
            </p>
          </div>
          <div className="space-y-4">
            <p>
              <MapPin className="inline mr-2 text-[#9AF241]" />
              <span className="font-semibold">Dirección:</span>{" "}
              {editMode ? (
                <input
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white w-full"
                />
              ) : (
                organization.direccion
              )}
            </p>
          </div>
        </div>

        {/* Sección Representante */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-[#9AF241] flex items-center gap-2">
            <User /> Representante Legal
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <p>
                <User className="inline mr-2 text-[#9AF241]" />
                <span className="font-semibold">Nombre:</span>{" "}
                {editMode ? (
                  <input
                    name="representante.nombre"
                    value={formData.representante?.nombre || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-white w-full"
                  />
                ) : (
                  organization.representante?.[0]?.nombre || 'N/A'
                )}
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <Mail className="inline mr-2 text-[#9AF241]" />
                <span className="font-semibold">Correo:</span>{" "}
                {editMode ? (
                  <input
                    name="representante.correo"
                    value={formData.representante?.correo || ''}
                    onChange={handleChange}
                    className="bg-transparent border-b border-white w-full"
                  />
                ) : (
                  organization.representante?.[0]?.correo || 'N/A'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Sección Cuentas */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-[#9AF241] flex items-center gap-2">
            <Wallet /> Cuentas Registradas
          </h3>

          {accounts && accounts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div
                  key={acc._id || acc.numeroCuenta || index}
                  className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-sm transition-transform hover:scale-105 space-y-1"
                >
                  <p><CreditCard className="inline mr-2 text-[#9AF241]" /> <span className="font-semibold">Número:</span> {acc.numeroCuenta}</p>
                  <p><Wallet className="inline mr-2 text-[#9AF241]" /> <span className="font-semibold">Tipo:</span> {acc.tipoCuenta}</p>
                  <p><DollarSign className="inline mr-2 text-[#9AF241]" /> <span className="font-semibold">Saldo:</span> Q{acc.saldoCuenta.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/70 text-center">Esta organización no tiene cuentas registradas.</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {!editMode ? (
            <button
              className="bg-[#9AF241] text-black px-6 py-2 rounded-xl font-semibold hover:bg-lime-300 transition flex items-center gap-2"
              onClick={() => setEditMode(true)}
            >
              <Pencil size={18} /> Actualizar
            </button>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600 transition flex items-center gap-2"
                onClick={handleSubmit}
              >
                <Save size={18} /> Guardar cambios
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-600 transition"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </button>
            </>
          )}

          {!confirmDelete ? (
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={18} /> Eliminar organización
            </button>
          ) : (
            <>
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition"
                onClick={handleDelete}
              >
                Confirmar eliminación
              </button>
              <button
                className="bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-700 transition"
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

OrganizationAccount.propTypes = {
  organization: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    nit: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    correo: PropTypes.string.isRequired,
    representante: PropTypes.arrayOf(
      PropTypes.shape({
        nombre: PropTypes.string,
        correo: PropTypes.string
      })
    )
  }).isRequired,
  accounts: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};