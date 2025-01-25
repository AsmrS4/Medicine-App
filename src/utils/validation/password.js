export const passwordIsValid = (password) => {
    return String(password).length >= 6
}

export default passwordIsValid