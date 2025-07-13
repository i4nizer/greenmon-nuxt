import { User } from "~/server/models"
import { UserAccountSchema } from "~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Filter Updates
	const bodyResult = await readValidatedBody(event, UserAccountSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const body = bodyResult.data

	// --- Update
	const [rows] = await User.update({ name: body.name, phone: body.phone }, { where: { id: payload.id } })

	// --- No Updates
	if (rows <= 0) return sendError(event, createError({ statusCode: 400, statusMessage: "User not found." }))

	return { user: body }
})
