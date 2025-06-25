import { useState } from "react";
import { useInvestmentPolicy } from "../../shared/hooks/useInvestmentPolicy";
import { NavbarDashboardAdmin } from "../navs/NavbarDashboardAdmin";
import { Footer } from "../footer/Footer";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import {
  validateMinMonto,
  minMontoMessage,
  validateMaxMonto,
  maxMontoMessage,
  validateMontoRelation,
  montoRelationMessage,
  validateTasaInteres,
  tasaInteresMessage,
} from "../../shared/validators/investmentPolicyValidators";
import { Plus, List, Clipboard } from "lucide-react";

export const InvestmentPolicyAdmin = () => {
  const {
    policies,
    isLoading,
    createPolicy,
    editPolicy,
    removePolicy,
    investments,
    isLoadingInvestments,
    updateInvestmentStatus,
  } = useInvestmentPolicy();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    minMonto: "",
    maxMonto: "",
    plazosDisponibles: "",
    tasaInteres: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [investSearchTerm, setInvestSearchTerm] = useState(""); // filtro por estado para inversiones
  const [textInvestSearch, setTextInvestSearch] = useState(""); // filtro texto para inversiones
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    id: null,
  });
  const [errors, setErrors] = useState({});
  const [activeView, setActiveView] = useState("policies");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion)
      newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.minMonto) {
      newErrors.minMonto = "El monto mínimo es obligatorio.";
    } else if (!validateMinMonto(formData.minMonto)) {
      newErrors.minMonto = minMontoMessage;
    }

    if (!formData.maxMonto) {
      newErrors.maxMonto = "El monto máximo es obligatorio.";
    } else if (!validateMaxMonto(formData.maxMonto)) {
      newErrors.maxMonto = maxMontoMessage;
    }

    if (
      formData.minMonto &&
      formData.maxMonto &&
      !validateMontoRelation(formData.minMonto, formData.maxMonto)
    ) {
      newErrors.minMonto = montoRelationMessage;
    }

    if (!formData.plazosDisponibles) {
      newErrors.plazosDisponibles = "Los plazos son obligatorios.";
    }

    if (!formData.tasaInteres) {
      newErrors.tasaInteres = "La tasa de interés es obligatoria.";
    } else if (!validateTasaInteres(formData.tasaInteres)) {
      newErrors.tasaInteres = tasaInteresMessage;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const formattedData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      minMonto: Number(formData.minMonto),
      maxMonto: Number(formData.maxMonto),
      plazosDisponibles: formData.plazosDisponibles
        .split(",")
        .map((n) => Number(n.trim())),
      tasaInteres: Number(formData.tasaInteres),
    };

    if (editingId) {
      await editPolicy(editingId, formattedData);
      setEditingId(null);
    } else {
      await createPolicy(formattedData);
    }

    resetForm();
  };

  const handleEdit = (policy) => {
    setFormData({
      nombre: policy.nombre,
      descripcion: policy.descripcion,
      minMonto: policy.minMonto,
      maxMonto: policy.maxMonto,
      plazosDisponibles: policy.plazosDisponibles.join(", "),
      tasaInteres: policy.tasaInteres,
    });
    setEditingId(policy.uid);
    setShowForm(true);
  };

  const handleDelete = async () => {
    await removePolicy(deleteConfirmation.id);
    setDeleteConfirmation({ show: false, id: null });
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      minMonto: "",
      maxMonto: "",
      plazosDisponibles: "",
      tasaInteres: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredPolicies = policies.filter((policy) =>
    policy.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvestments = investments.filter((inv) => {
    const matchEstado = investSearchTerm
      ? inv.estado === investSearchTerm
      : true;

    const lowerText = textInvestSearch.toLowerCase();
    const matchText =
      inv.numeroCuenta.toLowerCase().includes(lowerText) ||
      String(inv.montoInvertido).includes(lowerText) ||
      new Date(inv.createdAt).toLocaleDateString().includes(lowerText);

    return matchEstado && (textInvestSearch === "" || matchText);
  });

  return (
    <div>
      <NavbarDashboardAdmin />

      <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">
        <div>
          {/* Vista de Políticas */}
          {activeView === "policies" && (
            <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
                Administración de Políticas de Inversión
              </h2>
              {/* Botones de navegación */}
              <div className="flex justify-center space-x-1.5 mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] font-bold py-2 px-3 sm:px-6 rounded-xl transition text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
              Agregar Política
            </button>

            <button
              className={`flex items-center px-3 py-2 sm:px-4 rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                activeView === "policies"
                  ? "bg-[#9AF241] text-[#0f172a]"
                  : "bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]"
              }`}
              onClick={() => setActiveView("policies")}
            >
              <List className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
              Ver Políticas de Inversión
            </button>

            <button
              className={`flex items-center px-3 py-2 sm:px-4 rounded-xl font-semibold transition-all text-xs sm:text-sm ${
                activeView === "investments"
                  ? "bg-[#9AF241] text-[#0f172a]"
                  : "bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]"
              }`}
              onClick={() => setActiveView("investments")}
            >
              <Clipboard className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
              Gestión de Inversiones Pendientes
            </button>

              </div>
              {/* Formulario */}
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
                        className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241] focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                      />
                      {errors.nombre && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.nombre}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="descripcion"
                        placeholder="Descripción"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241] focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
                      />
                      {errors.descripcion && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.descripcion}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="number"
                        name="minMonto"
                        placeholder="Monto Mínimo"
                        value={formData.minMonto}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                      />
                      {errors.minMonto && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.minMonto}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="number"
                        name="maxMonto"
                        placeholder="Monto Máximo"
                        value={formData.maxMonto}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                      />
                      {errors.maxMonto && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.maxMonto}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="plazosDisponibles"
                        placeholder="Plazos (ej: 3,6,12)"
                        value={formData.plazosDisponibles}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                      />
                      {errors.plazosDisponibles && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.plazosDisponibles}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="number"
                        name="tasaInteres"
                        placeholder="Tasa de Interés (%)"
                        value={formData.tasaInteres}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#9AF241]"
                      />
                      {errors.tasaInteres && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.tasaInteres}
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

              {/* Buscador */}
              <div className="flex justify-center mb-6">
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
              </div>

              {/* Tabla de políticas */}
              <div className="overflow-x-auto rounded-2xl shadow-inner">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                  <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Descripción</th>
                      <th className="px-4 py-2 text-left">Min</th>
                      <th className="px-4 py-2 text-left">Max</th>
                      <th className="px-4 py-2 text-left">Plazos</th>
                      <th className="px-4 py-2 text-left">Interés</th>
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
                    ) : filteredPolicies.length > 0 ? (
                      filteredPolicies.map((policy) => (
                        <tr
                          key={policy.uid}
                          className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                        >
                          <td className="px-4 py-3 rounded-l-xl">
                            {policy.nombre}
                          </td>
                          <td className="px-4 py-3">{policy.descripcion}</td>
                          <td className="px-4 py-3">Q{policy.minMonto}</td>
                          <td className="px-4 py-3">Q{policy.maxMonto}</td>
                          <td className="px-4 py-3">
                            {policy.plazosDisponibles.join(", ")}
                          </td>
                          <td className="px-4 py-3">{policy.tasaInteres}%</td>
                          <td className="px-4 py-3 flex gap-2 rounded-r-xl">
                            <button
                              onClick={() => handleEdit(policy)}
                              className="bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] font-bold py-1 px-4 rounded-xl transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  show: true,
                                  id: policy.uid,
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
                          No se encontraron políticas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* ----------------- Segunda tabla: inversiones ------------------ */}
          {activeView === "investments" && (
            <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-extrabold text-center text-[#9AF241] mb-8 tracking-wide">
                Gestión de Inversiones Pendientes
              </h2>

              {/* Botones de navegación */}
              <div className="flex justify-center space-x-6 mb-6">
                <button
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeView === "policies"
                      ? "bg-[#9AF241] text-[#0f172a]"
                      : "bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]"
                  }`}
                  onClick={() => setActiveView("policies")}
                >
                  Ver Políticas de Inversión
                </button>
                <button
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    activeView === "investments"
                      ? "bg-[#9AF241] text-[#0f172a]"
                      : "bg-transparent border border-[#9AF241] text-[#9AF241] hover:bg-[#1e293b]"
                  }`}
                  onClick={() => setActiveView("investments")}
                >
                  Gestión de Inversiones Pendientes
                </button>
              </div>

              {/* Filtro por estado */}
              <div className="flex justify-center mb-6">
                <div className="relative w-full max-w-xs">
                  <label
                    htmlFor="estadoFilter"
                    className="block mb-1 text-sm text-white font-medium"
                  >
                    Filtrar por estado:
                  </label>
                  <select
                    id="estadoFilter"
                    value={investSearchTerm}
                    onChange={(e) => setInvestSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#1e293b]/50 text-white border border-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8] transition-all shadow-inner"
                  >
                    <option value="">Todos</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="APROBADA">Aprobada</option>
                    <option value="RECHAZADA">Rechazada</option>
                    <option value="ACTIVA">Activa</option>
                    <option value="VENCIDA">Vencida</option>
                    <option value="CERRADA">Cerrada</option>
                  </select>
                </div>
              </div>

              {/* Tabla de inversiones */}
              <div className="overflow-x-auto rounded-2xl shadow-inner">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                  <thead className="text-[#9AF241] uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left">No. de Cuenta</th>
                      <th className="px-4 py-2 text-left">Monto</th>
                      <th className="px-4 py-2 text-left">Fecha</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingInvestments ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-gray-400"
                        >
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : filteredInvestments.length > 0 ? (
                      filteredInvestments.map((inv) => (
                        <tr
                          key={inv.uid}
                          className="bg-white/10 text-white hover:bg-[#1f2f46] transition-all duration-300 rounded-lg"
                        >
                          <td className="px-4 py-3 rounded-l-xl">
                            {inv.numeroCuenta}
                          </td>
                          <td className="px-4 py-3">
                            Q{inv.montoInvertido.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(inv.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                inv.estado === "PENDIENTE"
                                  ? "bg-yellow-400/20 text-yellow-300"
                                  : inv.estado === "APROBADA"
                                  ? "bg-green-400/20 text-green-300"
                                  : inv.estado === "RECHAZADA"
                                  ? "bg-red-400/20 text-red-300"
                                  : inv.estado === "ACTIVA"
                                  ? "bg-blue-400/20 text-blue-300"
                                  : inv.estado === "VENCIDA"
                                  ? "bg-orange-400/20 text-orange-300"
                                  : inv.estado === "CERRADA"
                                  ? "bg-gray-500/20 text-gray-300"
                                  : "bg-white/10 text-white/60"
                              }`}
                            >
                              {inv.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 rounded-r-xl">
                            {inv.estado === "PENDIENTE" ? (
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() =>
                                    updateInvestmentStatus(inv.uid, 1)
                                  }
                                  className="bg-[#9AF241] hover:bg-[#7dcf2d] text-[#0f172a] font-bold py-1 px-4 rounded-xl transition"
                                >
                                  Aceptar
                                </button>
                                <button
                                  onClick={() =>
                                    updateInvestmentStatus(inv.uid, 0)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-xl transition"
                                >
                                  Rechazar
                                </button>
                              </div>
                            ) : (
                              <span className="text-white/60">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-white/70"
                        >
                          No se encontraron inversiones.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <Footer />
        {deleteConfirmation.show && (
          <div className="fixed inset-0 bg-[#1e293b]/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all">
            <div className="bg-[#1e293b] border border-[#9AF241] rounded-2xl p-8 shadow-2xl max-w-md w-full text-white overflow-hidden">
              <h3 className="text-xl font-semibold mb-4 text-[#9AF241]">
                Confirmar eliminación
              </h3>
              <p className="mb-6 text-gray-300">
                ¿Estás seguro que deseas eliminar esta política?
              </p>
              <div className="flex justify-end space-x-4">
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
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
