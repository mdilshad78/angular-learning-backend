import jwt from 'jsonwebtoken'

export interface JwtPayload {
    id: string;
    email: string;
}

export const generateToken = (payload: JwtPayload): string => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES) {
        throw new Error("ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY not defined in .env");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m"
    })
}