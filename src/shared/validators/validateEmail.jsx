export const validateEmail = (correo) => {
    const regex = /\S+@\S+\.\S+/

    return regex.test(correo)
}

export const validateEmailMessage = 'Ingresa un correo válido'