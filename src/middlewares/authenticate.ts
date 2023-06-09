import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import type { NextApiRequest, NextApiResponse } from 'next'
import { ExtendedRequest, IUser } from "@/types";
import { NextHandler } from "next-connect";

interface DecodedToken {
    id: string;
}

const authenticate = async (req: ExtendedRequest, res: NextApiResponse, next: NextHandler) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get Token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify
            const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as DecodedToken

            // console.log(decoded);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password')
            
            next()

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

}

export default authenticate