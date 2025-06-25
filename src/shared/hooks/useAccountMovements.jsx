import { useState, useEffect } from 'react';
import { latestMovementsAccount } from '../../services/api';
import toast from 'react-hot-toast';

export const useAccountMovements = () => {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovements = async (accountNumber) => {
    if (!accountNumber) return;
    
    setIsLoading(true);
    try {
      const response = await latestMovementsAccount(accountNumber);
      if (response.error) {
        throw new Error('Error al obtener movimientos');
      }
      setMovements(response.movimientos || []);
    } catch (error) {
      toast.error(error.message || 'Error al cargar movimientos');
      setMovements([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    movements,
    isLoading,
    fetchMovements
  };
};