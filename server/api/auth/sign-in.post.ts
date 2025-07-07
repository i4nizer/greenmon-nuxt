import bcrypt from "bcrypt"
import prisma from "~/lib/prisma"
import { UserSchema } from "~/shared/schema/user"

//

const SignInUserSchema = UserSchema.pick({ email: true, password: true })

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, SignInUserSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Find & Check User
    const user = await prisma.user.findFirst({ where: { email: bodyResult.data.email } })
    if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
    if (!user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User not verified." }))
    
    // --- Match Password
    const match = await bcrypt.compare(bodyResult.data.password, user.password)
    if (!match) return sendError(event, createError({ statusCode: 400, statusMessage: "Incorrect password." }))
    
    // --- Token
    const config = useRuntimeConfig()
    const payload = user as { id: number, name: string, email: string }
    const accessToken = createToken(payload, "ACCESS")
    const refreshToken = createToken(payload, "REFRESH")

    // --- Refresh Token Create/Update
    const token = await prisma.token.findFirst({ where: { type: "REFRESH", userId: user.id } })
    if (token) await prisma.token.update({ data: { token: refreshToken }, where: { userId_type: { type: "REFRESH", userId: user.id } } })
    else await prisma.token.create({ data: { type: "REFRESH", token: refreshToken, userId: user.id } })
    
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