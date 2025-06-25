import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Mail, BanknoteIcon, ArrowRightLeft } from 'lucide-react';
import { useNotification } from '../../shared/hooks/useNotification';
import { Footer } from '../footer/Footer';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';

export const NotificationList = () => {
  const { notifications, isLoading, useMarkAsRead } = useNotification();

  const handleMarkAsRead = async (id) => {
    await useMarkAsRead(id);
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'deposito':
        return <BanknoteIcon className="text-[#9AF241] mt-1" size={20} />;
      case 'transferencia':
        return <ArrowRightLeft className="text-[#9AF241] mt-1" size={20} />;
      default:
        return <Mail className="text-[#9AF241] mt-1" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <main className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          className="bg-[#1e293b]/80 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-[#9AF241]" size={24} />
            <h2 className="text-2xl font-semibold text-[#9AF241]">Notificaciones</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : notifications?.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.uid}
                  className={`bg-[#334155] p-4 rounded-xl transition-all ${
                    notification.leida ? 'opacity-70' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.tipo)}
                      <div>
                        <h3 className="font-semibold mb-1 capitalize">
                          {notification.tipo}
                        </h3>
                        <p className="text-gray-300 text-sm">{notification.mensaje}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(notification.fecha).toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-[#9AF241]">
                            Q{notification.monto.toFixed(2)}
                          </span>
                        </div>
                        {notification.cuentaOrigen && (
                          <span className="text-xs text-gray-400 mt-1 block">
                            Cuenta: {notification.cuentaOrigen}
                          </span>
                        )}
                      </div>
                    </div>
                    {!notification.leida && (
                      <button
                        onClick={() => handleMarkAsRead(notification.uid)}
                        className="bg-[#9AF241]/20 hover:bg-[#9AF241]/30 text-[#9AF241] p-2 rounded-lg transition-colors"
                        title="Marcar como leída"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No tienes notificaciones pendientes
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};