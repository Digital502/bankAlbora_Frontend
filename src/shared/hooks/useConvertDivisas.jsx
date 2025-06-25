import { useState } from 'react';
import { convertidorDivisas } from '../../services/api';
import toast from 'react-hot-toast';

export const useConvertidor = () => {
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const convert = async ({ from, to, amount }) => {
    setIsLoading(true);
    try {
      const response = await convertidorDivisas({ from, to, amount });
      if (response.error) throw new Error(response.message);
      setResultado(response);
      toast.success('Conversión realizada con éxito');
      return response;
    } catch (error) {
      toast.error(error.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resultado,
    isLoading,
    convert,
  };
};
