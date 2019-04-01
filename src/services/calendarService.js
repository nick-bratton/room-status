import api from './microsoftGraphService.js'
import startOfDay from 'date-fns/start_of_day'
import {format as formatTime} from 'date-fns'

export async function getCalendarEntries(
    roomId,
    start = startOfDay(new Date()),
    end = new Date(new Date().setDate(new Date().getDate() + 5))
) {
    return await api(
        `users/${roomId}/calendarView?startDateTime=${formatTime(start, "YYYY-MM-DDThh:mm:ss.0000000")}&endDateTime=${formatTime(end, "YYYY-MM-DDThh:mm:ss.0000000")}`
    )
        .get()
        .catch((e) => {
            console.warn(e)
            return getFakeEntries()
        })
}

export function getCurrentEntry(entries) {
    const now = new Date()
    return entries.find((entry) => {
        return entry.start <= now && now <= entry.end
    })
}

// Array.find returns the first element that satisfies the passed in function,
// so this will return the first session that starts later than now and ignore all subsequent ones.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
export function getNextEntry(entries) {
    const now = new Date()
    return entries.find((entry) => {
        return now < entry.start
    })
}

// Returns the next available time between calendar entries.
export function getNextFreeTime(entries) {
    // For now there is no minimum amount of time for the room to be considered available.
    const minimumTimeInBetweenInMilliseconds = 0
    const now = new Date()
    for (let i = 0; i < entries.length; i++) {
        const notEnded = now <= entries[i].end
        const isLastEntry = i === entries.length - 1
        const enoughSpaceInBetween = isLastEntry || new Date(entries[i].end.getMilliseconds() + minimumTimeInBetweenInMilliseconds) < entries[i + 1].start
        if (notEnded && enoughSpaceInBetween) {
            return entries[i].end
        }
    }
}

// If a meeting is taking place,
// returns a number between 0 and 1 indicating how much of the meeting has run.
export function getProgressUntilEntryEnd(entry, maximumDistance = Infinity) {
    const now = new Date()
    const entryTotalTime = entry.end - entry.start
    const remaining = entry.end - now
    if (maximumDistance < remaining) {
        return 0
    }
    else {
        const elapsed = now - entry.start
        return elapsed / entryTotalTime
    }
}

// If the room is free and one hour or less is left until the next meeting,
// returns how much of _the last hour_ has run.
// If the room is free and more than one hour is left until the next meeting,
// returns 0.
export function getProgressUntilNextEntry(nextEntry) {
    const now = new Date()
    const remaining = nextEntry.start - now
    const anHour = 1000 * 3600
    return 1 - remaining / anHour
}

export function getFakeEntries() {
    const now = new Date()
    const people = [{
        emailAddress: {
            name: "Max Mustermann"
        }
    }]
    const entriesTimes = [
        ['10:30', '12:00'],
        ['14:00', '14:30'],
        ['14:00', '15:30'],
        ['16:00', '18:00']
    ]
    const entries = []
    for (const entryTimes of entriesTimes) {
        const [startHours, startMinutes] = entryTimes[0].split(':').map(str => Number(str))
        const [endHours, endMinutes] = entryTimes[1].split(':').map(str => Number(str))
        const start = {
            dateTime: new Date(new Date(now.setHours(startHours)).setMinutes(startMinutes))
        }
        const end = {
            dateTime: new Date(new Date(now.setHours(endHours)).setMinutes(endMinutes))
        }
        const entry = {
            start,
            end,
            attendees: people,
            organizer: people[0]
        }
        entries.push(entry)
    }
    return entries
}

