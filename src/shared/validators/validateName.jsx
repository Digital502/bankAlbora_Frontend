export const validateName = (name) => {
    const regex = /^\S{3,25}$/

    return regex.test(name)
}

export const validateNameMessage = 'El nombre debe contener entre 3 y 25 caracteres sin espacios'