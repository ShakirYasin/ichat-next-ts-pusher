import jwt from "jsonwebtoken"

const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.NEXT_PUBLIC_JWT_SECRET as string, {
        expiresIn: '30d'
    })
}

export default generateToken