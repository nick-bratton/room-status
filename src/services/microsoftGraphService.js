import {
    getSession, 
    getToken, 
    login
} from "./authService";
import 'whatwg-fetch'

function appendParameter(params){
    const paramKeys = Object.keys(params)
    return paramKeys.map(
        param => `${param}=${params[param]}`
    ).join(`&`)
}

/**
 * 
 * @param {Client} client 
 */
function getJSONfromAPI(client, url){
    return async ()=>{
        await client.connect();
        const requestOptions = {
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${client.token}`
            }),
        }

        const result = await fetch(url, requestOptions)
            .catch(e => {
                throw new Error(e)
            })
        
        const json = await result.json()
        if(!json) {
            throw new Error('Could not decode JSON')
        }

        if(json.error) {
            throw new Error(json.error.message)
        }

        return json.value ? json.value : json
    }
}

class Client {
    session = undefined;
    baseUrl = "https://graph.microsoft.com/v1.0/"
    token   = undefined;

    constructor() {
        login();
    }

    api(request, params = {}) {
        const paramKeys = Object.keys(params)
        const searchQuery = 
            paramKeys.length 
            ? `?` + appendParameter(params)
            : ''
        
        const url = this.baseUrl + request + searchQuery
        
        return {
            get: getJSONfromAPI(this, url)
        }
    }

    async connect() {
        // Get a new token if the current one expired.
        await login(true)
        this.session = await getSession();
        this.token   = await getToken(this.session); 
    }
}

const client = new Client()
const api = client.api.bind(client)

export default api
