export const validateText = (text) => {
  const regex = /^(?!\s*$).+/; 
  
  return regex.test(text);
};

export const validateTextMessage = 'El texto no puede estar vacío.';
