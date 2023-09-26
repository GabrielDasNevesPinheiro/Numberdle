// this file contains utility functions

export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    
    month = month < 10 ? Number(`0${month}`) : month;
    day = day < 10 ? Number(`0${day}`) : day;

    return new Date(year, month, day);
}
