import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useInsurance } from "../../shared/hooks/useInsurance";
import { NavbarDashboardAdmin } from "../navs/NavbarDashboardAdmin";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import { Footer } from "../footer/Footer";
import { Plus, List, Clipboard } from "lucide-react";
import { useRequestInsurance } from "../../shared/hooks/useRequestInsurance";

export const InsuranceAdmin = () => {
  const {
    insurances,
    isLoading,
    registerNewServiceBanco,
    editInsurance,
    removeInsurance,
  } = useInsurance();
  const { solicitudes, handleAprobarSolicitud, isLoadingSolicitudes } =
    useRequestInsurance();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    precio: "",
    cobertura: "",
    duracionMeses: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [activeView, setActiveView] = useState("list");
  const [showForm, setShowForm] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    id: null,
  });
  const [errors, setErrors] = useState({});
  const filtered = useMemo(() => {
    return insurances.filter(
      ({ nombre, descripcion, tipo }) =>
        (!searchTerm ||
          [nombre, descripcion, tipo].some((text) =>
            text.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        (!tipoFiltro || tipo === tipoFiltro)
    );
  }, [insurances, searchTerm, tipoFiltro]);

  const filteredSolicitudes = useMemo(() => {
    return solicitudes.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        s.usuarioId.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.servicioId.nombre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado = !estadoFiltro || s.estado === estadoFiltro;

      return matchesSearch && matchesEstado;
    });
  }, [solicitudes, searchTerm, estadoFiltro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nombre) errs.nombre = "Nombre requerido";
    if (!formData.descripcion) errs.descripcion = "Descripción requerida";
    if (!formData.tipo) errs.tipo = "Tipo requerido";
    if (!formData.precio || Number(formData.precio) <= 0)
      errs.precio = "Precio > 0";
    if (!formData.cobertura || Number(formData.cobertura) <= 0)
      errs.cobertura = "Cobertura > 0";
    if (!formData.duracionMeses || Number(formData.duracionMeses) <= 0)
      errs.duracionMeses = "Duración > 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      tipo: "",
      precio: "",
      cobertura: "",
      duracionMeses: "",
    });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        ...formData,
        precio: Number(formData.precio),
        cobertura: Number(formData.cobertura),
        duracionMeses: Number(formData.duracionMeses),
      };
      if (editingId) {
        await editInsurance(editingId, payload);
        toast.success("Seguro actualizado");
      } else {
        await registerNewServiceBanco(payload);
        toast.success("Seguro registrado");
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Error");
    }
  };

  const handleEdit = (insurance) => {
    setFormData({ ...insurance });
    setEditingId(insurance._id || insurance.uid);
    setShowForm(true);
    setActiveView("list");
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.id) return;
    try {
      await removeInsurance(deleteConfirmation.id);
      toast.success("Seguro eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
    setDeleteConfirmation({ show: false, id: null });
  };

  return (
    <div>
      <NavbarDashboardAdmin />
      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
            Administración de Seguros
          </h2>
          <div className="flex justify-center space-x-2.5 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] font-bold py-2 px-1 rounded-xl transition text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Seguro
        </button>

        <button
          className={`flex items-center px-2 py-2 rounded-xl font-semibold transition-all text-sm ${
            activeView === "list"
              ? "bg-[#9AF241] text-[#0f172a]"
              : "bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]"
          }`}
          onClick={() => {
            setActiveView("list");
            setShowForm(false);
          }}
        >
          <List className="w-5 h-5 mr-2" />
          Ver lista de seguros
        </button>

        <button
          className={`flex items-center px-1 py-2 rounded-xl font-semibold transition-all text-sm ${
            activeView === "requests"
              ? "bg-[#9AF241] text-[#0f172a]"
              : "bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]"
          }`}
          onClick={() => {
            setActiveView("requests");
            setShowForm(false);
          }}
        >
          <Clipboard className="w-5 h-5 mr-2" />
          Gestión de Solicitudes
        </button>

          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                  />
                  {errors.nombre && (
                    <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                  />
                  {errors.descripcion && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.descripcion}
                    </p>
                  )}
                </div>
                <div className="relative w-full">
                  <div className="relative">
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className={`w-full bg-[#334155] border ${
                        errors.tipo ? "border-red-500" : "border-[#9AF241]"
                      } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                    >
                      <option value="">Selecciona el tipo de seguro</option>
                      <option value="vida">Vida</option>
                      <option value="salud">Salud</option>
                      <option value="hogar">Hogar</option>
                    </select>
                  </div>
                  {errors.tipoSeguro && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.tipoSeguro}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    name="precio"
                    placeholder="Precio de Seguro"
                    value={formData.precio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                  />
                  {errors.precio && (
                    <p className="text-red-400 text-sm mt-1">{errors.precio}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    name="cobertura"
                    placeholder="Cobertura del Seguro"
                    value={formData.cobertura}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                  />
                  {errors.cobertura && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.cobertura}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    name="duracionMeses"
                    placeholder="Duración del Seguro (Meses)"
                    value={formData.duracionMeses}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                  />
                  {errors.duracionMeses && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.duracionMeses}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] font-bold py-2 px-6 rounded-xl transition"
                >
                  {editingId ? "Actualizar" : "Registrar"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-xl transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
          {activeView === "list" && !showForm && (
            <>
              {/* Contenedor de filtros */}
              <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0 mb-6 items-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar políticas por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8] transition"
                  />
                </div>
                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="bg-[#1e293b] border border-[#38BDF8] rounded-xl px-4 py-2 text-white font-medium w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                >
                  <option value="">Todos los tipos</option>
                  <option value="vida">Vida</option>
                  <option value="salud">Salud</option>
                  <option value="hogar">Hogar</option>
                </select>
              </div>

              {/* Tabla de seguros */}
              <div className="overflow-x-auto rounded-2xl shadow-inner">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                  <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Descripción</th>
                      <th className="px-4 py-2 text-left">Tipo</th>
                      <th className="px-4 py-2 text-left">Cobertura</th>
                      <th className="px-4 py-2 text-left">Precio</th>
                      <th className="px-4 py-2 text-left">Duración</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-white/70"
                        >
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : filtered.length ? (
                      filtered.map((item) => (
                        <tr
                          key={item._id || item.uid}
                          className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all rounded-lg"
                        >
                          <td className="px-4 py-3 rounded-l-xl">
                            {item.nombre}
                          </td>
                          <td className="px-4 py-3">{item.descripcion}</td>
                          <td className="px-4 py-3 capitalize">{item.tipo}</td>
                          <td className="px-4 py-3">Q.{item.cobertura}</td>
                          <td className="px-4 py-3">Q.{item.precio}</td>
                          <td className="px-4 py-3">
                            {item.duracionMeses} Meses
                          </td>
                          <td className="px-4 py-3 flex gap-2 rounded-r-xl">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] font-bold py-1 px-4 rounded-xl transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  show: true,
                                  id: item.uid,
                                })
                              }
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-xl transition"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-white/70"
                        >
                          No se encontraron seguros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {activeView === "requests" && (
            <>
              <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0 mb-6 items-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar solicitudes por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8] transition"
                  />
                </div>
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="bg-[#1e293b] border border-[#38BDF8] rounded-xl px-4 py-2 text-white font-medium w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
              <div className="overflow-x-auto rounded-2xl shadow-inner">
                <table className="min-w-full">
                  <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Correo</th>
                      <th className="px-4 py-2 text-left">Seguro</th>
                      <th className="px-4 py-2 text-left">Tipo de Seguro</th>
                      <th className="px-4 py-2 text-left">
                        Fecha de Solicitud
                      </th>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingSolicitudes ? (
                      <tr>
                        <td colSpan="7" className="text-center py-6">
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : filteredSolicitudes.length ? (
                      filteredSolicitudes.map((s) => (
                        <tr
                          key={s.uid}
                          className="bg-white/10 hover:bg-[#1f2f46]"
                        >
                          <td className="px-4 py-3">
                            {s.usuarioId?.nombre || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {s.usuarioId?.correo || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {s.servicioId?.nombre || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {s.servicioId?.tipo || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(s.fechaSolicitud).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 capitalize">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                s.estado === "pendiente"
                                  ? "bg-yellow-400/20 text-yellow-300"
                                  : s.estado === "aprobado"
                                  ? "bg-green-400/20 text-green-300"
                                  : "bg-red-400/20 text-red-300"
                              }`}
                            >
                              {s.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex gap-2">
                            {s.estado === "pendiente" && (
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() =>
                                    handleAprobarSolicitud(s.uid, "aprobado")
                                  }
                                  className="bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] text-[14px] font-bold py-1 px-4 rounded-xl transition"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() =>
                                    handleAprobarSolicitud(s.uid, "rechazado")
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white text-[14px] font-bold py-1 px-4 rounded-xl transition"
                                >
                                  Rechazar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-white/70"
                        >
                          No hay solicitudes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {deleteConfirmation.show && (
            <div className="fixed inset-0 bg-[#1e293b]/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-[#1e293b] border border-[#9AF241] rounded-2xl p-8 shadow-2xl max-w-md w-full text-white overflow-hidden">
                <h2 className="text-2xl font-bold mb-4 text-[#9AF241] flex items-center gap-2">
                  <svg
                    className="w-7 h-7 text-[#9AF241]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Confirmar Eliminación
                </h2>

                <p className="mb-8 text-gray-300 text-sm">
                  ¿Estás seguro de que deseas eliminar este seguro? Esta acción
                  no se puede deshacer.
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() =>
                      setDeleteConfirmation({ show: false, id: null })
                    }
                    className="px-5 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300 shadow-lg"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 rounded-xl bg-[#9AF241] hover:bg-[#84dd35] text-[#1e293b] font-semibold shadow-lg transition-all duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};
