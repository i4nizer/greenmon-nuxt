import { z } from "zod"
import prisma from "~/lib/prisma"
import { SendMailOptions } from "nodemailer"
import { safeVerifyToken } from "~/server/utils/token"
import { safeSendMail } from "~/server/utils/mail"

//

const EmailSchema = z.object({ email: z.string().email() })

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, EmailSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Find Email User
    const user = await prisma.user.findUnique({ where: { email: bodyResult.data.email } })
    if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
    if (user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User already verified." }))
    
    // --- Validation: System anomaly, signed-up without verification token.
    let token = await prisma.token.findFirst({ where: { type: "VERIFY", userId: user.id } })
    if (!token) {
        const payload = user as { id: number, name: string, email: string }
        const verifyToken = createToken(payload, "VERIFY")
        token = await prisma.token.create({ data: { token: verifyToken, type: "VERIFY", userId: user.id } })
    }

    // --- Validation: Email request cooldown based on updatedAt.
    const cooldownMs = token.updatedAt.getTime() + 60000
    if (Date.now() < cooldownMs) {
        const cooldownSec = cooldownMs == 0 ? 0 : ((cooldownMs - Date.now()) / 1000)
        const errorMsg = `Please wait another ${cooldownSec.toFixed(0)}s before trying again.`
        return sendError(event, createError({ statusCode: 400, statusMessage: errorMsg }))
    }
    else token = await prisma.token.update({ data: { updatedAt: new Date() }, where: { id: token.id } })

    // --- Validation: Token could be expired or invalid, either way system created it.
    const tokenResult = safeVerifyToken(token.token, "VERIFY")
    if (!tokenResult.success) {
        const payload = user as { id: number, name: string, email: string }
        const verifyToken = createToken(payload, "VERIFY")
        token = await prisma.token.update({
            data: { token: verifyToken, type: "VERIFY", userId: user.id },
            where: { id: token.id }
        })
    }
    
    // --- Email Verification
    const url = `${getRequestProtocol(event)}://${getRequestHost(event)}/auth/verification/verify`
    const query = `?email=${user.email}&token=${token.token}`
    const html = await renderTemplate("VERIFICATION", { name: user.name, link: url + query })
    const mail: SendMailOptions = { to: user.email, subject: "Account Verification - Greenmon", html }
    event.waitUntil(safeSendMail(mail))
    
    // --- Just Provide Time
    return { time: token.updatedAt.getTime() }
})