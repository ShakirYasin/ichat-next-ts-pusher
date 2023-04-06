import Pusher, {Options} from "pusher"
import PusherClient from "pusher-js"
import axios from "@/utils/axios"

let cached = global.pusher

if(!cached) {
    cached = global.pusher = null
}

function pusherConnect (): Pusher {
    if (cached) {
      return cached
    }
  
    cached = new Pusher({
        appId: process.env.NEXT_PUBLIC_APP_ID as string,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
        secret: process.env.NEXT_PUBLIC_PUSHER_SECRET as string,
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        useTLS: true,
    });
    return cached
  }

// function pusherClientConnect (): PusherClient {

//   const pusher = 

//   return pusher
// }

const pusher = pusherConnect()
// const pusherClient = pusherClientConnect()


export {
  pusher,
  // pusherClient
}