export const validatePositiveNumber = (value) => {
  const number = Number(value);
  return !isNaN(number) && number > 0;
};

export const validatePositiveNumberMessage = "Debe ser un número mayor a 0.";