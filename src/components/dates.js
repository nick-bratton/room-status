import startOfDay from 'date-fns/start_of_day'

// Returns whether two JavaScript dates are from the same day
export function isSameDay(date1, date2) {
    return startOfDay(date1).getTime() === startOfDay(date2).getTime()}
