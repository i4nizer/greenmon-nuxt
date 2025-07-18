import { z } from "zod"
import { Token, User } from "~~/server/models"

//

const EmailSchema = z.object({ email: z.string().email() })

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const bodyResult = await readValidatedBody(event, EmailSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))

	// --- Find Email User
	const user = await User.findOne({ where: { email: bodyResult.data.email } })
	if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
	if (!user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User not verified." }))

	// --- Find Token for its Time
	let token = await Token.findOne({ where: { type: "RESET", userId: user.id } })
	if (!token)
		return sendError(event, createError({ statusCode: 400, statusMessage: "User didn't request for password reset." }))

	// --- Time
	return { time: token.updatedAt.getTime() }
})
