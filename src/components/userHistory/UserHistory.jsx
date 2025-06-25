import { useHistory } from "../../shared/hooks/useHistory";
import { Footer } from "../footer/Footer";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

export const UserHistory = () => {
    const { accounts, movimientos, loading, error } = useHistory();

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">Error: {error}</p>;
if (!accounts.length) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
            <main className="flex-grow">
                <div className="bg-[#1e293b] rounded-2xl p-6 shadow-xl text-white max-w-5xl mx-auto mt-8 mb-10 text-center">
                    <h2 className="text-2xl font-semibold text-[#9AF241] mb-6">
                        Historial de Movimientos
                    </h2>
                    <p className="text-[#cbd5e1]">No tienes cuentas registradas.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
    // Combinar todos los movimientos en una sola lista
    const movimientosCombinados = Object.values(movimientos).flat();

    // Ordenar por fecha descendente
    const movimientosOrdenados = movimientosCombinados.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
            <main className="flex-grow">
                <div className="bg-[#1e293b] rounded-2xl p-6 shadow-xl text-white max-w-5xl mx-auto mt-8 mb-10">
                    <h2 className="text-2xl font-semibold text-[#9AF241] mb-6 text-center">
                        Historial de Movimientos
                    </h2>

                    {movimientosOrdenados.length > 0 ? (
                        <ul className="divide-y divide-[#334155]">
                            {movimientosOrdenados.map((mov) => (
                                <li
                                    key={mov.uid}
                                    className="bg-[#0f172a] rounded-lg p-4 border border-[#334155] mb-3"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium capitalize">{mov.tipo}</p>
                                            <p className="text-sm text-[#94a3b8]">
                                                {new Date(mov.fecha).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-[#64748b]">
                                                Cuenta: {mov.cuentaOrigen}
                                                {mov.cuentaDestino && ` → ${mov.cuentaDestino}`}
                                            </p>
                                        </div>
                                        <div
                                            className={`font-bold text-lg ${mov.tipo === "retiro" || mov.tipo === "compra"
                                                ? "text-red-400"
                                                : "text-green-400"
                                                }`}
                                        >
                                            {mov.tipo === "retiro" || mov.tipo === "compra" ? "-" : "+"}
                                            Q{Math.abs(mov.monto).toFixed(2)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#cbd5e1] text-center">No hay movimientos disponibles.</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};
