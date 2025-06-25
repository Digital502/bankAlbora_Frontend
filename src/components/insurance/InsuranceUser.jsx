import { useState, useEffect } from "react";
import { useSeguroUsuario } from "../../shared/hooks/useSeguroUsuario";
import { NavbarDashboardUser } from "../../components/navs/NavbarDashboardUser";
import { Footer } from "../../components/footer/Footer";
import { motion } from 'framer-motion';

export const InsuranceBase = () => {
  const {
    seguros,
    cuentas,
    solicitudes,
    isLoadingSeguros,
    isLoadingSolicitudes,
    fetchSegurosDisponibles,
    fetchSolicitudesUsuario,
    solicitarSeguro,
  } = useSeguroUsuario();

  const [view, setView] = useState("default");
  const [filtroNombreSolicitud, setFiltroNombreSolicitud] = useState("");
  const [filtroTipoSolicitud, setFiltroTipoSolicitud] = useState("");
  const [filtroNombreSeguro, setFiltroNombreSeguro] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");
  const [filtroTipoSeguro, setFiltroTipoSeguro] = useState("");
    const [seguroSeleccionado, setSeguroSeleccionado] = useState(null);
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState("");
      const [errorCuenta, setErrorCuenta] = useState(""); 

  useEffect(() => {
    fetchSolicitudesUsuario();
    fetchSegurosDisponibles();
  }, []);

  const tieneSolicitudes = solicitudes.length > 0;

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const matchNombre = s.servicioId.nombre.toLowerCase().includes(filtroNombreSolicitud.toLowerCase());
    const matchTipo = filtroTipoSolicitud ? s.servicioId.tipo === filtroTipoSolicitud : true;
    return matchNombre && matchTipo;
  });

  const segurosFiltrados = seguros.filter((s) => {
    const matchNombre = s.nombre.toLowerCase().includes(filtroNombreSeguro.toLowerCase());
    const matchPrecio = filtroPrecio ? s.precio <= parseFloat(filtroPrecio) : true;
    const matchTipo = filtroTipoSeguro ? s.tipo === filtroTipoSeguro : true;
    return matchNombre && matchPrecio && matchTipo;
  });

    if (view === "default" && !tieneSolicitudes) {
    return (
        <div>
        <NavbarDashboardUser />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-10">
            <div className="text-center">
            <h1 className="text-5xl font-extrabold text-[#9AF241] mb-6 drop-shadow-lg">
                ¿Aún no tienes seguros adquiridos?
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Protege lo que más valoras. Explora nuestras opciones de seguros accesibles y solicita el que mejor se adapte a tus necesidades.
            </p>
            <button
                onClick={() => setView("seguros")}
                className="bg-[#9AF241] text-[#0f172a] text-2xl font-semibold px-10 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
                Ver seguros disponibles
            </button>
            </div>

            <Footer />
        </div>
        </div>
    );
    }

if (view === "default" && tieneSolicitudes) {
  return (
    <div>
      <NavbarDashboardUser />
      <div className="min-h-screen text-white px-6 py-10 flex flex-col items-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div className="w-full max-w-5xl">
          <h2 className="text-4xl font-extrabold text-[#9AF241] mb-10 text-center drop-shadow-md">
            Mis Solicitudes de Seguros
          </h2>

          <div className="mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <input
              type="text"
              placeholder="Buscar por nombre del seguro..."
              value={filtroNombreSolicitud}
              onChange={(e) => setFiltroNombreSolicitud(e.target.value)}
              className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white w-full md:w-1/2 font-medium focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
            />

            <select
              value={filtroTipoSolicitud}
              onChange={(e) => setFiltroTipoSolicitud(e.target.value)}
              className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white font-medium w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
            >
              <option value="">Todos los tipos</option>
              <option value="vida">Vida</option>
              <option value="hogar">Hogar</option>
              <option value="salud">Salud</option>
            </select>

            <button
              onClick={() => setView("seguros")}
              className="bg-[#9AF241] text-[#0f172a] font-semibold text-lg px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
            >
              Ver seguros disponibles
            </button>
          </div>

          {isLoadingSolicitudes ? (
            <div className="flex justify-center items-center min-h-[250px]">
              <p className="text-xl text-gray-300">Cargando solicitudes...</p>
            </div>
          ) : solicitudesFiltradas.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No se encontraron solicitudes con esos criterios.
            </p>
          ) : (
            <ul className="space-y-6">
              {solicitudesFiltradas.map((sol) => (
                <li
                  key={sol.uid}
                  className="bg-[#1e293b] border border-[#9AF241] rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-transform duration-300"
                >
                  <p className="text-xl font-semibold text-[#9AF241] mb-2">
                    Seguro:{" "}
                    <span className="text-white">{sol.servicioId.nombre}</span>
                  </p>
                  <p className="text-white mb-1">
                    Tipo: <span className="font-medium capitalize">{sol.servicioId.tipo}</span>
                  </p>
                  <p className="text-white mb-1">
                    Precio: <span className="font-medium">Q{sol.servicioId.precio}</span>
                  </p>
                  <p className="text-white mb-1">
                    Estado:{" "}
                    <span className="font-semibold text-yellow-400">{sol.estado}</span>
                  </p>
                  <p className="text-white">
                    Fecha:{" "}
                    <span className="font-medium">
                      {new Date(sol.fechaSolicitud).toLocaleDateString()}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}


if (view === "seguros") {
  return (
    <div>
    <NavbarDashboardUser />
    <div className="min-h-screen text-white px-6 py-10 flex flex-col items-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="max-w-6xl mx-auto px-6 py-10 text-white ">
        <h1 className="text-5xl font-extrabold text-[#9AF241] text-center mb-10 drop-shadow-lg">
          Seguros Disponibles
        </h1>

        <div className="mb-10 flex flex-col md:flex-row md:flex-wrap gap-4 justify-between">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={filtroNombreSeguro}
            onChange={(e) => setFiltroNombreSeguro(e.target.value)}
            className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white w-full md:w-[30%] font-medium focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
          />

          <input
            type="number"
            placeholder="Precio máximo"
            value={filtroPrecio}
            onChange={(e) => setFiltroPrecio(e.target.value)}
            className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white w-full md:w-[30%] font-medium focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
          />

          <select
            value={filtroTipoSeguro}
            onChange={(e) => setFiltroTipoSeguro(e.target.value)}
            className="bg-[#1e293b] border border-[#9AF241] rounded-xl px-4 py-2 text-white w-full md:w-[30%] font-medium focus:outline-none focus:ring-2 focus:ring-[#9AF241]"
          >
            <option value="">Todos los tipos</option>
            <option value="vida">Vida</option>
            <option value="hogar">Hogar</option>
            <option value="salud">Salud</option>
          </select>
        </div>

        {isLoadingSeguros ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-xl text-gray-300">Cargando seguros...</p>
          </div>
        ) : segurosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No se encontraron seguros con esos criterios.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {segurosFiltrados.map((seguro) => (
              <div
                key={seguro.uid}
                className="bg-[#1e293b] rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[#9AF241] mb-2">{seguro.nombre}</h2>
                  <p className="text-gray-300 mb-1">Tipo: {seguro.tipo}</p>
                  <p className="text-gray-300 mb-1">Precio: Q{seguro.precio}</p>
                  <p className="text-gray-300 mb-4">Duración: {seguro.duracionMeses} meses</p>
                </div>
                <button
                onClick={() => {
                    setSeguroSeleccionado(seguro);
                    setView("confirmar");
                }}
                className="bg-[#9AF241] text-[#0f172a] font-semibold text-lg py-2 rounded-xl hover:scale-105 transition-all duration-300"
                >
                Solicitar este seguro
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            onClick={() => setView("default")}
            className="bg-gray-700 text-white px-8 py-3 rounded-xl text-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Volver
          </button>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
}

  if (view === "confirmar" && seguroSeleccionado) {
    return (
      <div>
        <NavbarDashboardUser />
        <div className="min-h-screen text-white px-6 py-12 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10 w-full max-w-md bg-[#1e293b] border border-[#9AF241] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.h2
                  className="text-3xl font-bold mb-2 text-[#9AF241]"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Confirmar Solicitud de Seguro
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-300"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {seguroSeleccionado.nombre} - {seguroSeleccionado.tipo}
                </motion.p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#9AF241]">
                    Detalles del seguro
                  </label>
                  <div className="bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3 space-y-1 text-gray-300">
                    <p><strong>Nombre:</strong> {seguroSeleccionado.nombre}</p>
                    <p><strong>Tipo:</strong> {seguroSeleccionado.tipo}</p>
                    <p><strong>Precio:</strong> Q{seguroSeleccionado.precio}</p>
                    <p><strong>Duración:</strong> {seguroSeleccionado.duracionMeses} meses</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#9AF241]">
                    Selecciona tu cuenta
                  </label>
                  <select
                    value={cuentaSeleccionada}
                    onChange={(e) => setCuentaSeleccionada(e.target.value)}
                    className="w-full bg-[#334155] border border-[#9AF241] rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Seleccione una cuenta</option>
                    {cuentas.map((c) => (
                      <option key={c.numeroCuenta} value={c.numeroCuenta}>
                        {c.numeroCuenta} - {c.tipoCuenta} - {c.saldoCuenta}
                      </option>
                    ))}
                  </select>
                </div>
                {errorCuenta && (
                <div className="flex justify-center w-full">
                    <p className="text-red-500 text-sm mt-2">{errorCuenta}</p>
                </div>
                )}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    setErrorCuenta("");

                    if (!cuentaSeleccionada) {
                      setErrorCuenta("Por favor, selecciona una cuenta.");
                      return;
                    }

                    const cuenta = cuentas.find((c) => c.numeroCuenta === cuentaSeleccionada);
                    if (!cuenta) {
                      setErrorCuenta("Cuenta no válida.");
                      return;
                    }

                    if (cuenta.saldoCuenta < seguroSeleccionado.precio) {
                      setErrorCuenta("Saldo insuficiente en la cuenta seleccionada.");
                      return;
                    }

                    await solicitarSeguro(seguroSeleccionado.uid, cuentaSeleccionada);
                    setView("default");
                  }}
                  className="mt-6 py-3 px-6 rounded-xl font-medium w-full bg-gradient-to-r from-cyan-600 to-cyan-700"
                >
                  Enviar solicitud
                  
                </motion.button>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setView("seguros")}
                    className="bg-gray-700 text-white px-6 py-3 rounded-xl text-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        <Footer />
        </div>
      </div>
    );
  }


  return null;
};
