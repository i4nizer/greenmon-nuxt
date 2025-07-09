import bcrypt from "bcrypt"
import { UserSchema } from "~/shared/schema/user"
import { Token, User } from "~/server/models"

//

const SignInUserSchema = UserSchema.pick({ email: true, password: true })

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, SignInUserSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Find & Check User
    const user = await User.findOne({ where: { email: bodyResult.data.email } })
    if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
    if (!user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User not verified." }))
    
    // --- Match Password
    const match = await bcrypt.compare(bodyResult.data.password, user.password)
    if (!match) return sendError(event, createError({ statusCode: 400, statusMessage: "Incorrect password." }))
    
    // --- Token
    const config = useRuntimeConfig(event)
    const { id, name, email } = user.dataValues
    const payload = { id, name, email }
    const accessToken = createToken(payload, "Access")
    const refreshToken = createToken(payload, "Refresh")

    // --- Refresh Token Create/Update
    const token = await Token.findOne({ where: { type: "Refresh", userId: user.id } })
    const tokenExpiry = new Date(Date.now() + (config.NUXT_JWT_REFRESH_LIFE * 1000))
    if (token) await Token.update({ value: refreshToken }, { where: { type: "Refresh", userId: user.id } })
    else await Token.create({ type: "Refresh", value: refreshToken, expiry: tokenExpiry, userId: user.id })
    
    // --- Server-Client Cookie
    setCookie(event, "access-token", accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: config.jwtAccessLife
    })
    
    // --- Server-Only Cookie
    setCookie(event, "refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: config.jwtRefreshLife
    })

    // --- Redirect to User Site
    return sendRedirect(event, "/user/greenhouse")
})