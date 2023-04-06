import { pusher } from "@/config/pusher";
import { ExtendedRequest } from "@/types";
import { NextApiResponse } from "next";

const auth = async (req: ExtendedRequest, res: NextApiResponse) => {
    const socketId = req.body.socket_id;
    const reqUser = req.user
    // Replace this with code to retrieve the actual user id and info
    const user = {
      id: reqUser._id,
      user_info: {...reqUser},
      watchlist: []
    };
    const authResponse = pusher.authenticateUser(socketId, user);
    res.send(authResponse);
  }

export {
    auth
}