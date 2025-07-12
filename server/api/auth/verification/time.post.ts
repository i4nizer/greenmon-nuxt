import { Token, User } from "~/server/models"
import { UserEmailSchema } from "~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, UserEmailSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Find Email User
    const user = await User.findOne({ where: { email: bodyResult.data.email } })
    if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
    if (user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User already verified." }))
    
    // --- Validation: System anomaly, not verified but no verification token.
    let token = await Token.findOne({ where: { type: "Verify", userId: user.id } })
    if (!token) {
        const { id, name, email } = user.dataValues
		const payload = { id, name, email }
        const verifyToken = createToken(payload, "Verify")
        token = await Token.create({ value: verifyToken, type: "Verify", userId: user.id })
    }
    
    // --- Time
    return { time: token.updatedAt.getTime() }
})