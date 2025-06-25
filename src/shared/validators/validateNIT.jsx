export const validateNIT = (nit) => {
  // Remover espacios y guiones si los tiene
  const cleanNIT = nit.replace(/[\s-]/g, '');
  
  // Verificar que tenga exactamente 9 dígitos
  return /^\d{9}$/.test(cleanNIT);
};

export const validateNITMessage = 'El NIT debe contener exactamente 9 dígitos numéricos.';