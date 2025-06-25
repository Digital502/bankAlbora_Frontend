export const validateDPI = (dpi) => {
  return /^\d{13}$/.test(dpi);
};

export const validateDPIMessage = 'El DPI debe contener exactamente 13 dígitos numéricos.';
