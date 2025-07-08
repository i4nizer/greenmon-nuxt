import type { SendMailOptions } from "nodemailer"
import { z } from "zod"
import { safeVerifyToken } from "~/server/utils/token"
import { safeSendMail } from "~/server/utils/mail"
import { Token, User } from "~/server/models"

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
    if (user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User already verified." }))
    
    // --- Validation: System anomaly, signed-up without verification token.
    let token = await Token.findOne({ where: { type: "Verify", userId: user.id } })
    if (!token) {
        const config = useRuntimeConfig(event)
        const payload = user.dataValues as { id: number, name: string, email: string }
        const verifyToken = createToken(payload, "Verify")
        const tokenExpiry = new Date(Date.now() + config.NUXT_JWT_VERIFY_LIFE * 1000)
        token = await Token.create({ value: verifyToken, type: "Verify", expiry: tokenExpiry, userId: user.id })
    }

    // --- Validation: Email request cooldown based on updatedAt.
    const cooldownMs = token.updatedAt.getTime() + 60000
    if (Date.now() < cooldownMs) {
        const cooldownSec = cooldownMs == 0 ? 0 : ((cooldownMs - Date.now()) / 1000)
        const errorMsg = `Please wait another ${cooldownSec.toFixed(0)}s before trying again.`
        return sendError(event, createError({ statusCode: 400, statusMessage: errorMsg }))
    }
    else await Token.update({ updatedAt: new Date() }, { where: { id: token.id }, returning: true })

    // --- Validation: Token could be expired or invalid, either way system created it.
    const tokenResult = safeVerifyToken(token.value, "Verify")
    if (!tokenResult.success) {
        const payload = user.dataValues as { id: number, name: string, email: string }
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