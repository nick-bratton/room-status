import hello from 'hellojs'
import 'whatwg-fetch'
import startOfDay from 'date-fns/start_of_day'
import {format as formatTime} from 'date-fns'

const active_directory_id = process.env.VUE_APP_ACTIVE_DIRECTORY_ID
const application_id = process.env.VUE_APP_APPLICATION_ID

hello.init({
    activeDirectoryTenant: {
        name: "Active Diretory",
        oauth: {
            version: 2,
            auth: `https://login.microsoftonline.com/${active_directory_id}/oauth2/v2.0/authorize`,
            grant: `https://login.microsoftonline.com/${active_directory_id}/oauth2/v2.0/token`,
        },
        // base: 'https://www.graph.microsoft.com/v1.0/',
        form: false
    }
})
hello.init({"activeDirectoryTenant": application_id})

function login(){
    hello.login("activeDirectoryTenant",{
        display: "page",
        scope: encodeURIComponent([
            `https://graph.microsoft.com/Calendars.Read.Shared`,
            `https://graph.microsoft.com/User.ReadBasic.All`
        ].join(' ')),
        response_type: "token"
    })
}
async function getSession(){
    const session = hello("activeDirectoryTenant").getAuthResponse()
    return session
}

function getToken(session){
    return session.access_token;
}

var online = function(session) {
    var currentTime = (new Date()).getTime() / 1000;
	return session && session.access_token && session.expires > currentTime;
};

function connectAPI(baseUrl, _token){
    return (request, params={})=>{
        const token = _token()
        const paramKeys = Object.keys(params)
        const searchQuery = paramKeys.length ?
          `?` + paramKeys.map(
                param=>`${param}=${params[param]}`
            ).join(`&`)
          : ''

        const url = baseUrl + request + searchQuery
        return {
            async get(){
                const result = await fetch(url,{
                    method: "GET",
                    headers: new Headers({
                        Authorization: `Bearer ${token}`
                    }),
                })
                const json = await result.json()
                return json.value ? {value: json.value} : json
            }
        }
    }
}

export async function connectAd(){
    const session = await getSession();
    if(!online(session)) login()
    const token = getToken(session)

    const client = {
        baseUrl: "https://graph.microsoft.com/v1.0/",
        api: connectAPI(this.baseUrl, ()=>token)
    }
    return client
}

export async function getCalendarEntries(
    client,
    user,
    start=startOfDay(new Date()),
    end=new Date(new Date().setDate(new Date().getDate() + 5))
    ) {
    return await client.api(
        `users/${user}/calendarView?startDateTime=${formatTime(start, "YYYY-MM-DDThh:mm:ss.0000000")}&endDateTime=${formatTime(end, "YYYY-MM-DDThh:mm:ss.0000000")}`
    ).get()
}

export async function getRooms(client, prefix='Room') {
    return await client.api(
        `users`,
        {
            "$filter": `startswith(displayName, '${prefix}')`
        }
    ).get()
}

export async function isOnline(){
    const session = await getSession();
    return online(session)
}

export const client = {
    baseUrl: "https://graph.microsoft.com/v1.0/",
    token  : undefined,
    session: undefined,
    api: connectAPI("https://graph.microsoft.com/v1.0/", ()=>client.token),

    get online(){
        return online(this.session)
    },

    async connect(){
        this.session = await getSession();
        if(!this.online) login()
        this.token = getToken(this.session)
    }
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
    for(let i = 0; i < entries.length; i++) {
        const notEnded = now <= entries[i].end
        const isLastEntry = i === entries.length - 1
        const enoughSpaceInBetween = isLastEntry || new Date(entries[i].end.getMilliseconds() + minimumTimeInBetweenInMilliseconds) < entries[i+1].start
        if(notEnded && enoughSpaceInBetween) {
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
