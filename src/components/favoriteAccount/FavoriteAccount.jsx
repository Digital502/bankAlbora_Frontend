import React, { useState } from "react";
import { useFavoriteAccounts } from "../../shared/hooks/useFavorites";
import { motion } from "framer-motion";
import { SendHorizontal, Trash2, Pencil, Star } from "lucide-react";
import { Footer } from "../footer/Footer";

export const FavoriteAccount = () => {
  const {
    favoriteAccounts,
    isLoading,
    addAccountToFavorites,
    removeFavoriteAccount,
    updateFavoriteAlias, 
  } = useFavoriteAccounts();

  const [formData, setFormData] = useState({ numeroCuenta: "", alias: "" });
  const [editing, setEditing] = useState(null);
  const [newAlias, setNewAlias] = useState("");

  const handleAdd = async () => {
    if (!formData.numeroCuenta || !formData.alias) return;
    await addAccountToFavorites(formData);
    setFormData({ numeroCuenta: "", alias: "" });
  };

  const handleEdit = async (numeroCuenta) => {
    await updateFavoriteAlias(numeroCuenta, newAlias); 
    setEditing(null);
    setNewAlias("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-[#9AF241] mb-6 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Star className="w-13 h-13" />
        Cuentas Favoritas
      </motion.h1>

      <motion.p
        className="text-center text-lg md:text-xl text-[#E2F9D9] mb-10 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Agrega y administra tus cuentas favoritas para realizar transferencias rápidas y seguras.
      </motion.p>

      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl max-w-4xl mx-auto mb-10 border border-[#334155]">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Número de Cuenta"
              value={formData.numeroCuenta}
              onChange={(e) =>
                setFormData({ ...formData, numeroCuenta: e.target.value })
              }
              className="bg-[#0f172a] text-white border border-[#334155] placeholder:text-[#94a3b8] p-2 rounded-md"
            />
            <input
              placeholder="Alias"
              value={formData.alias}
              onChange={(e) =>
                setFormData({ ...formData, alias: e.target.value })
              }
              className="bg-[#0f172a] text-white border border-[#334155] placeholder:text-[#94a3b8] p-2 rounded-md"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-[#9AF241] text-[#0f172a] hover:bg-[#82d336] transition-all font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4" /> Agregar a Favoritos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          <p className="text-center col-span-full text-white">Cargando...</p>
        ) : favoriteAccounts.length === 0 ? (
          <p className="text-center col-span-full text-white">No hay cuentas favoritas aún.</p>
        ) : (
          favoriteAccounts.map(({ numeroCuenta, alias }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#1e293b] p-5 rounded-2xl border border-[#334155] shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#9AF241] mb-1">{alias}</h2>
              <p className="text-sm text-[#cbd5e1] mb-3">Cuenta: {numeroCuenta}</p>

              {editing === numeroCuenta ? (
                <div className="flex gap-2">
                  <input
                    placeholder="Nuevo Alias"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    className="bg-[#0f172a] text-white border border-[#334155] placeholder:text-[#94a3b8] p-2 rounded-md flex-1"
                  />
                  <button
                    onClick={() => handleEdit(numeroCuenta)}
                    className="bg-[#9AF241] text-[#0f172a] hover:bg-[#82d336] font-medium px-3 py-1 rounded-md"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(numeroCuenta)}
                    className="border border-[#9AF241] text-[#9AF241] px-2 py-1 rounded-md hover:bg-[#0f172a]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFavoriteAccount(numeroCuenta)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    className="bg-cyan-600 text-white hover:bg-cyan-700 px-3 py-1 rounded-md flex items-center gap-1"
                    onClick={() => {
                      window.location.href = `/user/deposit?fromFavorite=true&account=${numeroCuenta}`;
                    }}
                  >
                    <SendHorizontal className="h-4 w-4" /> Transferir
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );
};
