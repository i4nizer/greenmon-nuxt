import { z } from "zod"
import type { SendMailOptions } from "nodemailer"
import prisma from "~/lib/prisma"

//

const EmailSchema = z.object({ email: z.string().email() })

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, EmailSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Check Email User
    const user = await prisma.user.findUnique({ where: { email: bodyResult.data.email } })
    if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
    if (!user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User not verified." }))

    // --- Check Existing Reset Token
    let token = await prisma.token.findFirst({ where: { type: "RESET", userId: user.id } })
    if (token) {
        const tokenResult = safeVerifyToken(token.token, "RESET")
        if (!tokenResult.success) await prisma.token.delete({ where: { id: token.id } })
        token = !tokenResult.success ? null : token
    }

    // --- Missing? Create Reset Token
    if (!token) {
        const payload = user as { id: number, name: string, email: string }
        const resetToken = createToken(payload, "RESET")
        token = await prisma.token.create({ data: { type: "RESET", token: resetToken, userId: user.id } })
    }

    // --- Validation: Email request cooldown based on updatedAt.
    const cooldownMs = token.updatedAt.getTime() + 60000
    if (Date.now() < cooldownMs) {
        const cooldownSec = cooldownMs == 0 ? 0 : ((cooldownMs - Date.now()) / 1000)
        const errorMsg = `Please wait another ${cooldownSec.toFixed(0)}s before trying again.`
        return sendError(event, createError({ statusCode: 400, statusMessage: errorMsg }))
    }
    else token = await prisma.token.update({ data: { updatedAt: new Date() }, where: { id: token.id } })

    // --- Send Reset Link
    const url = `${getRequestProtocol(event)}://${getRequestHost(event)}/auth/password/reset`
    const query = `?email=${user.email}&token=${token.token}`
    const renderResult = await safeRenderTemplate("RESET-PASSWORD", { name: user.name, link: url + query })
    if (!renderResult.success) return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to send email, render failed." }))
    const mail: SendMailOptions = { to: user.email, subject: "Reset Password - Greenmon", html: renderResult.data }
    event.waitUntil(safeSendMail(mail))

    // --- Redirect to Display Sent
    return { time: token.updatedAt.getTime() }
})