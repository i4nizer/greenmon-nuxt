import { z } from "zod"
import { User } from "~/server/models"
import { UserSchema } from "~/shared/schema/user"

//

const AuthUserSchema = UserSchema.omit({ password: true })
type AuthUser = z.infer<typeof AuthUserSchema>

//

export default defineEventHandler(async (event) => {
    // --- Use Token as Identity
    const accessToken = getCookie(event, "access-token")
    if (!accessToken) return sendError(event, createError({ statusCode: 401, statusMessage: "Authorization required." }))
    
    const accessTokenResult = safeVerifyToken<{ id: number, name: string, email: string }>(accessToken, "Access")
    if (!accessTokenResult.success) return sendError(event, createError({ statusCode: 401, statusMessage: "Access invalidated." }))
    const payload = accessTokenResult.data
    
    // --- Find user from payload
    const user = await User.findOne({ where: { id: payload.id } })
    if (!user) return sendError(event, createError({ statusCode: 404, statusMessage: "User not found." }))
    
    // --- Provide without password
    return { ...user.dataValues, password: undefined } as AuthUser
})