export const validateSurname = (surname) => {
    const regex = /^\S{3,25}$/

    return regex.test(surname)
}

export const validateSurnameMessage = 'El surname debe contener entre 3 y 25 caracteres sin espacios'