export const validateConfirmPassword = (pass, confPass) => {
    return pass === confPass
}

export const  validateConfirmPasswordMessage = 'Las contraseñas no coinciden'