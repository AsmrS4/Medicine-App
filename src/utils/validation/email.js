import { birthDateIsValid } from './date.js'
import { phoneNumberIsValid } from './phone.js';
import { passwordIsValid } from './password.js';

export const emailIsValid = (email) => {

    const pattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    return pattern.test(String(email))
}

export const notEmpty = (value) => {
    return (value !== '' && value !== null)
}

export const profileDataAreValid = (data) => {
    return (notEmpty(data.name) && birthDateIsValid(data.birthday) && phoneNumberIsValid(data.phone) && emailIsValid(data.email));
}

export const registerDataAreValid = (data) => {
    return (notEmpty(data.email) && notEmpty(data.name) && notEmpty(data.speciality) && birthDateIsValid(data.birthday) && phoneNumberIsValid(data.phone) && emailIsValid(data.email) && passwordIsValid(data.password));
}

export default { emailIsValid, notEmpty, registerDataAreValid, profileDataAreValid }