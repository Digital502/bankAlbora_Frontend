export const validatePassword = (contraseña) => {
  const regex = /^(?=.*[A-Z]).{5,}$/;    
  return regex.test(contraseña);
};

export const validatePasswordMessage = 'La contraseña debe tener al menos 5 caracteres y incluyendo una mayúscula';