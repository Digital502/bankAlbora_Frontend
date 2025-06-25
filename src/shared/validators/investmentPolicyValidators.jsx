
export const validateRequiredFields = (formData) => {
  return (
    formData.nombre &&
    formData.descripcion &&
    formData.minMonto &&
    formData.maxMonto &&
    formData.plazosDisponibles &&
    formData.tasaInteres
  );
};

export const requiredFieldsMessage = "Por favor, completa todos los campos.";

export const validateMinMonto = (minMonto) => {
  return Number(minMonto) >= 50;
};

export const minMontoMessage = "El monto mínimo no puede ser menor a 50.";

export const validateMaxMonto = (maxMonto) => {
  return Number(maxMonto) <= 100000;
};

export const maxMontoMessage = "El monto máximo no puede ser mayor a 100,000.";

export const validateMontoRelation = (minMonto, maxMonto) => {
  return Number(minMonto) <= Number(maxMonto);
};

export const montoRelationMessage = "El monto mínimo no puede ser mayor que el máximo.";

export const validateTasaInteres = (tasaInteres) => {
  return Number(tasaInteres) >= 5;
};

export const tasaInteresMessage = "La tasa de interés no puede ser menor al 5%.";

export const validateMontoInversion = (monto, minMonto, maxMonto) => {
  const montoNumber = Number(monto);
  return montoNumber >= Number(minMonto) && montoNumber <= Number(maxMonto);
};

export const montoInversionMessage = "El monto a invertir debe estar dentro del rango permitido.";

