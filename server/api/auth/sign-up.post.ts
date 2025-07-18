import bcrypt from "bcrypt"
import { UserSignUpSchema } from "~~/shared/schema/user"
import { createToken } from "~~/server/utils/token"
import { safeSendMail } from "~~/server/utils/mail"
import { SendMailOptions } from "nodemailer"
import { User, Token } from "~~/server/models/index"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const { data, error, success } = await readValidatedBody(event, UserSignUpSchema.safeParse)
	if (!success) return sendError(event, createError({ statusCode: 400, statusMessage: error.message }))

	// --- Email must not be taken
	const emailUser = await User.findOne({ where: { email: data.email } })
	if (emailUser != null) return sendError(event, createError({ statusCode: 400, statusMessage: "Email taken." }))

	// --- Encryption
	const passwordHash = await bcrypt.hash(data.password, 10)
	const user = await User.create({ ...data, password: passwordHash })

	// --- Token
	const { id, name, email } = user.dataValues
	const payload = { id, name, email }
	const verifyToken = createToken(payload, "Verify")
	const token = await Token.create({ value: verifyToken, type: "Verify", userId: user.id })

	// --- Email Verification
	const url = `${getRequestProtocol(event)}://${getRequestHost(event)}/auth/verification/verify`
	const query = `?email=${user.email}&token=${token.value}`
	const renderResult = await safeRenderTemplate("Verification", { name: user.name, link: url + query })
	if (!renderResult.success)
		return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to send email, render failed." }))
	const mail: SendMailOptions = { to: user.email, subject: "Account Verification - Greenmon", html: renderResult.data }
	event.waitUntil(safeSendMail(mail))

	// --- Redirection with Email to Display Sent
	return sendRedirect(event, `/auth/verification/sent?email=${user.email}`)
})
