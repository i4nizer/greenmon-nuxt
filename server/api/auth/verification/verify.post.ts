import type { SendMailOptions } from "nodemailer"
import { z } from "zod"
import { Token, User } from "~/server/models"
import { safeVerifyToken } from "~/server/utils/token"

//

const VerifySchema = z.object({ token: z.string().jwt() })

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, VerifySchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Validate Token
    const tokenResult = safeVerifyToken<{ id: number; name: string; email: string }>(bodyResult.data.token, "Verify")
    if (!tokenResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: tokenResult.error.message }))
    const user = tokenResult.data
    
    // --- Find Token
    const token = await Token.findOne({ where: { type: "Verify", value: bodyResult.data.token, userId: user.id } })
    if (!token) return sendError(event, createError({ statusCode: 400, statusMessage: "Invalid verification token." }))
    
    // --- Verify & Blacklist
    await User.update({ verified: true }, { where: { id: user.id } })
    await Token.destroy({ where: { id: token.id } })

    // --- Verify: Inform verification success
    const renderResult = await safeRenderTemplate("Verification-Success", { name: user.name })
    if (!renderResult.success) return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to send email, render failed." }))
    const mail: SendMailOptions = { to: user.email, subject: "Account Verified - Greenmon", html: renderResult.data }
    event.waitUntil(safeSendMail(mail))

    // --- Redirect to Sign In
    return sendRedirect(event, `/auth/sign-in?email=${user.email}`)
})