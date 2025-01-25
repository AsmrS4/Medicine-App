export const phoneNumberIsValid = (phoneNumber) => {
    const pattern = /^\s?(\+\s?7|8)([- ()]*\d){10}$/;
    if (!phoneNumber.match(pattern)) {
        return false;
    }
    return true;
}