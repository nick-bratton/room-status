import PubNub from 'pubnub'
export const pubnub = function connect(){
    let pubnub = new PubNub({
        publishKey: process.env.VUE_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.VUE_APP_PUBNUB_SUBSCRIBE_KEY,
        ssl: true
    })

    pubnub.addListener({
        message({message}){
            if(message["status"]) {
                const event = new CustomEvent(
                    message["status"]
                )
                proximityEvents.dispatchEvent(
                    event
                ) 
            }
        },
        presence(params){
        },
        status(status){
            console.log("status", status)
        }
        
    })

    pubnub.subscribe({
        channels:['blockpy']
    })

    return pubnub
}()

console.log("subscribed blockpy", pubnub)
/**
 * 
 */
export const proximityEvents = document

proximityEvents.addEventListener("far", ()=>{console.log("far")})
proximityEvents.addEventListener("near", ()=>{console.log("near")})