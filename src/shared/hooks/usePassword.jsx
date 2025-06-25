import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { generateCodigo, updatePasswordNew } from '../../services'; 

export const usePassword = (onFinish) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);

  const sendRecoveryCode = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setVerificationCode(null);

    try {
      const response = await generateCodigo({ email });
      if (response.error) throw response.error;
      
      setVerificationCode(response.codigo);
      setSuccess(true);
      toast.success("Código de recuperación enviado");
      return response.codigo;
    } catch (err) {
      setError(err);
      toast.error("Error al enviar el código de recuperación");
      console.error("Error en usePassword:", err);
      throw err;
    } finally {
      setLoading(false);
      if (onFinish) onFinish();
    }
  }, [onFinish]);

  const changePassword = useCallback(async ({ email, newPassword }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updatePasswordNew({ email, nuevaContraseña: newPassword });
      
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar la contraseña');
      }

      setSuccess(true);
      toast.success("Contraseña actualizada exitosamente");
      
      return {
        entityType: response.tipo,
        userData: response.datos
      };
    } catch (err) {
      setError(err);
      toast.error(err.message || "Error al actualizar la contraseña");
      console.error("Error en usePassword - changePassword:", err);
      throw err;
    } finally {
      setLoading(false);
      if (onFinish) onFinish();
    }
  }, [onFinish]);

  return {
    sendRecoveryCode,
    changePassword, 
    verificationCode,
    loading,
    error,
    success
  };
};