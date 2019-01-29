import {getSession, getToken, login} from "./auth";
import 'whatwg-fetch'

class Client {
    constructor() {
        this.baseUrl = "https://graph.microsoft.com/v1.0/"
        this.token = undefined
        this.session = undefined
    }
    api(request, params = {}) {
        const paramKeys = Object.keys(params)
        const searchQuery = paramKeys.length ?
            `?` + paramKeys.map(
            param => `${param}=${params[param]}`
            ).join(`&`)
            : ''
        const url = this.baseUrl + request + searchQuery
        return {
            get: async () => {
                await this.connect()
                const result = await fetch(url, {
                    method: "GET",
                    headers: new Headers({
                        Authorization: `Bearer ${this.token}`
                    }),
                })
                const json = await result.json()
                return json.value ? json.value : json
            }
        }
    }

    get online() {
        const currentTime = (new Date()).getTime() / 1000
        return this.session && this.session.access_token && this.session.expires > currentTime
    }

    async connect() {
        // Get a new token if the current one expired.
        await login()
        this.session = await getSession();
        this.token = getToken(this.session)
    }
}

const client = new Client()
const api = client.api.bind(client)

export default api
