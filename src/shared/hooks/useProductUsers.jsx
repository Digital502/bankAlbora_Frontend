import { useState, useEffect, useCallback } from "react";
import { 
  getOrganizations,
  addAffiliation as addAffiliationApi,
  deleteAffiliation as deleteAffiliationApi,
  getAffiliations as getAffiliationsApi,
  getAffiliationStatus as getAffiliationStatusApi
} from "../../services/api";
import toast from "react-hot-toast";

export const useProductUsers = () => {
  const [organizations, setOrganizations] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchOrganizationsWithStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAffiliationStatusApi();

      if (!response || !response.organizations) {
        toast.error("No se encontraron organizaciones registradas.");
        return;
      }

      if (response.success === false) {
        throw new Error(response.message || "Error al obtener las organizaciones");
      }

      setOrganizations(response.organizations);
      
      const affiliatedIds = response.organizations
        .filter(org => org.isAffiliated)
        .map(org => org.uid);
      
      setAffiliations(affiliatedIds);
      
      return response.organizations;
    } catch (err) {
      console.error("Error al obtener organizaciones con estado:", err);
      toast.error(err?.message || "Error al cargar las organizaciones");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAffiliations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAffiliationsApi();

      if (response.error) {
        throw new Error(response.message);
      }
      const affiliationIds = response.afiliaciones?.map(org => org.uid) || [];
      setAffiliations(affiliationIds);
      return affiliationIds;
    } catch (err) {
      console.error("Error al cargar afiliaciones:", err);
      toast.error(err?.message || "Error al cargar tus afiliaciones");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAffiliation = useCallback(async (organizacionId) => {
    try {
      const response = await addAffiliationApi({ organizacionId });

      if (response.error) {
        throw new Error(response.message);
      }
      setOrganizations(prev => 
        prev.map(org => 
          org.uid === organizacionId 
            ? { ...org, isAffiliated: true } 
            : org
        )
      );
      
      setAffiliations(prev => [...prev, organizacionId]);
      
      return true;
    } catch (err) {
      console.error("Error al agregar afiliación:", err);
      toast.error(err?.message || "Error al agregar afiliación");
      return false;
    }
  }, []);

  const deleteAffiliation = useCallback(async (organizacionId) => {
    try {
      const response = await deleteAffiliationApi(organizacionId);

      if (response.error) {
        throw new Error(response.message);
      }

      setOrganizations(prev => 
        prev.map(org => 
          org.uid === organizacionId 
            ? { ...org, isAffiliated: false } 
            : org
        )
      );
      
      setAffiliations(prev => prev.filter(id => id !== organizacionId));
      
      return true;
    } catch (err) {
      console.error("Error al eliminar afiliación:", err);
      toast.error(err?.message || "Error al eliminar afiliación");
      return false;
    }
  }, []);

  const isAffiliated = useCallback((organizacionId) => {
    return affiliations.some(id => id === organizacionId);
  }, [affiliations]);

  useEffect(() => {
    if (!hasLoaded) {
      const loadInitialData = async () => {
        try {
          await fetchOrganizationsWithStatus();
          setHasLoaded(true);
        } catch (error) {
          await Promise.all([
            fetchOrganizations(),
            loadAffiliations()
          ]);
          setHasLoaded(true);
        }
      };
      loadInitialData();
    }
  }, [fetchOrganizationsWithStatus, hasLoaded]);

  return {
    organizations,
    affiliations,
    isLoading,
    addAffiliation,
    deleteAffiliation,
    isAffiliated,
    fetchOrganizations: fetchOrganizationsWithStatus,
    loadAffiliations,
    hasLoaded
  };
};