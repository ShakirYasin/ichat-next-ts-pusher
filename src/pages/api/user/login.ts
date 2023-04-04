// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authUser } from '@/controllers/user'
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if(req.method === "POST") {
        console.log("Logged in");
        authUser(req, res)
        return
    }
}
