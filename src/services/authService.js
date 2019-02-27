import hello from 'hellojs'

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

export async function getSession() {
    const session = hello("activeDirectoryTenant").getAuthResponse()
    return session
}

export function isOnline(session) {
    const currentTime = (new Date()).getTime() / 1000;
    return session && session.access_token && session.expires > currentTime;
}

export async function getToken(session) {
    return session.access_token;
}

export async function login(refresh=false) {
    return hello.login("activeDirectoryTenant", {
        display: refresh ? "none" : "page",
        scope: encodeURIComponent([
            `https://graph.microsoft.com/Calendars.Read.Shared`,
            `https://graph.microsoft.com/User.ReadBasic.All`
        ].join(' ')),
        force: false
    })
}
