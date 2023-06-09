// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { allUsers, registerUser } from '@/controllers/user';
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
.use(initDB)
.get<ExtendedRequest, NextApiResponse>(authenticate, allUsers)
.post<ExtendedRequest, NextApiResponse>(registerUser)
export default handler


// import dbConnect from '@/config/db'
// import { allUsers, registerUser } from '@/controllers/user'
// import authenticate from '@/middlewares/authenticate'
// import type { NextApiRequest, NextApiResponse } from 'next'



// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//     const { method } = req
//     await dbConnect()

//     switch (method) {
//         case "GET":
//             try {
//                 authenticate(async (req, res) => {
//                     await allUsers(req, res)
//                 })
//             } catch (error: any) {
//                 res.status(400).json({ success: false, message: error.message })
//             }
//             break;
            
//         case "POST":
//             try {
//                 registerUser(req, res)
//             } catch (error: any) {
//                 res.status(400).json({ success: false, message: error.message })
//             }
//             break;
        
//         default: 
//             res.status(400).json({ success: false, message: `${method} request not allowed at this endpoint` })
//             break;
//     }
// }
