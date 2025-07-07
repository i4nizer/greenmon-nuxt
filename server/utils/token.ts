import jwt from "jsonwebtoken"

//

type TokenType = "ACCESS" | "REFRESH" | "RESET" | "VERIFY" | "MCU" | "CAMERA" | "GREENHOUSE"
type SafeVerifyResult =
    { data: string | jwt.JwtPayload, error?: undefined, success: true }
    | { data?: undefined, error: jwt.VerifyErrors | Error, success: false }

//

const getLife = (type: TokenType) => { 
    switch (type) {
        case "ACCESS": return parseInt(process.env.NUXT_JWT_ACCESS_LIFE as string)
        case "REFRESH": return parseInt(process.env.NUXT_JWT_REFRESH_LIFE as string)
        case "RESET": return parseInt(process.env.NUXT_JWT_RESET_LIFE as string)
        case "VERIFY": return parseInt(process.env.NUXT_JWT_VERIFY_LIFE as string)
        case "MCU": return parseInt(process.env.NUXT_JWT_MCU_LIFE as string)
        case "CAMERA": return parseInt(process.env.NUXT_JWT_CAMERA_LIFE as string)
        case "GREENHOUSE": return parseInt(process.env.NUXT_JWT_GREENHOUSE_LIFE as string)
        default: return parseInt(process.env.NUXT_JWT_ACCESS_LIFE as string)
    }
}

const getSecret = (type: TokenType) => {
    switch (type) {
        case "ACCESS": return process.env.NUXT_JWT_ACCESS_SECRET as string
        case "REFRESH": return process.env.NUXT_JWT_REFRESH_SECRET as string
        case "RESET": return process.env.NUXT_JWT_RESET_SECRET as string
        case "VERIFY": return process.env.NUXT_JWT_VERIFY_SECRET as string
        case "MCU": return process.env.NUXT_JWT_MCU_SECRET as string
        case "CAMERA": return process.env.NUXT_JWT_CAMERA_SECRET as string
        case "GREENHOUSE": return process.env.NUXT_JWT_GREENHOUSE_SECRET as string
        default: return process.env.NUXT_JWT_ACCESS_SECRET as string
    }
}

const createToken = (payload: string | Buffer | object, type: TokenType) => {
    const life = getLife(type)
    const secret = getSecret(type)
    return jwt.sign(payload, secret, { expiresIn: life })
}

const verifyToken = (token: string, type: TokenType) => {
    const secret = getSecret(type)
    return jwt.verify(token, secret)
}

const safeVerifyToken = (token: string, type: TokenType): SafeVerifyResult => {
    try {
        const secret = getSecret(type)
        const data = jwt.verify(token, secret)
        return { data, success: true }
    } catch (error) {
        if (error instanceof jwt.NotBeforeError) return { error: error as jwt.NotBeforeError, success: false }
        else if (error instanceof jwt.TokenExpiredError) return { error: error as jwt.TokenExpiredError, success: false }
        else if (error instanceof jwt.JsonWebTokenError) return { error: error as jwt.JsonWebTokenError, success: false }
        else return { error: error as Error, success: false }
    }
}

//

export {
    type TokenType,
    type SafeVerifyResult,
    jwt,
    createToken,
    verifyToken,
    safeVerifyToken,
}