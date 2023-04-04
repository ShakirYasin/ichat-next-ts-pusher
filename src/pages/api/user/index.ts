// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { allUsers, registerUser } from '@/controllers/user'
import authenticate from '@/middlewares/authenticate'
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if(req.method === "POST") {
        registerUser(req, res)
        return
    }

    if(req.method === "GET") {
        authenticate(async (req, res) => {
            await allUsers(req, res)
        })
        return
    }
}
