import { transformDateFromJSON } from "../converter/converter.js";

export const getCurrentDay = () => {
    let cdate = new Date();
    let today = cdate.toISOString().slice(0, 10);
    return today;
}

export const birthDateIsValid = (birthDate) => {
    const today = getCurrentDay();
    return (birthDate < today);
}

export const nextDateIsValid = (nextDate) => {
    let now = (new Date())
    now = new Date(now.getTime() + 420 * 60 * 1000).toISOString().slice(0, 16)
    if (nextDate) {
        nextDate = transformDateFromJSON(nextDate);
        return nextDate > now
    } else {
        return false
    }
}

export const inspectionDateIsValid = (inspectionDate, prevDate) => {
    console.log(prevDate)
    if (prevDate) {
        prevDate = prevDate.trim()
        prevDate = prevDate.slice(0, 16)
        let splited = prevDate.split(' ');
        let splitedDate = splited[0].split('.');
        splitedDate.reverse();
        prevDate = splitedDate[0] + '-' + splitedDate[1] + '-' + splitedDate[2] + 'T' + splited[1];
    } else {
        prevDate = null
    }

    let now = (new Date())
    now = new Date(now.getTime() + 420 * 60 * 1000).toISOString().slice(0, 16)
    return (inspectionDate < now && (prevDate !== null ? inspectionDate > prevDate : true))
}
