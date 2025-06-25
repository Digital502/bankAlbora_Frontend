export const validateUsername = (username) => {
    const regex = /^\S{3,25}$/

    return regex.test(username)
}

export const validateUsernameMessage = 'El username debe contener entre 3 y 25 caracteres sin espacios'