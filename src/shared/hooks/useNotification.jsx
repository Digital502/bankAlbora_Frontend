import { useEffect, useState } from 'react';
import { getNotifications, markAsRead } from '../../services/api';
import toast from 'react-hot-toast';

export const useNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getUseNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await getNotifications();
            if (response.error) {
                throw new Error('Error al obtener notificaciones');
            }
            setNotifications(response.notifications || []);
        } catch (error) {
            toast.error(error.message || 'Error al cargar notificaciones');
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const useMarkAsRead = async (id) => {
        try {
            const response = await markAsRead(id);
            if (response.error) {
                throw new Error('Error al marcar notificación como leída');
            }
            setNotifications(prev => 
                prev.map(notif => 
                    notif.uid === id ? { ...notif, leida: true } : notif
                )
            );
            toast.success('Notificación marcada como leída');
        } catch (error) {
            toast.error(error.message || 'Error al marcar notificación como leída');
        }
    };

    useEffect(() => {
        getUseNotifications();
    }, []);

    return {
        notifications,
        isLoading,
        getUseNotifications,
        useMarkAsRead
    };
};