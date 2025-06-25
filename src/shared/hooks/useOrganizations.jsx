import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getOrganization as getOrganizationsRequest, updateOrganization, deleteOrganization as deleteOrganizationRequest } from '../../services';

export const useOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [deletingOrganizationId, setDeletingOrganizationId] = useState(null);

    const getOrganizations = useCallback(async () => {
        setIsFetching(true);
        const response = await getOrganizationsRequest();

        if (response.error) {
            toast.error(response.e?.response?.data?.message || 'Error al obtener las organizaciones');
            setIsFetching(false);
            return;
        }

        setOrganizations(response.organizations);
        setIsFetching(false);
    }, []);

    const updateUseOrganization = async (id, data) => {
        try {
            await updateOrganization(id, data);
            toast.success("Organización actualizada");
            await getOrganizations();
            return true;
        } catch (err) {
            toast.error("Error al actualizar la organización");
            return false;
        }
    };

    const deleteOrganization = useCallback(async (id) => {
        setDeletingOrganizationId(id);
        const response = await deleteOrganizationRequest(id);

        if (response.error) {
            toast.error(response.e?.response?.data?.message || 'Error al eliminar organización');
            setDeletingOrganizationId(null);
            return;
        }

        toast.success('Organización desactivada correctamente');
        setOrganizations((prev) => prev.filter((org) => org.id !== id));
        setDeletingOrganizationId(null);
    }, []);

    useEffect(() => {
        getOrganizations();
    }, [getOrganizations]);

    return {
        organizations,
        isFetching,
        deletingOrganizationId,
        getOrganizations,
        updateUseOrganization,
        deleteOrganization
    };
}