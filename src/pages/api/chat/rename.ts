// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { renameGroup } from '@/controllers/chat'
import authenticate from '@/middlewares/authenticate'
import initDB from '@/middlewares/connectDB';
import { ExtendedRequest } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";


const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
      res.status(404).end("Page is not found");
    },
})
.use(initDB, authenticate)
.put<ExtendedRequest, NextApiResponse>(renameGroup)
export default handler



// import dbConnect from '@/config/db'
// import { renameGroup } from '@/controllers/chat'
// import authenticate from '@/middlewares/authenticate'
// import type { NextApiRequest, NextApiResponse } from 'next'



// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//     const { method } = req
//     await dbConnect()

//     switch (method) {
//         case "PUT":
//             try {
//                 authenticate(async (req, res) => {
//                     await renameGroup(req, res)
//                 })
//             } catch (error: any) {
//                 res.status(400).json({ success: false, message: error.message })
//             }
//             break;
        
//         default: 
//             res.status(400).json({ success: false, message: `${method} request not allowed at this endpoint` })
//             break;
//     }
// }
