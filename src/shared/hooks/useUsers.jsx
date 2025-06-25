import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getUsers as getUsersRequest, updateUser, deleteUser as deleteUserRequest} from '../../services';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);

    const getUsers = useCallback(async () => {
        setIsFetching(true);
        const response = await getUsersRequest();

        if (response.error) {
        toast.error(response.e?.response?.data?.message || 'Error al obtener los usuarios');
        setIsFetching(false);
        return;
        }

        setUsers(response.users);
        setIsFetching(false);
    }, []);

    const updateUseUser = async (uid, data) => {
      try {
        await updateUser(uid, data);
        toast.success("Usuario actualizado");
        await getUsers();
        return true;
      } catch (err) {
        toast.error("Error al actualizar al usuario");
        return false;
      }
    };

    const deleteUser = useCallback(async (uid) => {
        setDeletingUserId(uid);
        const response = await deleteUserRequest(uid);

        if (response.error) {
        toast.error(response.e?.response?.data?.message || 'Error al eliminar usuario');
        setDeletingUserId(null);
        return;
        }

        toast.success('Usuario desactivado correctamente');
        setUsers((prev) => prev.filter((user) => user.uid !== uid));
        setDeletingUserId(null);
    }, []);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    return {
        users,
        isFetching,
        deletingUserId,
        getUsers,
        updateUseUser,
        deleteUser
    };
}