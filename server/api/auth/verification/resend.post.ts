import type { SendMailOptions } from "nodemailer"
import { safeVerifyToken } from "~~/server/utils/token"
import { safeSendMail } from "~~/server/utils/mail"
import { Token, User } from "~~/server/models"
import { UserEmailSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const bodyResult = await readValidatedBody(event, UserEmailSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))

	// --- Find Email User
	const user = await User.findOne({ where: { email: bodyResult.data.email } })
	if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
	if (user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User already verified." }))

	// --- Validation: System anomaly, signed-up without verification token.
	let token = await Token.findOne({ where: { type: "Verify", userId: user.id } })
	if (!token) {
		const { id, name, email } = user.dataValues
		const payload = { id, name, email }
		const verifyToken = createToken(payload, "Verify")
		token = await Token.create({ value: verifyToken, type: "Verify", userId: user.id })
	}

	// --- Validation: Email request cooldown based on updatedAt.
	const cooldownMs = token.updatedAt.getTime() + 60000
	token.changed("updatedAt", true)
	if (Date.now() < cooldownMs) {
		const cooldownSec = cooldownMs == 0 ? 0 : (cooldownMs - Date.now()) / 1000
		const errorMsg = `Please wait another ${cooldownSec.toFixed(0)}s before trying again.`
		return sendError(event, createError({ statusCode: 400, statusMessage: errorMsg }))
	} else await token.update({ updatedAt: new Date() })

	// --- Validation: Token could be expired or invalid, either way system created it.
	const tokenResult = safeVerifyToken(token.value, "Verify")
	if (!tokenResult.success) {
		const { id, name, email } = user.dataValues
		const payload = { id, name, email }
		const verifyToken = createToken(payload, "Verify")
		const [rows, tokens] = await Token.update(
			{ value: verifyToken, type: "Verify", userId: user.id },
			{ where: { id: token.id }, limit: 1, returning: true }
		)
		token = tokens.at(0) ?? token
	}

	// --- Email Verification
	const url = `${getRequestProtocol(event)}://${getRequestHost(event)}/auth/verification/verify`
	const query = `?email=${user.email}&token=${token.value}`
	const html = await renderTemplate("Verification", { name: user.name, link: url + query })
	const mail: SendMailOptions = { to: user.email, subject: "Account Verification - Greenmon", html }
	event.waitUntil(safeSendMail(mail))

	// --- Just Provide Time
	return { time: token.updatedAt.getTime() }
})
