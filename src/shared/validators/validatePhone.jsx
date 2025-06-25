export const validateNumber = (phone) => {
    const regex = /\S/

    return regex.test(phone)
}

export const validateNumberMessage = 'Es necesario llenar el campo'