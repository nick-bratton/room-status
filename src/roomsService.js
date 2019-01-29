import api from "./api";

export async function getRooms(prefix = 'Room') {
    return await api(
        `users`,
        {
            "$filter": `startswith(displayName, '${prefix}')`
        }
    ).get()
}
