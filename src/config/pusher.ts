import Pusher from "pusher"

let cached = global.pusher

if(!cached) {
    cached = global.pusher = null
}

function pusherConnect () {
    if (cached) {
      return cached
    }
  
    cached = new Pusher({
        appId: process.env.NEXT_PUBLIC_APP_ID as string,
        key: process.env.NEXT_PUBLIC_KEY as string,
        secret: process.env.NEXT_PUBLIC_SECRET as string,
        cluster: process.env.NEXT_PUBLIC_CLUSTER as string,
        useTLS: true,
    });
    console.log({cached});
    return cached
  }



export default pusherConnect()