import type { SendMailOptions } from "nodemailer"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { safeVerifyToken } from "~/server/utils/token"

//

const VerifySchema = z.object({ token: z.string().jwt() })

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, VerifySchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Validate Token
    const tokenResult = safeVerifyToken(bodyResult.data.token, "VERIFY")
    if (!tokenResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: tokenResult.error.message }))
    const payload = tokenResult.data as { id: number, name: string, email: string }
    
    // --- Find Token
    const token = await prisma.token.findFirst({ where: { type: "VERIFY", token: bodyResult.data.token, userId: payload.id } })
    if (!token) return sendError(event, createError({ statusCode: 400, statusMessage: "Invalid verification token." }))
    
    // --- Verify & Blacklist
    const user = tokenResult.data as { id: number, name: string, email: string }
    await prisma.user.update({ data: { verified: true }, where: { id: user.id } })
    await prisma.token.delete({ where: { id: token.id } })

    // --- Verify: Inform verification success
    const renderResult = await safeRenderTemplate("VERIFICATION-SUCCESS", { name: user.name })
    if (!renderResult.success) return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to send email, render failed." }))
    const mail: SendMailOptions = { to: user.email, subject: "Account Verified - Greenmon", html: renderResult.data }
    event.waitUntil(safeSendMail(mail))

    // --- Redirect to Sign In
    return sendRedirect(event, `/auth/sign-in?email=${user.email}`)
})