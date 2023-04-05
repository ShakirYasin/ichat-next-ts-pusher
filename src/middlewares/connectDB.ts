import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import dbConnect from "@/config/db";
import { ExtendedRequest } from "@/types";


export default async function initDB (req: ExtendedRequest, res: NextApiResponse, next: NextHandler) {
    await dbConnect()
    next()
} 