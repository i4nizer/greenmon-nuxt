import type { SendMailOptions } from "nodemailer"
import { Token, User } from "~~/server/models"
import { UserEmailSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const bodyResult = await readValidatedBody(event, UserEmailSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))

	// --- Check Email User
	const user = await User.findOne({ where: { email: bodyResult.data.email } })
	if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
	if (!user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User not verified." }))

	// --- Check Existing Reset Token
	let token = await Token.findOne({ where: { type: "Reset", userId: user.id } })
	if (token) {
		const tokenResult = safeVerifyToken(token.value, "Reset")
		if (!tokenResult.success) await Token.destroy({ where: { id: token.id } })
		token = !tokenResult.success ? null : token
	}

	// --- Missing? Create Reset Token
	if (!token) {
		const { id, name, email } = user.dataValues
		const payload = { id, name, email }
		const resetToken = createToken(payload, "Reset")
		token = await Token.create({ type: "Reset", value: resetToken, userId: user.id })
	}

	// --- Validation: Email request cooldown based on updatedAt.
	const cooldownMs = token.updatedAt.getTime() + 60000
	token.changed("updatedAt", true)
	if (Date.now() < cooldownMs) {
		const cooldownSec = cooldownMs == 0 ? 0 : (cooldownMs - Date.now()) / 1000
		const errorMsg = `Please wait another ${cooldownSec.toFixed(0)}s before trying again.`
		return sendError(event, createError({ statusCode: 400, statusMessage: errorMsg }))
	} else await token.update({ updatedAt: new Date() })

	// --- Send Reset Link
	const url = `${getRequestProtocol(event)}://${getRequestHost(event)}/auth/recovery/reset`
	const query = `?email=${user.email}&token=${token.value}`
	const renderResult = await safeRenderTemplate("Reset-Password", { name: user.name, link: url + query })
	if (!renderResult.success)
		return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to send email, render failed." }))
	const mail: SendMailOptions = { to: user.email, subject: "Reset Password - Greenmon", html: renderResult.data }
	event.waitUntil(safeSendMail(mail))

	// --- Redirect to Display Sent
	return { time: token.updatedAt.getTime() }
})
