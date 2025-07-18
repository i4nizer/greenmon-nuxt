import { User } from "~~/server/models"
import { UserAccountSchema, UserSafeSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Filter Updates
	const bodyResult = await readValidatedBody(event, UserAccountSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const body = bodyResult.data

	// --- Find & Update
	const user = await User.findByPk(payload.id)
	if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "User not found" }))
	await user.update(body)

	// --- Send Result
	return UserSafeSchema.parse(user.dataValues)
})
