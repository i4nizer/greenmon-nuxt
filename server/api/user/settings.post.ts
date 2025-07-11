import { User } from "~/server/models"
import { UserSchema } from "~/shared/schema/user"

//

const UserSettingsSchema = UserSchema.pick({ name: true, phone: true })

//

export default defineEventHandler(async (event) => {
    // --- Get Payload
    const authorized = !!event.context?.accessTokenPayload
    if (!authorized) return sendError(event, createError({ statusCode: 401, statusMessage: "Authorization required." }))
    const payload = event.context.accessTokenPayload as { id: number, name: string, email: string }

    // --- Filter Updates
    const bodyResult = await readValidatedBody(event, UserSettingsSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    const body = bodyResult.data
    
    // --- Update
    const [rows] = await User.update(
        { name: body.name, phone: body.phone },
        { where: { id: payload.id } }
    )

    // --- No Updates
    if (rows <= 0) return sendError(event, createError({ statusCode: 400, statusMessage: "User not found." }))
    
    return { user: body }
})