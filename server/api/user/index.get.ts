import { z } from "zod"
import { User } from "~~/server/models"
import { UserSchema } from "~~/shared/schema/user"

//

const AuthUserSchema = UserSchema.omit({ password: true })
type AuthUser = z.infer<typeof AuthUserSchema>

//

export default defineEventHandler(async (event) => {
	// --- Use Token as Identity
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Find user from payload
	const user = await User.findOne({ where: { id: payload.id } })
	if (!user) return sendError(event, createError({ statusCode: 404, statusMessage: "User not found." }))

	// --- Provide without password
	return { ...user.dataValues, password: undefined } as AuthUser
})
