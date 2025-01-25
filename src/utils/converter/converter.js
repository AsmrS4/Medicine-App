export const tranformDate = (date) => {
    if (date !== null) {
        date = date.slice(0, 10);
        let splitedDate = date.split('-');
        splitedDate.reverse();
        return splitedDate[0] + '.' + splitedDate[1] + '.' + splitedDate[2];
    }
    return null
}

export const tranformDateWithTime = (date) => {
    let thisDate = ""
    let time = ""
    if (date !== null) {
        thisDate = tranformDate(date)
        time = date.slice(11, 19)
        thisDate = thisDate + ' ' + time
        return thisDate
    }
    return null
}

export const transformDateFromJSON = (date) => {
    date = date.trim()
    date = date.slice(0, 16)
    let splited = date.split(' ');
    let splitedDate = splited[0].split('.');
    splitedDate.reverse();
    date = splitedDate[0] + '-' + splitedDate[1] + '-' + splitedDate[2] + 'T' + splited[1];

    return date.slice(0, 16)
}